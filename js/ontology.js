/* ============================================================
   ontology.js — D3 v7 Force-Directed Graph
   Policy Synthesis Project
   ============================================================ */

function initOntology(nodes, edges) {
  'use strict';

  /* --- Config -------------------------------------------- */
  const COLORS = {
    legislation: '#e63946',
    rule:        '#f4a261',
    program:     '#2a9d8f',
    model:       '#457b9d',
    agency:      '#6a4c93'
  };

  const RADII = {
    legislation: 14,
    agency:      16,
    rule:        10,
    program:     11,
    model:       11
  };

  const CATEGORY_LABELS = {
    legislation: 'Legislation',
    agency:      'Federal Agency',
    rule:        'Annual Rule',
    program:     'Program',
    model:       'CMMI Model'
  };

  /* --- Container & SVG ----------------------------------- */
  let container = document.getElementById('ontology-container');
  if (!container) {
    console.warn('initOntology: #ontology-container not found');
    return;
  }

  container.innerHTML = '';

  const W = Math.max(container.clientWidth || 900, 700);
  const H = 650;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .style('display', 'block')
    .style('width', '100%')
    .style('height', H + 'px');

  /* --- Zoom -------------------------------------------- */
  const zoomG = svg.append('g').attr('class', 'zoom-group');

  const zoom = d3.zoom()
    .scaleExtent([0.2, 4])
    .on('zoom', (event) => {
      zoomG.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Zoom controls hint
  svg.append('text')
    .attr('x', 10).attr('y', H - 8)
    .attr('font-size', '11px')
    .attr('fill', '#aaa')
    .text('Scroll to zoom · Drag to pan · Click node to highlight');

  /* --- Arrow Marker -------------------------------------- */
  const defs = svg.append('defs');

  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 22)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#a8c0d6');

  /* --- Tooltip ------------------------------------------ */
  let tooltip = document.getElementById('ontology-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'ontology-tooltip';
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
  }

  function showTooltip(event, d) {
    tooltip.classList.add('visible');
    tooltip.innerHTML = `
      <strong>${d.name}</strong>
      <div class="tt-row"><span class="tt-label">Category</span><span>${d.category.charAt(0).toUpperCase() + d.category.slice(1)}</span></div>
      <div class="tt-row"><span class="tt-label">Type</span><span>${d.ptype || 'N/A'}</span></div>
      <div class="tt-row"><span class="tt-label">Enacted</span><span>${d.enacted || 'N/A'}</span></div>
      ${d.description ? `<div class="tt-desc">${d.description.substring(0, 200)}${d.description.length > 200 ? '…' : ''}</div>` : ''}
      ${d.links && d.links.length ? `<div style="margin-top:6px;font-size:11px;opacity:0.65">${d.links.map(l => `<a href="${l.url}" target="_blank" style="color:var(--accent-light);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px">${l.label}</a>`).join('')}</div>` : ''}
    `;
    positionTooltip(event);
  }

  function positionTooltip(event) {
    const pad = 14;
    const tw = tooltip.offsetWidth || 300;
    const th = tooltip.offsetHeight || 120;
    let left = event.clientX + pad;
    let top  = event.clientY + pad;
    if (left + tw > window.innerWidth  - 10) left = event.clientX - tw - pad;
    if (top  + th > window.innerHeight - 10) top  = event.clientY - th - pad;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  /* --- Data Preparation ---------------------------------- */
  // Deep copy so simulation mutations don't corrupt source data
  const simNodes = nodes.map(d => Object.assign({}, d));
  const nodeById  = new Map(simNodes.map(d => [d.id, d]));

  const simLinks = edges
    .filter(e => nodeById.has(e.source) && nodeById.has(e.target))
    .map(e => ({
      source: e.source,
      target: e.target,
      label:  e.label
    }));

  /* --- Visible sets (for legend toggle) ------------------ */
  const hiddenCategories = new Set();

  function isVisible(d) {
    return !hiddenCategories.has(d.category);
  }

  /* --- Force Simulation ---------------------------------- */
  const simulation = d3.forceSimulation(simNodes)
    .force('link', d3.forceLink(simLinks)
      .id(d => d.id)
      .distance(d => {
        // Longer distance for agency->program type connections
        const srcCat = (typeof d.source === 'object') ? d.source.category : '';
        const tgtCat = (typeof d.target === 'object') ? d.target.category : '';
        if (srcCat === 'agency' || tgtCat === 'agency') return 150;
        return 110;
      })
      .strength(0.4)
    )
    .force('charge', d3.forceManyBody().strength(-380).distanceMax(400))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collide', d3.forceCollide(d => (RADII[d.category] || 11) + 22))
    .alphaDecay(0.028);

  /* --- Links --------------------------------------------- */
  const linkGroup = zoomG.append('g').attr('class', 'links');

  const link = linkGroup.selectAll('line')
    .data(simLinks)
    .join('line')
    .attr('class', 'link')
    .attr('marker-end', 'url(#arrowhead)');

  /* --- Nodes --------------------------------------------- */
  const nodeGroup = zoomG.append('g').attr('class', 'nodes');

  const node = nodeGroup.selectAll('g.node')
    .data(simNodes)
    .join('g')
    .attr('class', 'node')
    .call(drag(simulation))
    .on('click', onNodeClick)
    .on('mouseover', (event, d) => {
      showTooltip(event, d);
      event.stopPropagation();
    })
    .on('mousemove', (event) => {
      positionTooltip(event);
    })
    .on('mouseout', hideTooltip);

  node.append('circle')
    .attr('r', d => RADII[d.category] || 11)
    .attr('fill', d => COLORS[d.category] || '#888')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2.5);

  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', d => (RADII[d.category] || 11) + 13)
    .style('font-size', '10px')
    .style('fill', '#2c3e50')
    .style('pointer-events', 'none')
    .text(d => d.id.length > 18 ? d.id.substring(0, 16) + '…' : d.id);

  /* --- Simulation Tick ----------------------------------- */
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  /* --- Click: Highlight Neighbors ------------------------ */
  function onNodeClick(event, d) {
    event.stopPropagation();

    const neighborIds = new Set([d.id]);
    simLinks.forEach(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      if (srcId === d.id) neighborIds.add(tgtId);
      if (tgtId === d.id) neighborIds.add(srcId);
    });

    node.select('circle')
      .attr('opacity', n => neighborIds.has(n.id) ? 1 : 0.12);
    node.select('text')
      .attr('opacity', n => neighborIds.has(n.id) ? 1 : 0.08);

    link.attr('opacity', l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      return (srcId === d.id || tgtId === d.id) ? 0.9 : 0.04;
    });
  }

  /* --- Click SVG background: reset opacity --------------- */
  svg.on('click', () => {
    node.select('circle').attr('opacity', d => isVisible(d) ? 1 : 0);
    node.select('text').attr('opacity', d => isVisible(d) ? 1 : 0);
    link.attr('opacity', l => {
      const srcVis = isVisible(typeof l.source === 'object' ? l.source : nodeById.get(l.source));
      const tgtVis = isVisible(typeof l.target === 'object' ? l.target : nodeById.get(l.target));
      return (srcVis && tgtVis) ? 0.6 : 0;
    });
    hideTooltip();
  });

  /* --- Drag Behavior ------------------------------------- */
  function drag(sim) {
    return d3.drag()
      .on('start', (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x; d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null; d.fy = null;
      });
  }

  /* --- Apply visibility based on hidden categories ------- */
  function applyVisibility() {
    node.select('circle').attr('opacity', d => isVisible(d) ? 1 : 0)
                         .style('pointer-events', d => isVisible(d) ? 'auto' : 'none');
    node.select('text').attr('opacity', d => isVisible(d) ? 1 : 0);

    link.attr('opacity', l => {
      const src = typeof l.source === 'object' ? l.source : nodeById.get(l.source);
      const tgt = typeof l.target === 'object' ? l.target : nodeById.get(l.target);
      return (src && tgt && isVisible(src) && isVisible(tgt)) ? 0.6 : 0;
    });
  }

  /* --- Legend -------------------------------------------- */
  const legendEl = document.createElement('div');
  legendEl.className = 'legend';

  Object.entries(COLORS).forEach(([cat, color]) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.dataset.category = cat;
    item.innerHTML = `<span class="legend-dot" style="background:${color}"></span>${CATEGORY_LABELS[cat] || cat}`;

    item.addEventListener('click', () => {
      if (hiddenCategories.has(cat)) {
        hiddenCategories.delete(cat);
        item.classList.remove('hidden');
      } else {
        hiddenCategories.add(cat);
        item.classList.add('hidden');
      }
      applyVisibility();
    });

    legendEl.appendChild(item);
  });

  container.appendChild(legendEl);

  /* --- Window resize ------------------------------------- */
  const resizeObs = new ResizeObserver(() => {
    const newW = container.clientWidth;
    svg.attr('width', newW);
    simulation.force('center', d3.forceCenter(newW / 2, H / 2));
    simulation.alpha(0.1).restart();
  });
  resizeObs.observe(container);
}
