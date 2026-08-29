/* ============================================================
   taxonomy.js — Filterable & Sortable Dataset Catalog Table
   Policy Synthesis Project
   ============================================================ */

function initTaxonomy(datasets) {
  'use strict';

  const container = document.getElementById('taxonomy-container');
  if (!container) {
    console.warn('initTaxonomy: #taxonomy-container not found');
    return;
  }

  container.innerHTML = '';

  /* --- State -------------------------------------------- */
  let sortCol       = 'name';
  let sortAsc       = true;
  let filterText    = '';
  let filterCat     = '';
  let filterPayer   = '';
  const collapsedGroups = new Set();
  const expandedRows    = new Set();

  /* --- Extract unique values for selects ---------------- */
  const allCategories = [...new Set(datasets.map(d => d.category))].sort();
  const allPayers     = [...new Set(datasets.flatMap(d => d.payers))].sort();

  /* --- Stats Row ---------------------------------------- */
  const statsRow = document.createElement('div');
  statsRow.className = 'stats-row';
  statsRow.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${datasets.length}</div>
      <div class="stat-label">Total Datasets</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${allCategories.length}</div>
      <div class="stat-label">Categories</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${allPayers.length}</div>
      <div class="stat-label">Payer Types</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${[...new Set(datasets.map(d => d.unit))].length}</div>
      <div class="stat-label">Unit Types</div>
    </div>
  `;
  container.appendChild(statsRow);

  /* --- Filter Bar --------------------------------------- */
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search datasets…';
  searchInput.setAttribute('aria-label', 'Search datasets');

  const catSelect = document.createElement('select');
  catSelect.setAttribute('aria-label', 'Filter by category');
  catSelect.innerHTML = `<option value="">All Categories</option>` +
    allCategories.map(c => `<option value="${c}">${c}</option>`).join('');

  const payerSelect = document.createElement('select');
  payerSelect.setAttribute('aria-label', 'Filter by payer');
  payerSelect.innerHTML = `<option value="">All Payers</option>` +
    allPayers.map(p => `<option value="${encodeURIComponent(p)}">${p}</option>`).join('');

  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn-export';
  exportBtn.innerHTML = '&#11123; Export CSV';
  exportBtn.setAttribute('title', 'Download dataset catalog as CSV');

  filterBar.appendChild(searchInput);
  filterBar.appendChild(catSelect);
  filterBar.appendChild(payerSelect);
  filterBar.appendChild(exportBtn);
  container.appendChild(filterBar);

  /* --- Table Wrapper ------------------------------------ */
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';
  container.appendChild(wrapper);

  const table = document.createElement('table');
  table.setAttribute('aria-label', 'Dataset catalog');
  wrapper.appendChild(table);

  /* --- Table Head --------------------------------------- */
  const thead = document.createElement('thead');
  table.appendChild(thead);

  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);

  const COLUMNS = [
    { key: 'name',       label: 'Name'        },
    { key: 'category',   label: 'Category'    },
    { key: 'years',      label: 'Years'       },
    { key: 'unit',       label: 'Unit'        },
    { key: 'payers',     label: 'Payers',     sortable: false },
    { key: 'linkageIds', label: 'Linkage IDs', sortable: false }
  ];

  const thCells = {};
  COLUMNS.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col.label;
    if (col.sortable !== false) {
      const arrow = document.createElement('span');
      arrow.className = 'sort-arrow';
      arrow.textContent = ' ↕';
      th.appendChild(arrow);
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        if (sortCol === col.key) {
          sortAsc = !sortAsc;
        } else {
          sortCol = col.key;
          sortAsc = true;
        }
        renderTable();
      });
    }
    thCells[col.key] = th;
    headerRow.appendChild(th);
  });

  /* --- Table Body --------------------------------------- */
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  /* --- Category badge helper ---------------------------- */
  function categoryBadge(cat) {
    const cls = 'badge badge-' + cat.toLowerCase().replace(/[^a-z]/g, '');
    return `<span class="${cls}">${cat}</span>`;
  }

  /* --- Render table ------------------------------------- */
  function renderTable() {
    /* Update sort indicators */
    COLUMNS.forEach(col => {
      const th = thCells[col.key];
      if (!th) return;
      const arrow = th.querySelector('.sort-arrow');
      if (!arrow) return;
      if (sortCol === col.key) {
        arrow.textContent = sortAsc ? ' ▲' : ' ▼';
        th.classList.add('sorted');
      } else {
        arrow.textContent = ' ↕';
        th.classList.remove('sorted');
      }
    });

    /* Filter */
    const searchLower = filterText.toLowerCase();
    const payerDecoded = filterPayer ? decodeURIComponent(filterPayer) : '';

    const filtered = datasets.filter(d => {
      const matchText = !filterText ||
        d.name.toLowerCase().includes(searchLower) ||
        (d.description || '').toLowerCase().includes(searchLower) ||
        (d.unit || '').toLowerCase().includes(searchLower);

      const matchCat = !filterCat || d.category === filterCat;

      const matchPayer = !payerDecoded || d.payers.includes(payerDecoded);

      return matchText && matchCat && matchPayer;
    });

    /* Sort */
    filtered.sort((a, b) => {
      const av = (a[sortCol] || '').toString().toLowerCase();
      const bv = (b[sortCol] || '').toString().toLowerCase();
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ?  1 : -1;
      return 0;
    });

    /* Group by category */
    const groups = {};
    filtered.forEach(d => {
      if (!groups[d.category]) groups[d.category] = [];
      groups[d.category].push(d);
    });

    /* Build rows */
    tbody.innerHTML = '';

    const groupKeys = Object.keys(groups).sort();

    if (groupKeys.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyTd  = document.createElement('td');
      emptyTd.colSpan = COLUMNS.length;
      emptyTd.style.textAlign = 'center';
      emptyTd.style.padding = '32px';
      emptyTd.style.color = '#64748b';
      emptyTd.textContent = 'No datasets match the current filters.';
      emptyRow.appendChild(emptyTd);
      tbody.appendChild(emptyRow);
      return;
    }

    groupKeys.forEach(groupKey => {
      const groupData = groups[groupKey];
      const isCollapsed = collapsedGroups.has(groupKey);

      /* Group header row */
      const gRow = document.createElement('tr');
      gRow.className = 'group-header' + (isCollapsed ? ' collapsed' : '');
      gRow.innerHTML = `<td colspan="${COLUMNS.length}">
        <span class="group-toggle">▼</span>
        <strong>${groupKey}</strong>
        <span style="font-weight:400;color:#64748b;margin-left:8px">(${groupData.length} dataset${groupData.length !== 1 ? 's' : ''})</span>
      </td>`;
      gRow.addEventListener('click', () => {
        if (collapsedGroups.has(groupKey)) {
          collapsedGroups.delete(groupKey);
        } else {
          collapsedGroups.add(groupKey);
        }
        renderTable();
      });
      tbody.appendChild(gRow);

      if (!isCollapsed) {
        groupData.forEach(d => {
          const rowId = d.name.replace(/\s/g, '_');
          const isExpanded = expandedRows.has(rowId);

          /* Data row */
          const tr = document.createElement('tr');
          tr.style.cursor = 'pointer';
          tr.innerHTML = `
            <td><strong>${d.name}</strong></td>
            <td>${categoryBadge(d.category)}</td>
            <td>${d.years || '—'}</td>
            <td>${d.unit || '—'}</td>
            <td>${(d.payers || []).map(p => `<span class="badge" style="margin:1px 2px;font-size:10px">${p}</span>`).join('')}</td>
            <td>${(d.linkageIds || []).map(id => `<code class="link-tag">${id}</code>`).join('')}</td>
          `;
          tr.addEventListener('click', () => {
            if (expandedRows.has(rowId)) {
              expandedRows.delete(rowId);
            } else {
              expandedRows.add(rowId);
            }
            renderTable();
          });
          tbody.appendChild(tr);

          /* Detail row */
          if (isExpanded) {
            const detailRow = document.createElement('tr');
            detailRow.className = 'detail-row';
            const dtd = document.createElement('td');
            dtd.colSpan = COLUMNS.length;
            const statesLabel = Array.isArray(d.states) ? d.states.join(', ') : (d.states || 'All');
            dtd.innerHTML = `
              <div style="display:flex;gap:24px;flex-wrap:wrap">
                <div>
                  <span style="font-weight:600;color:#0d1b2a;font-size:11px;text-transform:uppercase;letter-spacing:.04em">Description</span>
                  <p style="margin-top:4px;line-height:1.55;color:#374151">${d.description || 'No description available.'}</p>
                </div>
                <div style="min-width:180px">
                  <span style="font-weight:600;color:#0d1b2a;font-size:11px;text-transform:uppercase;letter-spacing:.04em">States</span>
                  <p style="margin-top:4px">${statesLabel}</p>
                </div>
              </div>
            `;
            detailRow.appendChild(dtd);
            tbody.appendChild(detailRow);
          }
        });
      }
    });

    /* Update stats */
    const statValues = statsRow.querySelectorAll('.stat-value');
    if (statValues[0]) statValues[0].textContent = filtered.length;
  }

  /* --- Event Listeners ---------------------------------- */
  searchInput.addEventListener('input', (e) => {
    filterText = e.target.value.trim();
    renderTable();
  });

  catSelect.addEventListener('change', (e) => {
    filterCat = e.target.value;
    renderTable();
  });

  payerSelect.addEventListener('change', (e) => {
    filterPayer = e.target.value;
    renderTable();
  });

  /* --- Export CSV --------------------------------------- */
  exportBtn.addEventListener('click', () => {
    const rows = [['Name','Description','Category','Years','Unit','Payers','States','LinkageIDs']];
    datasets.forEach(d => {
      rows.push([
        `"${(d.name || '').replace(/"/g, '""')}"`,
        `"${(d.description || '').replace(/"/g, '""')}"`,
        `"${d.category || ''}"`,
        `"${d.years || ''}"`,
        `"${d.unit || ''}"`,
        `"${(d.payers || []).join('; ')}"`,
        `"${Array.isArray(d.states) ? d.states.join('; ') : (d.states || 'All')}"`,
        `"${(d.linkageIds || []).join('; ')}"`
      ]);
    });
    const csvContent = rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'healthcare_datasets_catalog.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  /* --- Initial Render ----------------------------------- */
  renderTable();
}
