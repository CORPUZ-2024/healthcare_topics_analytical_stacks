/* ============================================================
   reimbursement.js — Swimlane Timeline Visualization
   Policy Synthesis Project
   ============================================================ */

function initReimbursement(serviceTypes, cmmiModels) {
  'use strict';

  const container = document.getElementById('reimbursement-container');
  if (!container) {
    console.warn('initReimbursement: #reimbursement-container not found');
    return;
  }

  container.innerHTML = '';

  /* --- Config -------------------------------------------- */
  const ROW_HEIGHT  = 88;
  const MARGINS     = { top: 60, right: 32, bottom: 56, left: 230 };
  const TODAY       = new Date('2026-08-28');
  const TIME_START  = new Date('2010-01-01');
  const TIME_END    = new Date('2026-12-31');

  const CATEGORY_COLORS = {
    'ACO':              '#2a9d8f',
    'Episode':          '#e9c46a',
    'Primary Care':     '#f4a261',
    'Specialty':        '#e76f51',
    'State/Payer':      '#264653',
    'Behavioral Health':'#6a4c93'
  };

  const CATEGORY_ORDER = ['ACO','Episode','Primary Care','Specialty','State/Payer','Behavioral Health'];

  /* --- Build model lookup by name ------------------------ */
  const modelByName = new Map();
  cmmiModels.forEach(m => modelByName.set(m.name, m));

  /* --- Dimensions ---------------------------------------- */
  const totalW = Math.max(container.clientWidth || 960, 800);
  const innerW = totalW - MARGINS.left - MARGINS.right;
  const innerH = serviceTypes.length * ROW_HEIGHT;
  const totalH = innerH + MARGINS.top + MARGINS.bottom;

  /* --- Tooltip ------------------------------------------ */
  let tooltip = document.getElementById('reimb-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'reimb-tooltip';
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
  }

  function showTooltip(event, model, svcName) {
    tooltip.classList.add('visible');
    const endLabel = model.endDate ? model.endDate : 'Ongoing';
    tooltip.innerHTML = `
      <strong>${model.name}</strong>
      <div class="tt-row"><span class="tt-label">Service</span><span>${svcName}</span></div>
      <div class="tt-row"><span class="tt-label">Category</span><span>${model.category}</span></div>
      <div class="tt-row"><span class="tt-label">Start</span><span>${model.startDate}</span></div>
      <div class="tt-row"><span class="tt-label">End</span><span>${endLabel}</span></div>
      ${model.description ? `<div class="tt-desc">${model.description.substring(0, 220)}${model.description.length > 220 ? '…' : ''}</div>` : ''}
    `;
    moveTooltip(event);
  }

  function moveTooltip(event) {
    const pad = 14, tw = tooltip.offsetWidth || 300, th = tooltip.offsetHeight || 120;
    let left = event.clientX + pad;
    let top  = event.clientY + pad;
    if (left + tw > window.innerWidth  - 10) left = event.clientX - tw - pad;
    if (top  + th > window.innerHeight - 10) top  = event.clientY - th - pad;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }

  function hideTooltip() { tooltip.classList.remove('visible'); }

  /* --- SVG ---------------------------------------------- */
  const svg = d3.select(container)
    .append('svg')
    .attr('class', 'swimlane-svg')
    .attr('width', totalW)
    .attr('height', totalH);

  const g = svg.append('g')
    .attr('transform', `translate(${MARGINS.left},${MARGINS.top})`);

  /* --- Time Scale --------------------------------------- */
  const xScale = d3.scaleTime()
    .domain([TIME_START, TIME_END])
    .range([0, innerW]);

  /* --- X Axis (top) ------------------------------------- */
  const xAxis = d3.axisTop(xScale)
    .ticks(d3.timeYear.every(2))
    .tickFormat(d3.timeFormat('%Y'))
    .tickSize(-innerH);

  const axisG = g.append('g')
    .attr('class', 'swimlane-axis')
    .call(xAxis);

  axisG.select('.domain').remove();

  axisG.selectAll('.tick line')
    .attr('class', 'swimlane-gridline')
    .attr('stroke', '#e0eaf2')
    .attr('stroke-dasharray', '3,3');

  axisG.selectAll('.tick text')
    .attr('dy', -10)
    .style('font-size', '11px')
    .style('fill', '#64748b');

  /* --- "Today" marker ----------------------------------- */
  const todayX = xScale(TODAY);
  g.append('line')
    .attr('x1', todayX).attr('x2', todayX)
    .attr('y1', -MARGINS.top + 4).attr('y2', innerH)
    .attr('stroke', '#e63946')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,3')
    .attr('opacity', 0.7);

  g.append('text')
    .attr('x', todayX + 3)
    .attr('y', -MARGINS.top + 16)
    .style('font-size', '10px')
    .style('fill', '#e63946')
    .style('font-weight', '600')
    .text('Today');

  /* --- Rows --------------------------------------------- */
  serviceTypes.forEach((svc, i) => {
    const y = i * ROW_HEIGHT;

    /* Row background */
    g.append('rect')
      .attr('x', 0).attr('y', y)
      .attr('width', innerW).attr('height', ROW_HEIGHT)
      .attr('fill', i % 2 === 0 ? '#f5f9fc' : '#ffffff')
      .attr('stroke', '#e8f0f7')
      .attr('stroke-width', 0.5);

    /* Row separator */
    g.append('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', y + ROW_HEIGHT).attr('y2', y + ROW_HEIGHT)
      .attr('stroke', '#d1e3f0')
      .attr('stroke-width', 1);

    /* Left label panel */
    svg.append('rect')
      .attr('x', 0).attr('y', MARGINS.top + y)
      .attr('width', MARGINS.left - 6).attr('height', ROW_HEIGHT)
      .attr('fill', i % 2 === 0 ? '#eef5fa' : '#f7fbfe');

    svg.append('text')
      .attr('x', MARGINS.left - 12)
      .attr('y', MARGINS.top + y + 22)
      .attr('text-anchor', 'end')
      .attr('class', 'swimlane-label')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('fill', '#0d1b2a')
      .text(svc.name);

    svg.append('text')
      .attr('x', MARGINS.left - 12)
      .attr('y', MARGINS.top + y + 37)
      .attr('text-anchor', 'end')
      .attr('class', 'swimlane-fee-label')
      .style('font-size', '10px')
      .style('fill', '#64748b')
      .text(svc.feeSchedule);

    /* VBP pills as small text below fee schedule label */
    svc.valueBasedModels.forEach((vbpName, vi) => {
      if (vi >= 2) return; // cap at 2 to avoid overflow
      svg.append('text')
        .attr('x', MARGINS.left - 12)
        .attr('y', MARGINS.top + y + 52 + vi * 13)
        .attr('text-anchor', 'end')
        .style('font-size', '9px')
        .style('fill', '#1b6ca8')
        .text('▸ ' + vbpName);
    });

    /* Innovation Model rectangles */
    svc.innovationModels.forEach((modelName, mi) => {
      const model = modelByName.get(modelName);
      if (!model) return;

      const start = new Date(model.startDate);
      const end   = model.endDate ? new Date(model.endDate) : TODAY;

      if (end < TIME_START || start > TIME_END) return;

      const x1 = xScale(Math.max(start, TIME_START));
      const x2 = xScale(Math.min(end, TIME_END));
      const rectW = Math.max(x2 - x1, 2);

      const color = CATEGORY_COLORS[model.category] || '#888';

      /* Stagger multiple models vertically within row */
      const numModels = svc.innovationModels.length;
      const trackH    = Math.min(28, (ROW_HEIGHT - 10) / Math.max(1, Math.ceil(numModels / 2)));
      const col       = mi % 2;
      const row_      = Math.floor(mi / 2);
      const rectY     = y + 6 + row_ * (trackH + 3) + col * 0;
      const rectH     = trackH - 2;

      const rect = g.append('rect')
        .attr('x', x1)
        .attr('y', rectY)
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('rx', 4)
        .attr('fill', color)
        .attr('fill-opacity', model.endDate ? 0.65 : 0.88)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer');

      /* Dashed border for ended models */
      if (model.endDate) {
        rect.attr('stroke-dasharray', '4,2').attr('stroke', '#888').attr('stroke-width', 1);
      }

      /* Label if wide enough */
      if (rectW > 55) {
        const shortName = model.name.length > 20 ? model.name.substring(0, 18) + '…' : model.name;
        g.append('text')
          .attr('x', x1 + rectW / 2)
          .attr('y', rectY + rectH / 2 + 3.5)
          .attr('text-anchor', 'middle')
          .style('font-size', '9px')
          .style('fill', '#fff')
          .style('font-weight', '600')
          .style('pointer-events', 'none')
          .text(shortName);
      }

      /* Tooltip events on rect */
      rect.on('mouseover', (event) => showTooltip(event, model, svc.name))
          .on('mousemove', moveTooltip)
          .on('mouseout', hideTooltip);
    });
  });

  /* --- Y-axis left border line --------------------------- */
  g.append('line')
    .attr('x1', 0).attr('x2', 0)
    .attr('y1', 0).attr('y2', innerH)
    .attr('stroke', '#c2d8e8')
    .attr('stroke-width', 1.5);

  /* --- Legend -------------------------------------------- */
  const legendEl = document.createElement('div');
  legendEl.className = 'legend';
  legendEl.style.marginTop = '8px';

  // "Ongoing" vs "Ended" visual cues
  const metaItems = [
    { label: 'Ongoing Model',       style: 'solid',  color: '#457b9d' },
    { label: 'Ended Model',         style: 'dashed', color: '#aaa' },
    { label: 'Today Line',          style: 'today',  color: '#e63946' }
  ];

  metaItems.forEach(meta => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.style.cursor = 'default';
    if (meta.style === 'today') {
      item.innerHTML = `<span style="display:inline-block;width:12px;height:0;border-top:2px dashed ${meta.color};vertical-align:middle"></span>${meta.label}`;
    } else if (meta.style === 'dashed') {
      item.innerHTML = `<span style="display:inline-block;width:14px;height:10px;border:1px dashed #888;border-radius:2px;background:#ddd;vertical-align:middle"></span>${meta.label}`;
    } else {
      item.innerHTML = `<span class="legend-dot" style="background:${meta.color};border-radius:3px;width:14px;height:10px"></span>${meta.label}`;
    }
    legendEl.appendChild(item);
  });

  CATEGORY_ORDER.forEach(cat => {
    const color = CATEGORY_COLORS[cat];
    if (!color) return;
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.style.cursor = 'default';
    item.innerHTML = `<span class="legend-dot" style="background:${color};border-radius:3px;width:14px;height:10px"></span>${cat}`;
    legendEl.appendChild(item);
  });

  container.appendChild(legendEl);

  /* --- Responsive resize --------------------------------- */
  const resizeObs = new ResizeObserver(() => {
    const newW = container.clientWidth;
    if (Math.abs(newW - totalW) > 20) {
      // Re-init on significant width change
      initReimbursement(serviceTypes, cmmiModels);
    }
  });
  resizeObs.observe(container);
}
