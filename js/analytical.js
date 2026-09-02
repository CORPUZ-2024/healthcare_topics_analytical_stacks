function initAnalytical(data) {
  const container = document.getElementById('analytical-container');
  if (!container) return;
  container.innerHTML = '';

  // ── 1. Filter bar ──────────────────────────────────────────────────────────
  const filterBar = document.createElement('div');
  filterBar.className = 'analytical-filters';

  const filters = [
    { label: 'All Tasks',  value: 'all'       },
    { label: 'Built',      value: 'built'      },
    { label: 'Specified',  value: 'specified'  },
    { label: 'Deferred',   value: 'deferred'   }
  ];

  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'analytical-filter-btn' + (f.value === 'all' ? ' active' : '');
    btn.dataset.filter = f.value;
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.analytical-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      grid.querySelectorAll('.task-card').forEach(card => {
        const show = f.value === 'all' || card.dataset.status === f.value;
        card.style.display = show ? '' : 'none';
      });
    });
    filterBar.appendChild(btn);
  });

  container.appendChild(filterBar);

  // ── 2. Task grid ───────────────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'analytical-grid';

  data.tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card collapsed';
    card.dataset.status = task.status;

    // Header
    const header = document.createElement('div');
    header.className = 'task-card-header';
    header.addEventListener('click', () => card.classList.toggle('collapsed'));

    const rankSpan = document.createElement('span');
    rankSpan.className = 'task-rank';
    rankSpan.textContent = task.rank;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'task-name-label';
    nameSpan.textContent = task.name;

    const statusBadge = document.createElement('span');
    statusBadge.className = `task-status-badge badge-${task.status}`;
    statusBadge.textContent = task.status.charAt(0).toUpperCase() + task.status.slice(1);

    const toggleIcon = document.createElement('span');
    toggleIcon.className = 'task-toggle-icon';
    toggleIcon.textContent = '▾';

    header.appendChild(rankSpan);
    header.appendChild(nameSpan);
    header.appendChild(statusBadge);
    header.appendChild(toggleIcon);
    card.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'task-card-body';

    // Section 1 — Method
    const sec1 = document.createElement('div');
    sec1.className = 'task-section';

    const sec1Title = document.createElement('div');
    sec1Title.className = 'task-section-title';
    sec1Title.textContent = 'Method';
    sec1.appendChild(sec1Title);

    const methodGrid = document.createElement('div');
    methodGrid.className = 'task-method-grid';

    const leftCol = document.createElement('div');
    const leftLabel = document.createElement('div');
    leftLabel.className = 'task-method-label';
    leftLabel.textContent = 'Tech Stack';
    const leftP = document.createElement('p');
    leftP.textContent = task.techStack;
    leftCol.appendChild(leftLabel);
    leftCol.appendChild(leftP);

    const rightCol = document.createElement('div');
    const rightLabel = document.createElement('div');
    rightLabel.className = 'task-method-label';
    rightLabel.textContent = 'Analytical Stack';
    const rightP = document.createElement('p');
    rightP.textContent = task.analyticalStack;
    rightCol.appendChild(rightLabel);
    rightCol.appendChild(rightP);

    methodGrid.appendChild(leftCol);
    methodGrid.appendChild(rightCol);
    sec1.appendChild(methodGrid);
    body.appendChild(sec1);

    // Section 2 — Scale & Grain
    const sec2 = document.createElement('div');
    sec2.className = 'task-section';

    const sec2Title = document.createElement('div');
    sec2Title.className = 'task-section-title';
    sec2Title.textContent = 'Scale & Grain';
    sec2.appendChild(sec2Title);

    const volRow = document.createElement('div');
    volRow.className = 'task-scale-row';
    volRow.innerHTML = `<strong>Data Volume:</strong> ${task.dataVolume}`;
    sec2.appendChild(volRow);

    const grainRow = document.createElement('div');
    grainRow.className = 'task-scale-row';
    grainRow.innerHTML = `<strong>Input \u2192</strong> ${task.inputGrain} \u2192 ${task.outputGrain}`;
    sec2.appendChild(grainRow);

    body.appendChild(sec2);

    // Section 3 — Healthcare Use Cases
    const sec3 = document.createElement('div');
    sec3.className = 'task-section';

    const sec3Title = document.createElement('div');
    sec3Title.className = 'task-section-title';
    sec3Title.textContent = 'Healthcare Use Cases';
    sec3.appendChild(sec3Title);

    const ucList = document.createElement('ol');
    ucList.className = 'task-use-cases';
    task.useCases.forEach(uc => {
      const li = document.createElement('li');
      li.textContent = uc;
      ucList.appendChild(li);
    });
    sec3.appendChild(ucList);
    body.appendChild(sec3);

    // Section 4 — Caveats & Common Mistakes
    const sec4 = document.createElement('div');
    sec4.className = 'task-section';

    const sec4Title = document.createElement('div');
    sec4Title.className = 'task-section-title';
    sec4Title.textContent = 'Caveats & Common Mistakes';
    sec4.appendChild(sec4Title);

    const cavList = document.createElement('ul');
    cavList.className = 'task-caveats';
    task.caveats.forEach(cav => {
      const li = document.createElement('li');
      li.textContent = cav;
      cavList.appendChild(li);
    });
    sec4.appendChild(cavList);
    body.appendChild(sec4);

    // Footer — modules
    const modFooter = document.createElement('div');
    modFooter.className = 'task-modules';
    modFooter.textContent = `Modules: ${task.modulesTouched}`;
    body.appendChild(modFooter);

    // Status note (if non-empty)
    if (task.statusNote && task.statusNote.trim() !== '') {
      const noteDiv = document.createElement('div');
      noteDiv.className = 'task-status-note';
      noteDiv.textContent = task.statusNote;
      body.appendChild(noteDiv);
    }

    card.appendChild(body);
    grid.appendChild(card);
  });

  container.appendChild(grid);

  // ── 3. Cross-cutting section ───────────────────────────────────────────────
  const crosscut = document.createElement('div');
  crosscut.className = 'analytical-crosscut';

  const ccH4 = document.createElement('h4');
  ccH4.textContent = 'Cross-Cutting Stack';
  crosscut.appendChild(ccH4);

  const floorP = document.createElement('p');
  floorP.textContent = `Shared floor \u2014 all tasks: ${data.crossCutting.sharedFloor}`;
  crosscut.appendChild(floorP);

  const libTable = document.createElement('table');
  libTable.className = 'crosscut-lib-table';

  const libThead = document.createElement('thead');
  libThead.innerHTML = '<tr><th>Library</th><th>Used By</th></tr>';
  libTable.appendChild(libThead);

  const libTbody = document.createElement('tbody');
  data.crossCutting.libraries.forEach(entry => {
    const tr = document.createElement('tr');
    const tdLib = document.createElement('td');
    tdLib.textContent = entry.lib;
    const tdTasks = document.createElement('td');
    tdTasks.textContent = entry.tasks;
    tr.appendChild(tdLib);
    tr.appendChild(tdTasks);
    libTbody.appendChild(tr);
  });
  libTable.appendChild(libTbody);
  crosscut.appendChild(libTable);

  const platformP = document.createElement('p');
  platformP.textContent = data.crossCutting.platformNote;
  crosscut.appendChild(platformP);

  container.appendChild(crosscut);

  // ── 4. Volume & grain reference section ───────────────────────────────────
  const volGrain = document.createElement('div');
  volGrain.className = 'analytical-volgrain';

  // Volume reference
  const volH4 = document.createElement('h4');
  volH4.textContent = 'Data Volume Reference (ascending input row count)';
  volGrain.appendChild(volH4);

  const volTable = document.createElement('table');
  volTable.className = 'volgrain-table';

  const volThead = document.createElement('thead');
  volThead.innerHTML = '<tr><th>Task</th><th>Typical Input Rows</th></tr>';
  volTable.appendChild(volThead);

  const volRows = [
    { task: 'provider_profile',       rows: '50\u20135,000 providers (output grain; input scales with panel)' },
    { task: 'benchmark',              rows: 'hundreds\u2013low thousands (benchmark side only)' },
    { task: 'comparison',             rows: '100\u2013100K per arm' },
    { task: 'regression',             rows: '1,250\u201360,000+ (events-per-variable floor dependent)' },
    { task: 'risk_score',             rows: '30K\u201380K (member \u00d7 diagnosis)' },
    { task: 'segmentation',           rows: '10K\u20131M' },
    { task: 'rate_measure',           rows: '10K\u20131M (denominator-bound)' },
    { task: 'pmpm / reconciliation',  rows: '10K\u201310M (claim-line grain input)' },
    { task: 'episode',                rows: '100K\u20135M (claim-line grain input, collapses to episode)' },
    { task: 'descriptive / trend',    rows: '10K\u20135M+ (scales to available memory)' },
    { task: 'causal',                 rows: 'Panel-shaped; total N varies by design' }
  ];

  const volTbody = document.createElement('tbody');
  volRows.forEach(r => {
    const tr = document.createElement('tr');
    const tdTask = document.createElement('td');
    tdTask.textContent = r.task;
    const tdRows = document.createElement('td');
    tdRows.textContent = r.rows;
    tr.appendChild(tdTask);
    tr.appendChild(tdRows);
    volTbody.appendChild(tr);
  });
  volTable.appendChild(volTbody);
  volGrain.appendChild(volTable);

  // Grain reference
  const grainH4 = document.createElement('h4');
  grainH4.textContent = 'Entity Grain Reference (input \u2192 output)';
  volGrain.appendChild(grainH4);

  const grainTable = document.createElement('table');
  grainTable.className = 'volgrain-table';

  const grainThead = document.createElement('thead');
  grainThead.innerHTML = '<tr><th>Task</th><th>Input Grain</th><th>Output Grain</th></tr>';
  grainTable.appendChild(grainThead);

  const grainTbody = document.createElement('tbody');
  data.tasks.forEach(task => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = task.name;
    const tdIn = document.createElement('td');
    tdIn.textContent = task.inputGrain;
    const tdOut = document.createElement('td');
    tdOut.textContent = task.outputGrain;
    tr.appendChild(tdName);
    tr.appendChild(tdIn);
    tr.appendChild(tdOut);
    grainTbody.appendChild(tr);
  });
  grainTable.appendChild(grainTbody);
  volGrain.appendChild(grainTable);

  container.appendChild(volGrain);
}
