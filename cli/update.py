#!/usr/bin/env python3
"""
Policy Synthesis Project — Phased Update CLI
=============================================

Subcommands:
  ontology      Sync ontology graph nodes and edges
  reimbursement Refresh reimbursement service types and CMMI models
  data-dict     Merge data dictionary / dataset catalog updates
  impact        Run impact analysis for a given entity
  sources       Manage the source corpus
  test          Run regression and interaction tests

Usage examples::

    python update.py ontology --sync --validate
    python update.py reimbursement --refresh --dry-run
    python update.py data-dict --merge path/to/source.json
    python update.py impact --analyze ACO_REACH
    python update.py sources --list
    python update.py test --all

Requirements:
    Python 3.8+
    Optional: colorama (pip install colorama) for colored output
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
import datetime
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Colorama — graceful fallback if not installed
# ---------------------------------------------------------------------------
try:
    from colorama import Fore, Style, init as colorama_init
    colorama_init(autoreset=True)
    _HAS_COLOR = True
except ImportError:
    _HAS_COLOR = False

    class _Fore:  # noqa: D101
        RED = YELLOW = GREEN = CYAN = MAGENTA = BLUE = WHITE = RESET = ""

    class _Style:  # noqa: D101
        BRIGHT = DIM = RESET_ALL = ""

    Fore   = _Fore()    # type: ignore[assignment]
    Style  = _Style()   # type: ignore[assignment]


# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(message)s"
logging.basicConfig(format=LOG_FORMAT, level=logging.INFO, datefmt="%H:%M:%S")
logger = logging.getLogger("policy-update")


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT  = Path(__file__).resolve().parent.parent
DATA_DIR   = REPO_ROOT / "data"
JS_DIR     = REPO_ROOT / "js"
INDEX_HTML = REPO_ROOT / "index.html"

DATA_FILES: dict[str, Path] = {
    "nodes":         DATA_DIR / "ontology_nodes.json",
    "edges":         DATA_DIR / "ontology_edges.json",
    "cmmi_models":   DATA_DIR / "cmmi_models.json",
    "service_types": DATA_DIR / "service_types.json",
    "datasets":      DATA_DIR / "datasets.json",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _c(text: str, color: str, bright: bool = False) -> str:
    """Return colorized text if colorama is available."""
    prefix = (Style.BRIGHT if bright else "") + color if _HAS_COLOR else ""
    suffix = Style.RESET_ALL if _HAS_COLOR else ""
    return f"{prefix}{text}{suffix}"


def _ok(msg: str)   -> None: print(_c("  [OK]  ", Fore.GREEN,  bright=True) + msg)
def _warn(msg: str) -> None: print(_c("  [WRN] ", Fore.YELLOW, bright=True) + msg)
def _err(msg: str)  -> None: print(_c("  [ERR] ", Fore.RED,    bright=True) + msg)
def _info(msg: str) -> None: print(_c("  [-->] ", Fore.CYAN)   + msg)
def _head(msg: str) -> None: print("\n" + _c("=" * 60, Fore.BLUE, bright=True) + "\n" + _c(f"  {msg}", Fore.WHITE, bright=True) + "\n" + _c("=" * 60, Fore.BLUE, bright=True))


def load_json(path: Path) -> Any:
    """Load and return parsed JSON from *path*. Raises on failure."""
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def save_json(path: Path, data: Any, dry_run: bool = False) -> None:
    """Serialize *data* to *path* as pretty-printed JSON.

    If *dry_run* is True, print what would be written instead.
    """
    serialized = json.dumps(data, indent=2, ensure_ascii=False)
    if dry_run:
        _info(f"[DRY RUN] Would write {len(serialized):,} bytes to: {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        fh.write(serialized)
    _ok(f"Saved: {path} ({len(serialized):,} bytes)")


def banner() -> None:
    """Print application banner."""
    print(_c("""
╔══════════════════════════════════════════════════════════╗
║      Policy Synthesis Project — Update CLI               ║
║      Healthcare Reference Materials                       ║
║      Version 1.0.0  |  2026                              ║
╚══════════════════════════════════════════════════════════╝
""", Fore.CYAN, bright=True))


# ---------------------------------------------------------------------------
# Schema Validation Stubs
# ---------------------------------------------------------------------------

def validate_node(node: dict, idx: int) -> list[str]:
    """Validate a single ontology node against the expected schema.

    Returns a list of error strings (empty list = valid).

    TODO: Replace stub validation with a proper JSON Schema library
          such as ``jsonschema`` (pip install jsonschema) and a schema
          definition file at ``data/schemas/ontology_node.schema.json``.
    """
    errors: list[str] = []
    required_fields = {"id", "name", "category", "ptype", "description", "links"}
    valid_categories = {"legislation", "rule", "program", "model", "agency"}

    for field in required_fields:
        if field not in node:
            errors.append(f"  Node[{idx}] missing required field: '{field}'")

    if "category" in node and node["category"] not in valid_categories:
        errors.append(f"  Node[{idx}] invalid category '{node['category']}'. Must be one of {valid_categories}")

    if "id" in node and not isinstance(node["id"], str):
        errors.append(f"  Node[{idx}] 'id' must be a string")

    if "links" in node and not isinstance(node["links"], list):
        errors.append(f"  Node[{idx}] 'links' must be an array")

    return errors


def validate_edge(edge: dict, idx: int, node_ids: set[str]) -> list[str]:
    """Validate a single ontology edge.

    Returns a list of error strings (empty list = valid).

    TODO: Extend with relationship-type validation once an edge schema
          definition is established.
    """
    errors: list[str] = []
    required_fields = {"source", "target", "label"}

    for field in required_fields:
        if field not in edge:
            errors.append(f"  Edge[{idx}] missing required field: '{field}'")

    if "source" in edge and edge["source"] not in node_ids:
        errors.append(f"  Edge[{idx}] unknown source node id: '{edge['source']}'")

    if "target" in edge and edge["target"] not in node_ids:
        errors.append(f"  Edge[{idx}] unknown target node id: '{edge['target']}'")

    return errors


def validate_dataset(ds: dict, idx: int) -> list[str]:
    """Validate a single dataset entry.

    TODO: Add jsonschema-based validation against a formal schema file.
    """
    errors: list[str] = []
    required_fields = {"name", "description", "category", "years", "unit", "payers", "states", "linkageIds"}
    valid_categories = {"Claims", "Enrollment", "Provider", "Survey", "Synthetic"}

    for field in required_fields:
        if field not in ds:
            errors.append(f"  Dataset[{idx}] missing required field: '{field}'")

    if "category" in ds and ds["category"] not in valid_categories:
        errors.append(f"  Dataset[{idx}] unknown category '{ds['category']}'")

    if "payers" in ds and not isinstance(ds["payers"], list):
        errors.append(f"  Dataset[{idx}] 'payers' must be an array")

    return errors


# ---------------------------------------------------------------------------
# Subcommand: ontology
# ---------------------------------------------------------------------------

def cmd_ontology(args: argparse.Namespace) -> int:
    """Sync and optionally validate the ontology graph nodes and edges.

    --sync      Reload nodes/edges and update the embedded data in index.html
    --validate  Run schema validation on all nodes and edges
    --add-node  Path to a JSON file containing a new node or array of nodes
    --add-edge  Path to a JSON file containing a new edge or array of edges

    TODO:
        - Connect to a live CMS API or web scraper to pull updated legislation
          metadata (effective dates, Federal Register citations).
        - Implement auto-deduplication by node 'id'.
        - Generate a graph statistics report (degree distribution, connected
          components, shortest paths).
    """
    _head("ONTOLOGY SYNC")

    nodes_path = DATA_FILES["nodes"]
    edges_path = DATA_FILES["edges"]
    all_errors: list[str] = []

    # --- Load existing data ------------------------------------------------
    try:
        nodes = load_json(nodes_path)
        _info(f"Loaded {len(nodes)} nodes from {nodes_path.name}")
    except FileNotFoundError as exc:
        _err(str(exc)); return 1

    try:
        edges = load_json(edges_path)
        _info(f"Loaded {len(edges)} edges from {edges_path.name}")
    except FileNotFoundError as exc:
        _err(str(exc)); return 1

    # --- Add new nodes from file -------------------------------------------
    if args.add_node:
        src = Path(args.add_node)
        if not src.exists():
            _err(f"--add-node file not found: {src}"); return 1
        new_data = load_json(src)
        new_nodes = new_data if isinstance(new_data, list) else [new_data]
        existing_ids = {n["id"] for n in nodes if "id" in n}
        added = 0
        for nn in new_nodes:
            if nn.get("id") in existing_ids:
                _warn(f"Node '{nn.get('id')}' already exists — skipping.")
            else:
                nodes.append(nn)
                added += 1
        _ok(f"Added {added} new node(s)")
        if not args.dry_run:
            save_json(nodes_path, nodes, dry_run=args.dry_run)

    # --- Add new edges from file -------------------------------------------
    if args.add_edge:
        src = Path(args.add_edge)
        if not src.exists():
            _err(f"--add-edge file not found: {src}"); return 1
        new_data = load_json(src)
        new_edges = new_data if isinstance(new_data, list) else [new_data]
        nodes.append(new_edges)
        _ok(f"Added {len(new_edges)} new edge(s)")
        if not args.dry_run:
            save_json(edges_path, edges + new_edges, dry_run=args.dry_run)

    # --- Validate ----------------------------------------------------------
    if args.validate:
        _info("Running schema validation…")
        node_ids = {n.get("id") for n in nodes}

        for i, node in enumerate(nodes):
            all_errors.extend(validate_node(node, i))

        for i, edge in enumerate(edges):
            all_errors.extend(validate_edge(edge, i, node_ids))

        if all_errors:
            _warn(f"{len(all_errors)} validation error(s) found:")
            for e in all_errors:
                print(_c(e, Fore.YELLOW))
        else:
            _ok("All nodes and edges are valid.")

    # --- Sync (update index.html inline data) ------------------------------
    if args.sync:
        _info("Sync mode: updating inline JSON in index.html…")
        # TODO: Parse index.html, replace the window.__NODES__ and
        #       window.__EDGES__ script blocks with the current JSON.
        # For now, we print a summary of what would be synced.
        _warn("Sync to index.html not yet implemented. Run manually or use a build step.")
        _info(f"  Would embed {len(nodes)} nodes and {len(edges)} edges.")

    # --- Summary -----------------------------------------------------------
    print()
    _info(f"Ontology summary: {len(nodes)} nodes | {len(edges)} edges")
    category_counts: dict[str, int] = {}
    for n in nodes:
        cat = n.get("category", "unknown")
        category_counts[cat] = category_counts.get(cat, 0) + 1
    for cat, count in sorted(category_counts.items()):
        print(f"    {cat:<15}: {count}")

    return 1 if all_errors else 0


# ---------------------------------------------------------------------------
# Subcommand: reimbursement
# ---------------------------------------------------------------------------

def cmd_reimbursement(args: argparse.Namespace) -> int:
    """Refresh reimbursement service types and CMMI model data.

    --refresh   Reload data files and report on currency
    --dry-run   Show what would be written without writing
    --add-model Path to a JSON file with a new CMMI model to add

    TODO:
        - Pull CMMI model status updates from innovation.cms.gov
        - Auto-update model endDate when CMS announces model conclusion
        - Validate innovation model names in service_types.json against
          cmmi_models.json for referential integrity
    """
    _head("REIMBURSEMENT REFRESH")

    models_path = DATA_FILES["cmmi_models"]
    svc_path    = DATA_FILES["service_types"]
    all_errors: list[str] = []

    # --- Load data --------------------------------------------------------
    try:
        models = load_json(models_path)
        _info(f"Loaded {len(models)} CMMI models")
    except FileNotFoundError as exc:
        _err(str(exc)); return 1

    try:
        service_types = load_json(svc_path)
        _info(f"Loaded {len(service_types)} service types")
    except FileNotFoundError as exc:
        _err(str(exc)); return 1

    # --- Add new model ----------------------------------------------------
    if hasattr(args, "add_model") and args.add_model:
        src = Path(args.add_model)
        if not src.exists():
            _err(f"--add-model file not found: {src}"); return 1
        new_model = load_json(src)
        new_models = new_model if isinstance(new_model, list) else [new_model]
        existing_ids = {m["id"] for m in models if "id" in m}
        for nm in new_models:
            if nm.get("id") in existing_ids:
                _warn(f"Model '{nm.get('id')}' already exists — skipping.")
            else:
                models.append(nm)
                _ok(f"Added model: {nm.get('name', nm.get('id'))}")
        save_json(models_path, models, dry_run=args.dry_run)

    # --- Referential integrity check -------------------------------------
    if args.refresh:
        _info("Checking referential integrity…")
        model_names = {m["name"] for m in models}
        for st in service_types:
            for im_name in st.get("innovationModels", []):
                if im_name not in model_names:
                    all_errors.append(
                        f"  ServiceType '{st['name']}' references unknown model: '{im_name}'"
                    )

        if all_errors:
            _warn(f"{len(all_errors)} referential integrity issue(s):")
            for e in all_errors:
                print(_c(e, Fore.YELLOW))
        else:
            _ok("All innovation model references are valid.")

        # Model currency report
        today = datetime.date.today()
        active = [m for m in models if m.get("endDate") is None]
        ended  = [m for m in models if m.get("endDate") is not None]
        _info(f"Active models: {len(active)} | Ended models: {len(ended)}")

        # Warn on models with future startDate
        for m in models:
            try:
                sd = datetime.date.fromisoformat(m["startDate"])
                if sd > today:
                    _warn(f"Model '{m['name']}' has future start date: {m['startDate']}")
            except (KeyError, ValueError):
                pass

    _info("Reimbursement data refresh complete.")
    return 1 if all_errors else 0


# ---------------------------------------------------------------------------
# Subcommand: data-dict
# ---------------------------------------------------------------------------

def cmd_data_dict(args: argparse.Namespace) -> int:
    """Merge data dictionary / dataset catalog updates.

    --merge PATH    Merge a JSON or NDJSON file of new/updated datasets
    --validate      Validate the existing datasets.json
    --list          Print the current dataset catalog summary

    TODO:
        - Support merging from ResDAC data dictionary exports (CSV format).
        - Implement smart merge that compares fields and highlights diffs
          before writing.
        - Validate linkageId variable names against a master variable list.
    """
    _head("DATA DICTIONARY UPDATE")

    ds_path = DATA_FILES["datasets"]
    all_errors: list[str] = []

    # --- Load existing datasets ------------------------------------------
    try:
        datasets = load_json(ds_path)
        _info(f"Loaded {len(datasets)} datasets from {ds_path.name}")
    except FileNotFoundError as exc:
        _err(str(exc)); return 1

    # --- Validate --------------------------------------------------------
    if args.validate or True:  # always validate
        _info("Validating dataset schema…")
        for i, ds in enumerate(datasets):
            all_errors.extend(validate_dataset(ds, i))
        if all_errors:
            _warn(f"{len(all_errors)} validation error(s):")
            for e in all_errors:
                print(_c(e, Fore.YELLOW))
        else:
            _ok("All datasets pass schema validation.")

    # --- Merge -----------------------------------------------------------
    if args.merge:
        src = Path(args.merge)
        if not src.exists():
            _err(f"--merge source file not found: {src}"); return 1

        _info(f"Reading merge source: {src}")
        new_data = load_json(src)
        new_datasets = new_data if isinstance(new_data, list) else [new_data]

        existing_names = {d["name"] for d in datasets}
        added = updated = 0

        for nd in new_datasets:
            if nd.get("name") in existing_names:
                # Update existing entry
                for i, existing in enumerate(datasets):
                    if existing["name"] == nd["name"]:
                        datasets[i] = {**existing, **nd}
                        updated += 1
                        break
            else:
                datasets.append(nd)
                added += 1

        _ok(f"Merge complete: {added} added, {updated} updated.")
        save_json(ds_path, datasets, dry_run=args.dry_run)

    # --- List ------------------------------------------------------------
    if args.list:
        _info("Current dataset catalog:")
        by_cat: dict[str, list[str]] = {}
        for ds in datasets:
            cat = ds.get("category", "Unknown")
            by_cat.setdefault(cat, []).append(ds.get("name", "?"))
        for cat, names in sorted(by_cat.items()):
            print(f"\n  {_c(cat, Fore.CYAN, bright=True)} ({len(names)})")
            for name in sorted(names):
                print(f"    • {name}")

    return 1 if all_errors else 0


# ---------------------------------------------------------------------------
# Subcommand: impact
# ---------------------------------------------------------------------------

def cmd_impact(args: argparse.Namespace) -> int:
    """Run impact analysis for a given policy entity.

    --analyze ENTITY_ID   ID of the node to analyze (e.g. ACO_REACH, ACA)
    --depth N             Hop depth for neighbor traversal (default: 2)
    --format {text,json}  Output format

    TODO:
        - Compute downstream impact score based on number of dependent nodes.
        - Identify Medicare/Medicaid beneficiaries and payments affected
          (requires external spend data linkage).
        - Generate a human-readable impact summary report (PDF/HTML).
        - Integrate with CMS public data APIs for real-time stats.
    """
    _head("IMPACT ANALYSIS")

    if not args.analyze:
        _err("No entity specified. Use --analyze <ENTITY_ID>")
        return 1

    entity_id = args.analyze
    depth     = getattr(args, "depth", 2)
    fmt       = getattr(args, "format", "text")

    _info(f"Analyzing impact of entity: {_c(entity_id, Fore.CYAN, bright=True)}")
    _info(f"Traversal depth: {depth}")

    # --- Load graph -------------------------------------------------------
    try:
        nodes = load_json(DATA_FILES["nodes"])
        edges = load_json(DATA_FILES["edges"])
    except FileNotFoundError as exc:
        _err(str(exc)); return 1

    node_by_id = {n["id"]: n for n in nodes}

    if entity_id not in node_by_id:
        _err(f"Entity '{entity_id}' not found in ontology_nodes.json.")
        _info("Available IDs: " + ", ".join(sorted(node_by_id.keys())))
        return 1

    root = node_by_id[entity_id]
    _ok(f"Found: {root['name']} ({root['category']})")

    # --- BFS neighbor traversal ------------------------------------------
    def get_neighbors(node_id: str, direction: str = "both") -> list[dict]:
        """Return neighboring nodes up to one hop from *node_id*."""
        neighbors = []
        for edge in edges:
            src, tgt, lbl = edge.get("source"), edge.get("target"), edge.get("label", "")
            if direction in ("out", "both") and src == node_id and tgt in node_by_id:
                neighbors.append({"node": node_by_id[tgt], "edge_label": lbl, "direction": "→"})
            if direction in ("in",  "both") and tgt == node_id and src in node_by_id:
                neighbors.append({"node": node_by_id[src], "edge_label": lbl, "direction": "←"})
        return neighbors

    visited: set[str] = {entity_id}
    frontier: list[str] = [entity_id]
    layers: list[list[dict]] = []

    for hop in range(depth):
        next_frontier: list[str] = []
        layer_nodes: list[dict] = []
        for nid in frontier:
            for neighbor_info in get_neighbors(nid):
                nb_id = neighbor_info["node"]["id"]
                if nb_id not in visited:
                    visited.add(nb_id)
                    next_frontier.append(nb_id)
                    layer_nodes.append({
                        "from":       nid,
                        "to":         nb_id,
                        "name":       neighbor_info["node"]["name"],
                        "category":   neighbor_info["node"]["category"],
                        "edge_label": neighbor_info["edge_label"],
                        "direction":  neighbor_info["direction"],
                        "hop":        hop + 1
                    })
        layers.append(layer_nodes)
        frontier = next_frontier
        if not frontier:
            break

    # --- Output -----------------------------------------------------------
    if fmt == "json":
        result = {
            "entity":       entity_id,
            "name":         root["name"],
            "category":     root["category"],
            "depth":        depth,
            "total_reachable": len(visited) - 1,
            "layers":       layers
        }
        print(json.dumps(result, indent=2))
    else:
        print(f"\n  Root: {_c(root['name'], Fore.WHITE, bright=True)} [{root['category']}]")
        for i, layer in enumerate(layers, 1):
            print(f"\n  {_c(f'Hop {i}:', Fore.CYAN)} {len(layer)} connected node(s)")
            for item in layer:
                direction_label = "outbound" if item["direction"] == "→" else "inbound"
                print(f"    {item['direction']}  {_c(item['name'], Fore.WHITE)}  "
                      f"[{item['category']}]  via '{item['edge_label']}'  ({direction_label})")
        print(f"\n  {_c('Total reachable nodes:', Fore.GREEN)} {len(visited) - 1}")

    # --- TODO stubs -------------------------------------------------------
    _info("\nTODO: Link to CMS spending data for financial impact estimate.")
    _info("TODO: Identify beneficiary populations affected.")
    _info("TODO: Generate formatted impact report.")

    return 0


# ---------------------------------------------------------------------------
# Subcommand: sources
# ---------------------------------------------------------------------------

def cmd_sources(args: argparse.Namespace) -> int:
    """Manage and report on the source corpus.

    --list          List all source data files and their metadata
    --check         Verify all data files exist and are valid JSON
    --freshen       Update 'last_checked' timestamp in a sources manifest

    TODO:
        - Maintain a sources.json manifest with URL, last-retrieved date,
          and checksum for each source document.
        - Add support for downloading updated Federal Register notices
          via the govinfo.gov API.
        - Integrate with the CMS RSS feed for rule announcements.
    """
    _head("SOURCE CORPUS MANAGEMENT")

    # --- List all data files ---------------------------------------------
    if args.list:
        _info("Data files in corpus:")
        for key, path in DATA_FILES.items():
            if path.exists():
                size_kb = path.stat().st_size / 1024
                mtime   = datetime.datetime.fromtimestamp(path.stat().st_mtime)
                try:
                    data = load_json(path)
                    n_items = len(data) if isinstance(data, list) else "object"
                except Exception:
                    n_items = "?"
                print(f"  {_c(key, Fore.CYAN, bright=True):<20} "
                      f"{str(path.name):<40} "
                      f"{size_kb:>8.1f} KB  "
                      f"{n_items} items  "
                      f"modified {mtime:%Y-%m-%d %H:%M}")
            else:
                _warn(f"  {key:<20} MISSING: {path}")

    # --- Check all files are valid JSON ----------------------------------
    if args.check:
        _info("\nChecking JSON validity of all data files…")
        all_ok = True
        for key, path in DATA_FILES.items():
            try:
                data = load_json(path)
                _ok(f"{key}: valid ({len(data)} items)" if isinstance(data, list)
                    else f"{key}: valid (object)")
            except FileNotFoundError:
                _err(f"{key}: FILE NOT FOUND — {path}")
                all_ok = False
            except json.JSONDecodeError as exc:
                _err(f"{key}: JSON PARSE ERROR — {exc}")
                all_ok = False

        if all_ok:
            _ok("All source files are present and valid.")
        else:
            _err("Some source files have issues. See above.")
            return 1

    # --- Freshen manifest ------------------------------------------------
    if args.freshen:
        manifest_path = DATA_DIR / "sources_manifest.json"
        manifest: dict[str, Any] = {}
        if manifest_path.exists():
            manifest = load_json(manifest_path)

        now = datetime.datetime.utcnow().isoformat() + "Z"
        for key, path in DATA_FILES.items():
            if path.exists():
                manifest[key] = {
                    "path":           str(path.relative_to(REPO_ROOT)),
                    "last_checked":   now,
                    "size_bytes":     path.stat().st_size
                }

        save_json(manifest_path, manifest, dry_run=args.dry_run)
        _ok(f"Manifest updated: {manifest_path}")

    # --- TODO stubs -------------------------------------------------------
    _info("\nTODO: Add --download flag to pull updated CMS files.")
    _info("TODO: Integrate Federal Register API for rule tracking.")
    _info("TODO: Checksum verification for data integrity.")

    return 0


# ---------------------------------------------------------------------------
# Subcommand: test
# ---------------------------------------------------------------------------

def cmd_test(args: argparse.Namespace) -> int:
    """Run regression and interaction tests for the data and visualizations.

    --all           Run all test suites
    --ontology      Test ontology graph integrity
    --reimbursement Test reimbursement data integrity
    --datasets      Test dataset catalog integrity
    --links         Test that all external URLs are reachable (requires network)

    TODO:
        - Add Selenium/Playwright browser tests for the D3 visualizations.
        - Add property-based tests for edge referential integrity.
        - Add tests for the swimlane date scale (no overlapping model IDs).
        - Integrate with CI/CD (GitHub Actions) for automated testing.
    """
    _head("REGRESSION & INTEGRATION TESTS")

    failures: list[str] = []
    passes:   list[str] = []

    def run_test(name: str, fn):
        """Execute *fn* and record pass/fail."""
        try:
            result = fn()
            if result is True or result is None:
                passes.append(name)
                _ok(f"PASS  {name}")
            else:
                failures.append(f"{name}: {result}")
                _err(f"FAIL  {name}: {result}")
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{name}: {exc}")
            _err(f"FAIL  {name}: {exc}")

    # --- Test 1: All data files exist ------------------------------------
    def test_files_exist():
        missing = [k for k, p in DATA_FILES.items() if not p.exists()]
        if missing:
            return f"Missing files: {missing}"

    run_test("data-files-exist", test_files_exist)

    # --- Test 2: JSON validity -------------------------------------------
    def test_json_valid():
        for key, path in DATA_FILES.items():
            if path.exists():
                try:
                    load_json(path)
                except json.JSONDecodeError as exc:
                    return f"{key}: {exc}"

    run_test("json-validity", test_json_valid)

    # --- Test 3: Node IDs are unique ------------------------------------
    def test_node_ids_unique():
        try:
            nodes = load_json(DATA_FILES["nodes"])
        except FileNotFoundError:
            return "File not found"
        ids = [n.get("id") for n in nodes if "id" in n]
        dupes = [nid for nid in ids if ids.count(nid) > 1]
        if dupes:
            return f"Duplicate node IDs: {list(set(dupes))}"

    run_test("node-ids-unique", test_node_ids_unique)

    # --- Test 4: Edge referential integrity ------------------------------
    def test_edge_refs():
        try:
            nodes = load_json(DATA_FILES["nodes"])
            edges = load_json(DATA_FILES["edges"])
        except FileNotFoundError:
            return "File not found"
        node_ids = {n["id"] for n in nodes if "id" in n}
        bad = []
        for e in edges:
            if e.get("source") not in node_ids:
                bad.append(f"unknown source '{e.get('source')}'")
            if e.get("target") not in node_ids:
                bad.append(f"unknown target '{e.get('target')}'")
        if bad:
            return "; ".join(bad[:5]) + ("…" if len(bad) > 5 else "")

    run_test("edge-referential-integrity", test_edge_refs)

    # --- Test 5: CMMI model innovation reference integrity ---------------
    def test_innovation_refs():
        try:
            models       = load_json(DATA_FILES["cmmi_models"])
            service_types = load_json(DATA_FILES["service_types"])
        except FileNotFoundError:
            return "File not found"
        model_names = {m["name"] for m in models}
        bad = []
        for st in service_types:
            for im in st.get("innovationModels", []):
                if im not in model_names:
                    bad.append(f"'{im}' in '{st['name']}'")
        if bad:
            return "Unmatched model names: " + "; ".join(bad[:3])

    run_test("innovation-model-refs", test_innovation_refs)

    # --- Test 6: Node schema completeness --------------------------------
    def test_node_schema():
        try:
            nodes = load_json(DATA_FILES["nodes"])
        except FileNotFoundError:
            return "File not found"
        errors = []
        for i, n in enumerate(nodes):
            errors.extend(validate_node(n, i))
        if errors:
            return f"{len(errors)} schema error(s); first: {errors[0]}"

    run_test("node-schema-completeness", test_node_schema)

    # --- Test 7: Dataset schema completeness ----------------------------
    def test_dataset_schema():
        try:
            datasets = load_json(DATA_FILES["datasets"])
        except FileNotFoundError:
            return "File not found"
        errors = []
        for i, d in enumerate(datasets):
            errors.extend(validate_dataset(d, i))
        if errors:
            return f"{len(errors)} schema error(s); first: {errors[0]}"

    run_test("dataset-schema-completeness", test_dataset_schema)

    # --- Test 8: index.html exists ---------------------------------------
    def test_index_html():
        if not INDEX_HTML.exists():
            return f"index.html not found at {INDEX_HTML}"

    run_test("index-html-exists", test_index_html)

    # --- Test 9: CMMI model date ranges are valid -----------------------
    def test_model_dates():
        try:
            models = load_json(DATA_FILES["cmmi_models"])
        except FileNotFoundError:
            return "File not found"
        for m in models:
            try:
                sd = datetime.date.fromisoformat(m["startDate"])
                if m.get("endDate"):
                    ed = datetime.date.fromisoformat(m["endDate"])
                    if ed < sd:
                        return f"Model '{m['name']}' endDate before startDate"
            except (KeyError, ValueError) as exc:
                return f"Model '{m.get('name', '?')}' date parse error: {exc}"

    run_test("cmmi-model-date-ranges", test_model_dates)

    # --- TODO: Browser/visual tests ------------------------------------
    _info("\nTODO: Add Playwright browser tests for D3 visualizations.")
    _info("TODO: Add --links flag to test external URL availability.")
    _info("TODO: Integrate with GitHub Actions CI.")

    # --- Summary ---------------------------------------------------------
    print()
    total = len(passes) + len(failures)
    color = Fore.GREEN if not failures else Fore.RED
    print(_c(f"  Results: {len(passes)}/{total} tests passed", color, bright=True))
    if failures:
        print(_c(f"  {len(failures)} test(s) failed:", Fore.RED))
        for f in failures:
            print(f"    • {f}")

    return 1 if failures else 0


# ---------------------------------------------------------------------------
# Argument Parser
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    """Construct and return the top-level argument parser."""
    parser = argparse.ArgumentParser(
        prog="update.py",
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Enable debug-level logging"
    )
    sub = parser.add_subparsers(dest="command", metavar="<subcommand>")

    # --- ontology ---
    p_ont = sub.add_parser("ontology", help="Sync ontology graph nodes and edges")
    p_ont.add_argument("--sync",      action="store_true", help="Update inline JSON in index.html")
    p_ont.add_argument("--validate",  action="store_true", help="Run schema validation")
    p_ont.add_argument("--add-node",  metavar="PATH",       help="JSON file with node(s) to add")
    p_ont.add_argument("--add-edge",  metavar="PATH",       help="JSON file with edge(s) to add")
    p_ont.add_argument("--dry-run",   action="store_true",  help="Show actions without writing files")

    # --- reimbursement ---
    p_rei = sub.add_parser("reimbursement", help="Refresh reimbursement and CMMI model data")
    p_rei.add_argument("--refresh",   action="store_true", help="Reload and validate data")
    p_rei.add_argument("--add-model", metavar="PATH",      help="JSON file with model(s) to add")
    p_rei.add_argument("--dry-run",   action="store_true", help="Show actions without writing files")

    # --- data-dict ---
    p_dd = sub.add_parser("data-dict", help="Merge data dictionary / dataset catalog updates")
    p_dd.add_argument("--merge",    metavar="PATH",      help="JSON file to merge into datasets.json")
    p_dd.add_argument("--validate", action="store_true", help="Validate existing datasets.json")
    p_dd.add_argument("--list",     action="store_true", help="Print catalog summary")
    p_dd.add_argument("--dry-run",  action="store_true", help="Show actions without writing files")

    # --- impact ---
    p_imp = sub.add_parser("impact", help="Run impact analysis for a given entity")
    p_imp.add_argument("--analyze", metavar="ENTITY_ID",  help="Node ID to analyze")
    p_imp.add_argument("--depth",   type=int, default=2,  help="Traversal hop depth (default: 2)")
    p_imp.add_argument("--format",  choices=["text","json"], default="text", help="Output format")

    # --- sources ---
    p_src = sub.add_parser("sources", help="Manage source corpus")
    p_src.add_argument("--list",    action="store_true", help="List source files")
    p_src.add_argument("--check",   action="store_true", help="Verify all source files")
    p_src.add_argument("--freshen", action="store_true", help="Update sources manifest timestamps")
    p_src.add_argument("--dry-run", action="store_true", help="Show actions without writing files")

    # --- test ---
    p_tst = sub.add_parser("test", help="Run regression and integration tests")
    p_tst.add_argument("--all",           action="store_true", help="Run all tests")
    p_tst.add_argument("--ontology",      action="store_true", help="Test ontology only")
    p_tst.add_argument("--reimbursement", action="store_true", help="Test reimbursement only")
    p_tst.add_argument("--datasets",      action="store_true", help="Test datasets only")
    p_tst.add_argument("--links",         action="store_true", help="Test external URLs (network)")

    return parser


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

SUBCOMMAND_MAP = {
    "ontology":      cmd_ontology,
    "reimbursement": cmd_reimbursement,
    "data-dict":     cmd_data_dict,
    "impact":        cmd_impact,
    "sources":       cmd_sources,
    "test":          cmd_test,
}


def main(argv: list[str] | None = None) -> int:
    """Main entry point for the update CLI."""
    banner()
    parser = build_parser()
    args   = parser.parse_args(argv)

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
        logger.debug("Verbose mode enabled")

    if not args.command:
        parser.print_help()
        return 0

    handler = SUBCOMMAND_MAP.get(args.command)
    if not handler:
        _err(f"Unknown subcommand: {args.command}")
        return 1

    return handler(args)


if __name__ == "__main__":
    sys.exit(main())
