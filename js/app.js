/* ============================================================
   app.js — Application Bootstrap & Tab Controller
   Policy Synthesis Project
   ============================================================ */

(function () {
  'use strict';

  /* Track which tabs have been initialized */
  const initialized = {
    ontology:      false,
    reimbursement: false,
    taxonomy:      false,
    analytical:    false
  };

  document.addEventListener('DOMContentLoaded', function () {

    /* --- Validate inline data ----------------------------- */
    if (!window.__NODES__ || !window.__EDGES__) {
      console.error('app.js: __NODES__ or __EDGES__ not found on window.');
    }
    if (!window.__SERVICE_TYPES__ || !window.__CMMI_MODELS__) {
      console.error('app.js: __SERVICE_TYPES__ or __CMMI_MODELS__ not found on window.');
    }
    if (!window.__DATASETS__) {
      console.error('app.js: __DATASETS__ not found on window.');
    }
    if (!window.__ANALYTICAL_TASKS__) {
      console.error('app.js: __ANALYTICAL_TASKS__ not found on window.');
    }

    /* --- Tab Switching ------------------------------------ */
    const tabs   = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    function activateTab(tabName) {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      const activeTab   = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
      const activePanel = document.getElementById('tab-' + tabName);

      if (activeTab)   activeTab.classList.add('active');
      if (activePanel) activePanel.classList.add('active');

      /* Lazy-initialize visualization on first activation */
      if (tabName === 'ontology' && !initialized.ontology) {
        initialized.ontology = true;
        try {
          initOntology(window.__NODES__, window.__EDGES__);
        } catch (e) {
          console.error('initOntology error:', e);
        }
        try {
          initCompanyOntology(window.__COMPANY_NODES__, window.__COMPANY_EDGES__);
        } catch (e) {
          console.error('initCompanyOntology error:', e);
        }
        try {
          initTopShifts(window.__TOP_SHIFTS__);
        } catch (e) {
          console.error('initTopShifts error:', e);
        }

        /* Graph toggle logic */
        const graphToggleBtns = document.querySelectorAll('.graph-toggle-btn');
        const graphPanels = document.querySelectorAll('.graph-panel');

        graphToggleBtns.forEach(btn => {
          btn.addEventListener('click', function() {
            graphToggleBtns.forEach(b => b.classList.remove('active'));
            graphPanels.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('graph-' + this.dataset.graph).classList.add('active');
          });
        });
      }

      if (tabName === 'reimbursement' && !initialized.reimbursement) {
        initialized.reimbursement = true;
        try {
          initReimbursement(window.__SERVICE_TYPES__, window.__CMMI_MODELS__);
        } catch (e) {
          console.error('initReimbursement error:', e);
        }
      }

      if (tabName === 'taxonomy' && !initialized.taxonomy) {
        initialized.taxonomy = true;
        try {
          initTaxonomy(window.__DATASETS__);
        } catch (e) {
          console.error('initTaxonomy error:', e);
        }
      }

      if (tabName === 'analytical' && !initialized.analytical) {
        initialized.analytical = true;
        try {
          initAnalytical(window.__ANALYTICAL_TASKS__);
        } catch (e) {
          console.error('initAnalytical error:', e);
        }
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        activateTab(this.dataset.tab);
      });

      /* Keyboard support */
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateTab(this.dataset.tab);
        }
      });
    });

    /* --- Initialize first tab (Ontology) by default ------ */
    activateTab('ontology');

    /* --- Global keyboard shortcut: 1/2/3 to switch tabs -- */
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      const tabMap = { '1': 'ontology', '2': 'reimbursement', '3': 'taxonomy', '4': 'analytical' };
      if (tabMap[e.key]) activateTab(tabMap[e.key]);
    });

    /* --- Window resize: re-trigger reimbursement if active */
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        const activePanel = document.querySelector('.tab-panel.active');
        if (activePanel && activePanel.id === 'tab-reimbursement' && initialized.reimbursement) {
          // Reimbursement handles its own ResizeObserver; this is a safety net
          try {
            initReimbursement(window.__SERVICE_TYPES__, window.__CMMI_MODELS__);
          } catch (e) {
            console.error('reimbursement resize error:', e);
          }
        }
      }, 300);
    });

    console.log(
      '%cPolicy Synthesis Project loaded',
      'color:#00b4d8;font-weight:bold;font-size:14px'
    );
    console.log(
      `Nodes: ${(window.__NODES__ || []).length} | ` +
      `Edges: ${(window.__EDGES__ || []).length} | ` +
      `Company Nodes: ${(window.__COMPANY_NODES__ || []).length} | ` +
      `Company Edges: ${(window.__COMPANY_EDGES__ || []).length} | ` +
      `Top Shifts: ${(window.__TOP_SHIFTS__ || []).length} | ` +
      `Models: ${(window.__CMMI_MODELS__ || []).length} | ` +
      `Service Types: ${(window.__SERVICE_TYPES__ || []).length} | ` +
      `Datasets: ${(window.__DATASETS__ || []).length} | ` +
      `Analytical Tasks: ${(window.__ANALYTICAL_TASKS__ && window.__ANALYTICAL_TASKS__.tasks || []).length}`
    );
  });

})();
