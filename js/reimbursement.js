/* ============================================================
   reimbursement.js — 3-Level Hierarchy Swimlane
   Service Type → CMMI Category → Individual Model (eligibility-based)
   Policy Synthesis Project
   ============================================================ */

function initReimbursement(serviceTypes, cmmiModels) {
  'use strict';

  const container = document.getElementById('reimbursement-container');
  if (!container) return;
  container.innerHTML = '';

  /* --- Row heights ---------------------------------------- */
  const SVC_H   = 26;   // service type header row
  const CAT_H   = 18;   // category sub-header row
  const MOD_H   = 22;   // individual model row
  const SVC_GAP =  6;   // gap between service types

  /* --- Official CMMI category config ---------------------- */
  const OFFICIAL_CATS = [
    { name: 'Accountable Care Models',                  color: '#2a9d8f' },
    { name: 'Disease-Specific & Episode-Based Models',  color: '#e76f51' },
    { name: 'Health Plan Models',                       color: '#1b6ca8' },
    { name: 'Prescription Drug Models',                 color: '#6a4c93' },
    { name: 'State & Community-Based Models',           color: '#264653' },
    { name: 'Statutory Demonstrations and Other Projects', color: '#f4a261' }
  ];

  const catColorMap = new Map(OFFICIAL_CATS.map(c => [c.name, c.color]));

  /* --- Timeline config ------------------------------------ */
  const TODAY      = new Date('2026-08-31');
  const TIME_START = new Date('2010-01-01');
  const TIME_END   = new Date('2028-12-31');

  /* --- Margins -------------------------------------------- */
  const LABEL_W  = 270;   // left label panel width
  const MARGIN_T =  48;   // top margin for axis
  const MARGIN_R =  24;
  const MARGIN_B =  48;

  /* --- Build model lookup --------------------------------- */
  const modelByName = new Map(cmmiModels.map(m => [m.name, m]));

  /* --- Build flat row list -------------------------------- */
  // Each row: { type:'svc'|'cat'|'model', y, height, data, catName, svcName, catColor }
  const rows = [];
  let y = 0;

  serviceTypes.forEach(svc => {
    // Group eligible models by official category (preserve official category order)
    const byCategory = new Map();
    OFFICIAL_CATS.forEach(oc => byCategory.set(oc.name, []));

    (svc.innovationModels || []).forEach(modelName => {
      const m = modelByName.get(modelName);
      if (!m) return;
      const bucket = byCategory.get(m.category);
      if (bucket) bucket.push(m);
    });

    // Remove empty categories
    const activeCats = OFFICIAL_CATS.filter(oc => byCategory.get(oc.name).length > 0);

    if (activeCats.length === 0) return; // skip service types with no eligible models

    // Calculate total height for this service type
    const modelCount = activeCats.reduce((s, oc) => s + byCategory.get(oc.name).length, 0);
    const svcTotalH  = SVC_H + activeCats.length * CAT_H + modelCount * MOD_H;

    rows.push({ type: 'svc', y, height: svcTotalH, data: svc, svcName: svc.name });
    y += SVC_H;

    activeCats.forEach(oc => {
      const models = byCategory.get(oc.name)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)); // sort by start date

      const catTotalH = CAT_H + models.length * MOD_H;
      rows.push({ type: 'cat', y, height: catTotalH, catName: oc.name, catColor: oc.color, svcName: svc.name });
      y += CAT_H;

      models.forEach(model => {
        rows.push({ type: 'model', y, height: MOD_H, data: model, catName: oc.name, catColor: oc.color, svcName: svc.name });
        y += MOD_H;
      });
    });

    y += SVC_GAP;
  });

  const innerH = y;

  /* --- SVG dimensions ------------------------------------- */
  const totalW = Math.max(container.clientWidth || 960, 700);
  const innerW = totalW - LABEL_W - MARGIN_R;
  const totalH = innerH + MARGIN_T + MARGIN_B;

  /* --- Tooltip ------------------------------------------- */
  let tooltip = document.getElementById('reimb-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'reimb-tooltip';
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
  }

  function showTooltip(event, model, svcName) {
    tooltip.classList.add('visible');
    tooltip.innerHTML = `
      <strong>${model.name}</strong>
      <div class="tt-row"><span class="tt-label">Service Type</span><span>${svcName}</span></div>
      <div class="tt-row"><span class="tt-label">CMMI Category</span><span>${model.category}</span></div>
      <div class="tt-row"><span class="tt-label">Start</span><span>${model.startDate}</span></div>
      <div class="tt-row"><span class="tt-label">End</span><span>${model.endDate || 'Ongoing'}</span></div>
      <div class="tt-row"><span class="tt-label">Eligibility</span><span>Program-based (not actual participation)</span></div>
      ${model.description ? `<div class="tt-desc">${model.description.substring(0, 240)}${model.description.length > 240 ? '…' : ''}</div>` : ''}
    `;
    moveTooltip(event);
  }

  function moveTooltip(event) {
    const pad = 14, tw = tooltip.offsetWidth || 300, th = tooltip.offsetHeight || 120;
    let left = event.clientX + pad, top = event.clientY + pad;
    if (left + tw > window.innerWidth  - 10) left = event.clientX - tw - pad;
    if (top  + th > window.innerHeight - 10) top  = event.clientY - th - pad;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }

  function hideTooltip() { tooltip.classList.remove('visible'); }

  /* --- Outer wrapper for scroll --------------------------- */
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'width:100%;overflow-x:auto;overflow-y:auto;max-height:800px;position:relative;';
  container.appendChild(wrapper);

  /* --- Build SVG ----------------------------------------- */
  const svgEl = d3.select(wrapper)
    .append('svg')
    .attr('width', totalW)
    .attr('height', totalH);

  /* --- Timeline scale ------------------------------------ */
  const xScale = d3.scaleTime()
    .domain([TIME_START, TIME_END])
    .range([0, innerW]);

  /* ---- Left panel background ---------------------------- */
  svgEl.append('rect')
    .attr('x', 0).attr('y', 0)
    .attr('width', LABEL_W).attr('height', totalH)
    .attr('fill', '#f0f4f8');

  /* --- Timeline area group ------------------------------- */
  const timeG = svgEl.append('g')
    .attr('transform', `translate(${LABEL_W}, ${MARGIN_T})`);

  /* --- X axis -------------------------------------------- */
  const xAxis = d3.axisTop(xScale)
    .ticks(d3.timeYear.every(1))
    .tickFormat(d3.timeFormat('%Y'))
    .tickSize(-innerH);

  const axisG = timeG.append('g').call(xAxis);
  axisG.select('.domain').remove();
  axisG.selectAll('.tick line')
    .attr('stroke', '#dde8f0').attr('stroke-dasharray', '3,3');
  axisG.selectAll('.tick text')
    .attr('dy', -10).style('font-size', '10px').style('fill', '#64748b');

  /* --- Today line ---------------------------------------- */
  const todayX = xScale(TODAY);
  timeG.append('line')
    .attr('x1', todayX).attr('x2', todayX)
    .attr('y1', -MARGIN_T + 2).attr('y2', innerH)
    .attr('stroke', '#e63946').attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,3').attr('opacity', 0.75);
  timeG.append('text')
    .attr('x', todayX + 3).attr('y', -MARGIN_T + 14)
    .style('font-size', '9px').style('fill', '#e63946').style('font-weight', '700')
    .text('Today');

  /* --- Draw rows ----------------------------------------- */
  let altModel = 0; // alternating background counter for model rows

  rows.forEach(row => {

    if (row.type === 'svc') {
      /* --- Service Type Header ---- */
      // Timeline area: dark header band
      timeG.append('rect')
        .attr('x', 0).attr('y', row.y)
        .attr('width', innerW).attr('height', SVC_H)
        .attr('fill', '#0d1b2a').attr('opacity', 0.07);

      // Left label: service name + fee schedule
      svgEl.append('rect')
        .attr('x', 0).attr('y', MARGIN_T + row.y)
        .attr('width', LABEL_W).attr('height', SVC_H)
        .attr('fill', '#0d1b2a').attr('opacity', 0.1);

      svgEl.append('text')
        .attr('x', 8).attr('y', MARGIN_T + row.y + SVC_H / 2 + 3)
        .style('font-size', '10px').style('font-weight', '700').style('fill', '#0d1b2a')
        .text(row.data.name);

      svgEl.append('text')
        .attr('x', LABEL_W - 6).attr('y', MARGIN_T + row.y + SVC_H / 2 + 3)
        .attr('text-anchor', 'end')
        .style('font-size', '8.5px').style('fill', '#64748b').style('font-style', 'italic')
        .text(row.data.feeSchedule);

      altModel = 0; // reset alternating bg on new service type

    } else if (row.type === 'cat') {
      /* --- Category Sub-Header ---- */
      const cc = row.catColor;

      timeG.append('rect')
        .attr('x', 0).attr('y', row.y)
        .attr('width', innerW).attr('height', CAT_H)
        .attr('fill', cc).attr('opacity', 0.08);

      svgEl.append('rect')
        .attr('x', 0).attr('y', MARGIN_T + row.y)
        .attr('width', LABEL_W).attr('height', CAT_H)
        .attr('fill', cc).attr('opacity', 0.1);

      // colored left edge bar
      svgEl.append('rect')
        .attr('x', 0).attr('y', MARGIN_T + row.y)
        .attr('width', 3).attr('height', CAT_H)
        .attr('fill', cc).attr('opacity', 0.9);

      svgEl.append('text')
        .attr('x', 10).attr('y', MARGIN_T + row.y + CAT_H / 2 + 3)
        .style('font-size', '8px').style('font-weight', '600')
        .style('fill', cc).style('font-style', 'italic')
        .text(row.catName);

    } else if (row.type === 'model') {
      /* --- Individual Model Row ---- */
      const isAlt = (altModel % 2 === 0);
      altModel++;
      const cc = row.catColor;

      // Row background
      timeG.append('rect')
        .attr('x', 0).attr('y', row.y)
        .attr('width', innerW).attr('height', MOD_H)
        .attr('fill', isAlt ? '#f7fafb' : '#ffffff')
        .attr('stroke', '#e8f0f7').attr('stroke-width', 0.5);

      // Left label panel
      svgEl.append('rect')
        .attr('x', 0).attr('y', MARGIN_T + row.y)
        .attr('width', LABEL_W).attr('height', MOD_H)
        .attr('fill', isAlt ? '#f3f7f9' : '#f8fbfd');

      // category color edge bar (thinner)
      svgEl.append('rect')
        .attr('x', 0).attr('y', MARGIN_T + row.y)
        .attr('width', 3).attr('height', MOD_H)
        .attr('fill', cc).attr('opacity', 0.5);

      // Model name label (indented)
      const shortName = row.data.name.length > 34 ? row.data.name.substring(0, 32) + '…' : row.data.name;
      svgEl.append('text')
        .attr('x', 18).attr('y', MARGIN_T + row.y + MOD_H / 2 + 3.5)
        .style('font-size', '8.5px').style('fill', '#1a1a2e')
        .text(shortName);

      // Ended badge
      if (row.data.endDate) {
        svgEl.append('text')
          .attr('x', LABEL_W - 6).attr('y', MARGIN_T + row.y + MOD_H / 2 + 3.5)
          .attr('text-anchor', 'end')
          .style('font-size', '7px').style('fill', '#aaa').style('font-style', 'italic')
          .text('ended');
      }

      /* --- Timeline bar --- */
      const model = row.data;
      const barStart = new Date(model.startDate);
      const barEnd   = model.endDate ? new Date(model.endDate) : TODAY;

      if (barEnd >= TIME_START && barStart <= TIME_END) {
        const x1 = xScale(Math.max(barStart, TIME_START));
        const x2 = xScale(Math.min(barEnd, TIME_END));
        const bW  = Math.max(x2 - x1, 3);
        const bY  = row.y + 4;
        const bH  = MOD_H - 8;

        const bar = timeG.append('rect')
          .attr('x', x1).attr('y', bY)
          .attr('width', bW).attr('height', bH)
          .attr('rx', 3)
          .attr('fill', cc)
          .attr('fill-opacity', model.endDate ? 0.45 : 0.80)
          .attr('stroke', model.endDate ? '#aaa' : cc)
          .attr('stroke-width', model.endDate ? 0.5 : 1)
          .attr('stroke-dasharray', model.endDate ? '4,2' : 'none')
          .style('cursor', 'pointer');

        // Label inside bar if wide enough
        if (bW > 60) {
          const lbl = model.name.length > 22 ? model.name.substring(0, 20) + '…' : model.name;
          timeG.append('text')
            .attr('x', x1 + bW / 2).attr('y', bY + bH / 2 + 3.5)
            .attr('text-anchor', 'middle')
            .style('font-size', '7.5px').style('fill', model.endDate ? '#555' : '#fff')
            .style('font-weight', '600').style('pointer-events', 'none')
            .text(lbl);
        }

        bar.on('mouseover', (event) => showTooltip(event, model, row.svcName))
           .on('mousemove', moveTooltip)
           .on('mouseout', hideTooltip);
      }
    }
  });

  /* --- Right border of label panel ----------------------- */
  svgEl.append('line')
    .attr('x1', LABEL_W).attr('x2', LABEL_W)
    .attr('y1', 0).attr('y2', totalH)
    .attr('stroke', '#c2d8e8').attr('stroke-width', 1.5);

  /* --- Legend -------------------------------------------- */
  const legendEl = document.createElement('div');
  legendEl.className = 'legend';
  legendEl.style.marginTop = '12px';
  legendEl.style.flexWrap = 'wrap';

  // Status indicators
  [
    { label: 'Active model', html: `<span style="display:inline-block;width:20px;height:10px;background:#2a9d8f;border-radius:2px;opacity:0.85;vertical-align:middle"></span>` },
    { label: 'Ended model', html: `<span style="display:inline-block;width:20px;height:10px;background:#bbb;border:1px dashed #888;border-radius:2px;vertical-align:middle"></span>` },
    { label: 'Today', html: `<span style="display:inline-block;width:2px;height:12px;background:#e63946;vertical-align:middle;margin-right:2px"></span>` }
  ].forEach(meta => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.style.cursor = 'default';
    item.innerHTML = meta.html + '&nbsp;' + meta.label;
    legendEl.appendChild(item);
  });

  // Category colors
  OFFICIAL_CATS.forEach(oc => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.style.cursor = 'default';
    item.innerHTML = `<span class="legend-dot" style="background:${oc.color};border-radius:3px;width:14px;height:10px;display:inline-block;vertical-align:middle"></span>&nbsp;${oc.name}`;
    legendEl.appendChild(item);
  });

  container.appendChild(legendEl);

  /* --- Program Eligibility Outline ----------------------- */
  renderReimbursementOutline(container, serviceTypes, cmmiModels, OFFICIAL_CATS, catColorMap);

  /* --- Responsive ---------------------------------------- */
  const ro = new ResizeObserver(() => {
    const nw = container.clientWidth;
    if (Math.abs(nw - totalW) > 20) initReimbursement(serviceTypes, cmmiModels);
  });
  ro.observe(container);
}

/* ============================================================
   renderReimbursementOutline
   Appends a structured per-service-type reference outline below
   the swimlane, distinguishing base fee schedules, value-based
   adjustment programs, and CMMI innovation model overlays.
   Mirrors the format of Reimbursement_Roadmap_with_CMMI_Models.md
   ============================================================ */
function renderReimbursementOutline(container, serviceTypes, cmmiModels, officialCats, catColorMap) {

  /* Coverage type for each service type (Medicare Part mapping) */
  const COVERAGE = {
    'Inpatient Hospital':               'Medicare Part A',
    'Outpatient Hospital':              'Medicare Part B',
    'Physician / Professional Services':'Medicare Part B',
    'Skilled Nursing Facility':         'Medicare Part A',
    'Home Health':                      'Medicare Part A',
    'Hospice':                          'Medicare Part A',
    'Inpatient Rehabilitation Facility':'Medicare Part A',
    'End-Stage Renal Disease':          'Medicare Part B (outpatient dialysis) / Part A (inpatient)',
    'Oncology':                         'Medicare Part B + Part D (oral agents)',
    'Behavioral Health':                'Medicare Part B',
    'Medicare Advantage / Health Plan': 'Medicare Part C — risk-adjusted capitation',
    'Prescription Drug (Part D)':       'Medicare Part D'
  };

  /* Badge helpers */
  function vbpBadge(name) {
    const n = name.toLowerCase();
    if (n.includes('hrrp') || n.includes('readmission') || n.includes('hac') || n.includes('qip'))
      return '<span class="ol-badge ol-penalty">🔴 PENALTY−</span>';
    if (n.includes('ira') || n.includes('negotiation') || n.includes('pricing') || n.includes('lis'))
      return '<span class="ol-badge ol-pricing">💊 PRICING</span>';
    if (n.includes('reporting') || n.includes('iqr') || n.includes('oqr') || n.includes('quality reporting'))
      return '<span class="ol-badge ol-report">📋 REPORTING</span>';
    if (n.includes('radv') || n.includes('audit'))
      return '<span class="ol-badge ol-audit">🔍 AUDIT</span>';
    /* Default: bidirectional VBP adjustment */
    return '<span class="ol-badge ol-adjust">🟢 REWARD+ / 🔴 PENALTY−</span>';
  }

  function modelBadge(model) {
    return model.endDate
      ? '<span class="ol-badge ol-ended">⬛ ENDED</span>'
      : '<span class="ol-badge ol-innovation">🟣 INNOVATION</span>';
  }

  /* Build model lookup */
  const modelByName = new Map(cmmiModels.map(m => [m.name, m]));

  /* --- Build outline HTML -------------------------------- */
  const wrap = document.createElement('div');
  wrap.className = 'reimb-outline';

  /* Header */
  wrap.innerHTML = `
    <div class="outline-header">
      <h3>Program Eligibility Outline</h3>
      <p>Structured reference differentiating base fee schedules, value-based adjustment programs, and CMMI innovation model overlays by service type. Based on <strong>program eligibility</strong> — not actual voluntary participation. ACO models (MSSP, ACO REACH) are a universal overlay and appear across all applicable service types.</p>
      <div class="outline-key">
        <span><span class="ol-badge ol-base">🔵 BASE</span> Fee Schedule</span>
        <span><span class="ol-badge ol-adjust">🟢/🔴 ADJUST</span> Value-Based Program</span>
        <span><span class="ol-badge ol-penalty">🔴 PENALTY−</span> Penalty-only Program</span>
        <span><span class="ol-badge ol-innovation">🟣 INNOVATION</span> Active CMMI Model</span>
        <span><span class="ol-badge ol-ended">⬛ ENDED</span> Concluded CMMI Model</span>
        <span><span class="ol-badge ol-report">📋 REPORTING</span> Quality Reporting</span>
      </div>
    </div>
  `;

  /* Per-service-type sections */
  serviceTypes.forEach((svc, i) => {
    /* Group eligible models by official CMMI category */
    const byCategory = new Map(officialCats.map(oc => [oc.name, []]));
    (svc.innovationModels || []).forEach(mName => {
      const m = modelByName.get(mName);
      if (m && byCategory.has(m.category)) byCategory.get(m.category).push(m);
    });
    const activeCats = officialCats.filter(oc => byCategory.get(oc.name).length > 0);

    /* Build CMMI category blocks */
    const catHTML = activeCats.map(oc => {
      const models = byCategory.get(oc.name)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      const modelItems = models.map(m =>
        `<li><strong>${m.name}</strong> (${m.startDate.slice(0,4)}${m.endDate ? '–'+m.endDate.slice(0,4) : '–present'}) ${modelBadge(m)}</li>`
      ).join('');
      const catColor = catColorMap.get(oc.name) || '#888';
      return `
        <div class="outline-cat-block">
          <div class="outline-cat-label" style="color:${catColor};border-left:3px solid ${catColor}">${oc.name}</div>
          <ul class="outline-model-list">${modelItems}</ul>
        </div>`;
    }).join('');

    /* VBP rows */
    const vbpHTML = (svc.valueBasedModels || []).map(v =>
      `<li>${v} ${vbpBadge(v)}</li>`
    ).join('');

    const coverage = COVERAGE[svc.name] || 'Medicare';

    const section = document.createElement('div');
    section.className = 'outline-section';
    section.innerHTML = `
      <div class="outline-svc-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <span class="outline-svc-num">${i + 1}</span>
        <span class="outline-svc-name">${svc.name}</span>
        <span class="outline-svc-toggle">▾</span>
      </div>
      <div class="outline-body">
        <div class="outline-row">
          <span class="ol-label">Coverage</span>
          <span>${coverage}</span>
        </div>
        <div class="outline-row">
          <span class="ol-label">Fee Schedule</span>
          <span><strong>${svc.feeSchedule}</strong> <span class="ol-badge ol-base">🔵 BASE</span></span>
        </div>
        <div class="outline-row">
          <span class="ol-label">Value-Based<br>Programs</span>
          <ul class="outline-vbp-list">${vbpHTML}</ul>
        </div>
        <div class="outline-row outline-row-cmmi">
          <span class="ol-label">CMMI Models<br><em style="font-weight:400;color:#94a3b8">(by eligibility)</em></span>
          <div class="outline-cats-wrap">${catHTML || '<span style="color:#aaa;font-size:0.8rem">No CMMI models mapped</span>'}</div>
        </div>
      </div>
    `;
    wrap.appendChild(section);
  });

  /* --- ACO Overlay note ---------------------------------- */
  const acoOverlay = document.createElement('div');
  acoOverlay.className = 'outline-aco-overlay';
  acoOverlay.innerHTML = `
    <h4>ACO Overlay — Applies Across All Applicable Service Types</h4>
    <p>Accountable Care models create a total cost of care benchmark that spans all service-type silos. Any service a beneficiary receives — inpatient, outpatient, physician, post-acute, hospice, behavioral health — rolls up into the ACO's attributed spending. Models below are the primary ACO tracks active in 2026:</p>
    <ul>
      <li><strong>Medicare Shared Savings Program (MSSP)</strong> — 2012–present — BASIC and ENHANCED tracks; physician groups, hospitals, and FQHCs eligible 🟣 INNOVATION</li>
      <li><strong>Pioneer ACO</strong> — 2012–2016 — First advanced risk ACO model, most participants migrated to MSSP ⬛ ENDED</li>
      <li><strong>Next Generation ACO</strong> — 2016–2021 — Higher risk/reward, prospective attribution ⬛ ENDED</li>
      <li><strong>ACO REACH</strong> — 2023–present — Successor to Global and Professional DC models; mandatory Health Equity Plans; prospective attribution 🟣 INNOVATION</li>
    </ul>
    <p><em>Key stacking rule:</em> An ACO benchmark adjustment and an episode bundle (BPCI Advanced, CJR, TEAM) can apply to the same beneficiary event simultaneously. CMS has issued overlap policies — episode bundles generally take precedence for the acute episode; ACO benchmark absorbs the rest of the care continuum.</p>
  `;
  wrap.appendChild(acoOverlay);

  /* --- Key Takeaways ------------------------------------- */
  const takeaways = document.createElement('div');
  takeaways.className = 'outline-takeaways';
  takeaways.innerHTML = `
    <h4>Key Takeaways</h4>
    <ol>
      <li>
        <strong>CMMI models layer on top of base fee schedules at every service-type level.</strong>
        No payment silo stands alone — inpatient episodes (BPCI Advanced, TEAM, CJR), outpatient procedures (EOM, CJR), physician services (MCP, PCF), post-acute care (TEAM spillover, HHVBP), and Part D (Enhanced MTM, VBID) all have active model overlays. Identifying a provider's eligibility requires checking every applicable layer, not just the dominant fee schedule.
      </li>
      <li>
        <strong>Episode bundles deliberately cross service-type boundaries to drive coordination.</strong>
        BPCI Advanced, CJR, and TEAM all define 90-day episodes that begin with an inpatient trigger but include SNF, IRF, home health, and readmission costs. A hospital's episode risk is directly affected by its post-acute referral network quality — the financial incentive is explicitly designed to break down the inpatient/post-acute silo.
      </li>
      <li>
        <strong>Mandatory participation is replacing the voluntary era.</strong>
        TEAM (2026) is mandatory in selected geographic markets — hospitals cannot opt out. HHVBP expanded nationally in 2022 — all home health agencies participate. The ESRD QIP has always been mandatory. The "voluntary" CMMI model framing increasingly applies only to ACO and primary care tracks; episode models are trending toward required participation.
      </li>
      <li>
        <strong>Health equity is now embedded in the financial architecture.</strong>
        ACO REACH's benchmark methodology includes health equity adjustments. GUIDE targets dementia patients and their caregivers with explicit equity screening. AHEAD tests all-payer health equity approaches at the state level. IBH integrates physical and behavioral health for underserved populations. Equity is no longer a separate reporting requirement — it affects payment.
      </li>
      <li>
        <strong>IRA drug pricing interacts across multiple service-type layers.</strong>
        Part B drug price negotiation (Cycle 3, effective 2028) directly affects oncology (EOM, BPCI Advanced drug costs) and ESRD. Part D out-of-pocket caps and manufacturer DIR fee reforms restructure the Prescription Drug swimlane and cascade into the MA/Health Plan model (VBID benefit design). No drug-pricing change is isolated to a single service type.
      </li>
    </ol>
  `;
  wrap.appendChild(takeaways);

  container.appendChild(wrap);
}
