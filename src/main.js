import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import './style.css';

const A4 = { width: 210, height: 297 };
const MM_TO_PT = 72 / 25.4;

const profiles = [
  {
    id: 'herma-4464',
    brand: 'HERMA',
    name: '4464 · 70 × 37 mm',
    detail: '24-up · 3 × 8 · white paper',
    labelW: 70,
    labelH: 37,
    cols: 3,
    rows: 8,
    marginX: 0,
    marginY: 0.5,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'herma-4451',
    brand: 'HERMA',
    name: '4451 · 70 × 42 mm',
    detail: '21-up · 3 × 7 · white paper',
    labelW: 70,
    labelH: 42,
    cols: 3,
    rows: 7,
    marginX: 0,
    marginY: 1.5,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'herma-4677',
    brand: 'HERMA',
    name: '4677 · 63.5 × 38.1 mm',
    detail: '21-up · 3 × 7 · address size',
    labelW: 63.5,
    labelH: 38.1,
    cols: 3,
    rows: 7,
    marginX: 9.75,
    marginY: 15.15,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'herma-4678',
    brand: 'HERMA',
    name: '4678 · 99.1 × 38.1 mm',
    detail: '14-up · 2 × 7 · address size',
    labelW: 99.1,
    labelH: 38.1,
    cols: 2,
    rows: 7,
    marginX: 5.9,
    marginY: 15.15,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'herma-4470',
    brand: 'HERMA',
    name: '4470 · 105 × 74 mm',
    detail: '8-up · 2 × 4 · large badge',
    labelW: 105,
    labelH: 74,
    cols: 2,
    rows: 4,
    marginX: 0,
    marginY: 0.5,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'herma-4676',
    brand: 'HERMA',
    name: '4676 · 105 × 148.5 mm',
    detail: '4-up · 2 × 2 · half-page',
    labelW: 105,
    labelH: 148.5,
    cols: 2,
    rows: 2,
    marginX: 0,
    marginY: 0,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'avery-l7124',
    brand: 'Avery',
    name: 'L7124 · 45 × 45 mm',
    detail: '20-up · 4 × 5 · square',
    labelW: 45,
    labelH: 45,
    cols: 4,
    rows: 5,
    marginX: 15,
    marginY: 13.5,
    gapX: 0,
    gapY: 0,
  },
  {
    id: 'avery-l7158',
    brand: 'Avery',
    name: 'L7158 · 64 × 26.7 mm',
    detail: '30-up · 3 × 10 · quick peel',
    labelW: 64,
    labelH: 26.7,
    cols: 3,
    rows: 10,
    marginX: 9,
    marginY: 15,
    gapX: 0,
    gapY: 0,
  },
];

const sampleTSV = [
  ['Name', 'Organisation', 'Role', 'Code'],
  ['Alicia Tan', 'Northstar Events', 'Volunteer', 'A-018'],
  ['Chua Wei Ming', 'Northstar Events', 'Registration', 'A-019'],
  ['Siti Nur Aisyah', 'Civic Arts Network', 'Speaker', 'A-020'],
  ['Marcus Lim', 'Northstar Events', 'Floor Lead', 'A-021'],
  ['Maya O’Connell', 'Open House SG', 'Partner', 'A-022'],
  ['Priya Nair', 'Civic Arts Network', 'Programme Lead', 'A-023'],
  ['Haziq Rahman', 'Open House SG', 'Crew', 'A-024'],
  ['Thirunavukkarasu Venkatesan', 'Singapore Youth Arts Collective', 'Programme Lead', 'A-025'],
  ['Nurul Iman', 'Northstar Events', 'Volunteer', 'A-026'],
].map((row) => row.join('\t')).join('\n');

const layouts = [
  {
    id: 'name-organisation',
    name: 'Name + organisation',
    detail: 'Two centered rows · first line leads',
    kind: 'centered',
    slots: [
      { key: 'name', label: 'Name', defaultColumn: 'Name', fontSize: 18, weight: 'bold', italic: false, align: 'center' },
      { key: 'organisation', label: 'Organisation', defaultColumn: 'Organisation', fontSize: 11, weight: 'normal', italic: false, align: 'center' },
    ],
  },
  {
    id: 'organisation-name',
    name: 'Organisation + name',
    detail: 'Two centered rows · second line leads',
    kind: 'centered',
    slots: [
      { key: 'organisation', label: 'Organisation', defaultColumn: 'Organisation', fontSize: 11, weight: 'normal', italic: false, align: 'center' },
      { key: 'name', label: 'Name', defaultColumn: 'Name', fontSize: 18, weight: 'bold', italic: false, align: 'center' },
    ],
  },
  {
    id: 'name-org-role',
    name: 'Name / organisation / role',
    detail: 'Three centered rows · largest → small',
    kind: 'centered',
    slots: [
      { key: 'name', label: 'Name', defaultColumn: 'Name', fontSize: 20, weight: 'bold', italic: false, align: 'center' },
      { key: 'organisation', label: 'Organisation', defaultColumn: 'Organisation', fontSize: 13, weight: 'bold', italic: false, align: 'center' },
      { key: 'role', label: 'Role', defaultColumn: 'Role', fontSize: 9, weight: 'normal', italic: false, align: 'center' },
    ],
  },
  {
    id: 'name-role-org',
    name: 'Name / role / organisation',
    detail: 'Three centered rows · normal → big → normal',
    kind: 'centered',
    slots: [
      { key: 'name', label: 'Name', defaultColumn: 'Name', fontSize: 12, weight: 'normal', italic: false, align: 'center' },
      { key: 'role', label: 'Role', defaultColumn: 'Role', fontSize: 18, weight: 'bold', italic: false, align: 'center' },
      { key: 'organisation', label: 'Organisation', defaultColumn: 'Organisation', fontSize: 11, weight: 'normal', italic: false, align: 'center' },
    ],
  },
  {
    id: 'triptych',
    name: 'Top-left / centre / top-right',
    detail: 'Three fields · corners + large centre',
    kind: 'triptych',
    slots: [
      { key: 'name', label: 'Top-left field', defaultColumn: 'Name', fontSize: 8, weight: 'bold', italic: false, align: 'left', position: 'top-left' },
      { key: 'organisation', label: 'Centre field', defaultColumn: 'Organisation', fontSize: 18, weight: 'bold', italic: false, align: 'center', position: 'center' },
      { key: 'code', label: 'Top-right field', defaultColumn: 'Code', fontSize: 8, weight: 'bold', italic: false, align: 'right', position: 'top-right' },
    ],
  },
  {
    id: 'name-code',
    name: 'Name + code',
    detail: 'Two centered rows · practical check-in badge',
    kind: 'centered',
    slots: [
      { key: 'name', label: 'Name', defaultColumn: 'Name', fontSize: 19, weight: 'bold', italic: false, align: 'center' },
      { key: 'code', label: 'Code', defaultColumn: 'Code', fontSize: 10, weight: 'normal', italic: true, align: 'center' },
    ],
  },
  {
    id: 'role-name',
    name: 'Role + name',
    detail: 'Two centered rows · role first',
    kind: 'centered',
    slots: [
      { key: 'role', label: 'Role', defaultColumn: 'Role', fontSize: 10, weight: 'normal', italic: true, align: 'center' },
      { key: 'name', label: 'Name', defaultColumn: 'Name', fontSize: 18, weight: 'bold', italic: false, align: 'center' },
    ],
  },
  {
    id: 'name-team-role',
    name: 'Name / team / role',
    detail: 'Three centered rows · compact badge',
    kind: 'centered',
    slots: [
      { key: 'name', label: 'Name', defaultColumn: 'Name', fontSize: 16, weight: 'bold', italic: false, align: 'center' },
      { key: 'organisation', label: 'Team', defaultColumn: 'Organisation', fontSize: 10, weight: 'normal', italic: false, align: 'center' },
      { key: 'role', label: 'Role', defaultColumn: 'Role', fontSize: 9, weight: 'normal', italic: true, align: 'center' },
    ],
  },
];

const app = document.querySelector('#app');

const state = {
  page: 'stock',
  theme: 'dark',
  profileId: profiles[0].id,
  layoutId: layouts[0].id,
  activeSlot: 0,
  rawInput: sampleTSV,
  headers: ['Name', 'Organisation', 'Role', 'Code'],
  rows: parsePastedData(sampleTSV).rows,
  mappings: {},
  customLabels: {},
  styles: {},
  busy: false,
  lastDownload: '',
  installPrompt: null,
  warningOpen: false,
};

function currentProfile() {
  return profiles.find((profile) => profile.id === state.profileId) ?? profiles[0];
}

function currentLayout() {
  return layouts.find((layout) => layout.id === state.layoutId) ?? layouts[0];
}

function markDirty() {
  state.lastDownload = '';
  state.warningOpen = false;
}

function ensureLayoutState() {
  const layout = currentLayout();
  layout.slots.forEach((slot, index) => {
    if (!(slot.key in state.mappings)) state.mappings[slot.key] = state.headers.includes(slot.defaultColumn) ? slot.defaultColumn : state.headers[index] ?? state.headers[0] ?? '';
    if (!(slot.key in state.customLabels)) state.customLabels[slot.key] = slot.label;
    if (!(slot.key in state.styles)) state.styles[slot.key] = { fontSize: slot.fontSize, weight: slot.weight, italic: slot.italic, align: slot.align };
  });
  if (state.activeSlot >= layout.slots.length) state.activeSlot = 0;
}

function parseLine(line, delimiter) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value.trim());
  return values;
}

function parsePastedData(input) {
  const lines = input.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) return { headers: [], rows: [] };
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = parseLine(lines[0], delimiter).map((header, index) => header || `Column ${index + 1}`);
  const rows = lines.slice(1).map((line) => {
    const values = parseLine(line, delimiter);
    return headers.reduce((row, header, index) => ({ ...row, [header]: values[index] ?? '' }), {});
  });
  return { headers, rows };
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function selected(value, current) {
  return value === current ? ' selected' : '';
}

function checked(value) {
  return value ? ' aria-pressed="true"' : ' aria-pressed="false"';
}

function getSlotValue(row, slot) {
  const sourceColumn = state.mappings[slot.key];
  return sourceColumn ? String(row[sourceColumn] ?? '').trim() : '';
}

function getWarnings() {
  const profile = currentProfile();
  const layout = currentLayout();
  const warnings = [];
  state.rows.forEach((row, rowIndex) => {
    layout.slots.forEach((slot) => {
      const value = getSlotValue(row, slot);
      if (!value) return;
      const style = state.styles[slot.key] ?? slot;
      const estimatedCharacters = Math.max(10, Math.floor((profile.labelW - 8) / Math.max(2.2, style.fontSize * 0.23)));
      if (value.length > estimatedCharacters * 1.18) {
        warnings.push({ rowIndex, slot: state.customLabels[slot.key] ?? slot.label, value });
      }
    });
  });
  return warnings;
}

function formatCount(number, singular, plural = `${singular}s`) {
  return `${number} ${number === 1 ? singular : plural}`;
}

function renderHeader() {
  return `
    <header class="topbar">
      <a class="brand" href="#studio" data-page="studio" aria-label="Label Studio home">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
        <span>Label Studio</span>
      </a>
      <nav class="topnav" aria-label="Primary">
        <button class="nav-link ${state.page === 'studio' ? 'active' : ''}" data-page="studio">Studio</button>
        <button class="nav-link ${state.page === 'guide' ? 'active' : ''}" data-page="guide">Print guide</button>
        <button class="nav-link ${state.page === 'privacy' ? 'active' : ''}" data-page="privacy">Privacy</button>
      </nav>
      <div class="top-actions">
        ${state.installPrompt ? '<button class="install-button" data-action="install-app">Install app</button>' : ''}
        <div class="local-chip"><span class="status-dot"></span>Local only</div>
      </div>
    </header>`;
}

function renderProfileOptions() {
  return profiles.map((profile) => `
    <option value="${profile.id}"${selected(profile.id, state.profileId)}>${profile.brand} · ${profile.name.split(' · ')[1]}</option>
  `).join('');
}

function renderProfileSummary() {
  const profile = currentProfile();
  return `
    <div class="profile-summary">
      <div class="stock-icon"><span></span><span></span><span></span></div>
      <div>
        <strong>${escapeHtml(profile.brand)} · ${escapeHtml(profile.name.split(' · ')[0])}</strong>
        <span>${escapeHtml(profile.detail)}</span>
      </div>
      <span class="verified-badge">A4</span>
    </div>`;
}

function renderLayoutCards() {
  return layouts.map((layout) => `
    <button class="layout-card ${layout.id === state.layoutId ? 'active' : ''}" data-layout="${layout.id}">
      <span class="layout-mini ${layout.kind}">
        ${layout.slots.map((slot) => `<i class="mini-line align-${slot.align}" style="--mini-size:${Math.max(0.45, slot.fontSize / 15)}"></i>`).join('')}
      </span>
      <span class="layout-copy"><strong>${escapeHtml(layout.name)}</strong><small>${escapeHtml(layout.detail)}</small></span>
      <span class="radio-dot"></span>
    </button>`).join('');
}

function renderFieldMapping() {
  const layout = currentLayout();
  const style = state.styles[layout.slots[state.activeSlot]?.key] ?? layout.slots[state.activeSlot];
  return `
    <section class="panel-section mapping-section">
      <div class="section-heading">
        <div><p class="eyebrow">CONTENT FIELDS</p><h2>Map your columns</h2></div>
        <span class="step-tag">02</span>
      </div>
      <p class="section-help">Choose what each placeholder should print. Click a field to format it.</p>
      <div class="mapping-list">
        ${layout.slots.map((slot, index) => `
          <div class="mapping-row ${index === state.activeSlot ? 'active' : ''}" data-slot="${index}">
            <button class="slot-select" data-active-slot="${index}" aria-label="Edit ${escapeHtml(state.customLabels[slot.key] ?? slot.label)}">
              <span class="slot-number">0${index + 1}</span><span>${escapeHtml(state.customLabels[slot.key] ?? slot.label)}</span>
            </button>
            <input class="slot-label-input" data-slot-label="${slot.key}" value="${escapeHtml(state.customLabels[slot.key] ?? slot.label)}" aria-label="Field label" />
            <select class="column-select" data-mapping="${slot.key}" aria-label="Spreadsheet column for ${escapeHtml(slot.label)}">
              <option value=""${!state.mappings[slot.key] ? ' selected' : ''}>Choose a column</option>
              ${state.headers.map((header) => `<option value="${escapeHtml(header)}"${selected(header, state.mappings[slot.key])}>${escapeHtml(header)}</option>`).join('')}
            </select>
          </div>`).join('')}
      </div>
      <div class="format-toolbar" aria-label="Text formatting">
        <span class="toolbar-caption">FORMAT <span>· ${escapeHtml(state.customLabels[layout.slots[state.activeSlot]?.key] ?? '')}</span></span>
        <div class="toolbar-actions">
          <button class="format-button ${style.weight === 'bold' ? 'pressed' : ''}" data-format="bold"${checked(style.weight === 'bold')} title="Bold">B</button>
          <button class="format-button italic ${style.italic ? 'pressed' : ''}" data-format="italic"${checked(style.italic)} title="Italic">I</button>
          <button class="format-button" data-format="decrease" title="Decrease font size">A<span>−</span></button>
          <span class="font-readout">${style.fontSize} pt</span>
          <button class="format-button" data-format="increase" title="Increase font size">A<span>+</span></button>
        </div>
      </div>
    </section>`;
}

function renderDataPanel() {
  const pageCount = Math.max(1, Math.ceil(state.rows.length / (currentProfile().cols * currentProfile().rows)));
  return `
    <section class="panel-section data-section">
      <div class="section-heading">
        <div><p class="eyebrow">PARTICIPANT DATA</p><h2>Paste spreadsheet rows</h2></div>
        <span class="step-tag">03</span>
      </div>
      <p class="section-help">Include the header row. Tab-separated columns from Excel or Sheets work best.</p>
      <textarea id="data-input" class="data-input" spellcheck="false" aria-label="Paste participant spreadsheet data">${escapeHtml(state.rawInput)}</textarea>
      <div class="data-actions">
        <button class="text-button" data-action="load-sample">↺ Load sample data</button>
        <span class="data-count">${formatCount(state.rows.length, 'row')} · ${formatCount(pageCount, 'page')}</span>
      </div>
      <button class="apply-data-button" data-action="apply-data">Apply pasted data <span>↗</span></button>
    </section>`;
}

function renderChecks() {
  const warnings = getWarnings();
  const mappingGaps = currentLayout().slots.filter((slot) => !state.mappings[slot.key] || !state.headers.includes(state.mappings[slot.key]));
  const profile = currentProfile();
  const pages = Math.max(1, Math.ceil(state.rows.length / (profile.cols * profile.rows)));
  const issueCount = warnings.length + mappingGaps.length;
  return `
    <div class="checks-card">
      <div class="checks-head"><span class="eyebrow">PRE-FLIGHT</span><span class="check-count">${issueCount ? `${issueCount} check${issueCount === 1 ? '' : 's'}` : 'All clear'}</span></div>
      <div class="check-line ${state.rows.length > 0 ? 'good' : 'bad'}"><span class="check-icon">${state.rows.length > 0 ? '✓' : '!'}</span><span>${state.rows.length > 0 ? `${state.rows.length} participant rows ready` : 'Paste at least one participant row'}</span></div>
      ${mappingGaps.length ? `<div class="check-line bad"><span class="check-icon">!</span><span>${mappingGaps.length} field${mappingGaps.length === 1 ? '' : 's'} still need a source column</span></div>` : ''}
      <div class="check-line good"><span class="check-icon">✓</span><span>${pages} ${pages === 1 ? 'A4 page' : 'A4 pages'} · ${profile.cols * profile.rows} labels per page</span></div>
      ${warnings.length ? `<div class="warning-list"><div class="check-line warning"><span class="check-icon">!</span><span>${warnings.length} text ${warnings.length === 1 ? 'field may' : 'fields may'} run long</span></div><button class="warning-detail" data-action="show-warnings">Review long text ↗</button></div>` : '<div class="check-line good"><span class="check-icon">✓</span><span>Text fits current label size</span></div>'}
    </div>`;
}

function renderPreview() {
  const profile = currentProfile();
  const layout = currentLayout();
  const capacity = profile.cols * profile.rows;
  const previewRows = [...state.rows.slice(0, capacity)];
  while (previewRows.length < capacity) previewRows.push({});
  return `
    <section class="preview-panel">
      <div class="preview-toolbar">
        <div>
          <p class="eyebrow">LIVE PREVIEW</p>
          <h2>First page · ${escapeHtml(profile.name)}</h2>
        </div>
        <div class="preview-actions"><span class="zoom-chip">100% layout</span><button class="icon-button" data-action="reset-preview" title="Reset to first page">↺</button></div>
      </div>
      <div class="paper-stage">
        <div class="a4-paper" style="--cols:${profile.cols};--rows:${profile.rows};">
          ${previewRows.map((row, index) => renderPreviewLabel(row, layout, index, profile)).join('')}
        </div>
      </div>
      <div class="preview-footer"><span><i class="legend-swatch"></i> Printable label area</span><span>${profile.cols} columns × ${profile.rows} rows</span></div>
    </section>`;
}

function renderPreviewLabel(row, layout, index, profile) {
  const values = layout.slots.map((slot) => ({ slot, value: getSlotValue(row, slot), style: state.styles[slot.key] ?? slot }));
  const isEmpty = values.every(({ value }) => !value);
  const column = index % profile.cols;
  const rowIndex = Math.floor(index / profile.cols);
  const edgeClass = `${column === profile.cols - 1 ? ' last-col' : ''}${rowIndex === profile.rows - 1 ? ' last-row' : ''}`;
  return `<div class="preview-label ${isEmpty ? 'empty' : ''} ${layout.kind}${edgeClass}">
    <div class="label-content">
      ${values.map(({ slot, value, style }) => `<span class="preview-text align-${style.align}" style="font-size:${Math.max(6, style.fontSize * 0.34)}px;font-weight:${style.weight === 'bold' ? 750 : 450};font-style:${style.italic ? 'italic' : 'normal'}">${escapeHtml(value || ' ')}</span>`).join('')}
    </div>
    ${index === 0 && !isEmpty ? '<span class="preview-focus">1</span>' : ''}
  </div>`;
}

function renderStudio() {
  ensureLayoutState();
  const profile = currentProfile();
  const mappingGaps = currentLayout().slots.filter((slot) => !state.mappings[slot.key] || !state.headers.includes(state.mappings[slot.key]));
  return `
    <main class="page studio-page">
      <div class="page-intro">
        <div><p class="eyebrow">PRINT WORKSPACE</p><h1>Make a sheet of labels.</h1><p class="intro-copy">Choose a stock, map your columns, and download a ready-to-print A4 PDF.</p></div>
        <div class="workspace-note"><span class="shield-icon">⌁</span><div><strong>Nothing leaves this device</strong><span>Participant data stays in this browser tab.</span></div></div>
      </div>
      <div class="stepper" aria-label="Workflow steps">
        <span class="stepper-step active"><b>01</b> Stock</span><span class="stepper-line"></span><span class="stepper-step active"><b>02</b> Content</span><span class="stepper-line"></span><span class="stepper-step active"><b>03</b> Data</span><span class="stepper-line"></span><span class="stepper-step"><b>04</b> Export</span>
      </div>
      <div class="studio-grid">
        <aside class="setup-panel">
          <section class="panel-section stock-section">
            <div class="section-heading"><div><p class="eyebrow">STICKER STOCK</p><h2>Choose your A4 sheet</h2></div><span class="step-tag">01</span></div>
            <p class="section-help">Select the product code on your packet. Margins and gaps are already built in.</p>
            <label class="select-label" for="profile-select">Brand and size</label>
            <select id="profile-select" class="profile-select">${renderProfileOptions()}</select>
            ${renderProfileSummary()}
          </section>
          <section class="panel-section template-section">
            <div class="section-heading"><div><p class="eyebrow">CONTENT PATTERN</p><h2>Pick a layout</h2></div></div>
            <div class="layout-grid">${renderLayoutCards()}</div>
          </section>
          ${renderFieldMapping()}
        </aside>
        ${renderPreview()}
        <aside class="action-panel">
          ${renderDataPanel()}
          <section class="panel-section export-section">
            <div class="section-heading"><div><p class="eyebrow">READY TO PRINT</p><h2>Check and export</h2></div><span class="step-tag">04</span></div>
            ${renderChecks()}
            <button class="download-button" data-action="download-pdf" ${state.rows.length && mappingGaps.length === 0 ? '' : 'disabled'}><span>${state.busy ? 'Building PDF…' : 'Download A4 PDF'}</span><span class="download-icon">↓</span></button>
            ${state.lastDownload ? `<div class="download-success"><span>✓</span><span>PDF downloaded · ${escapeHtml(state.lastDownload)}</span></div>` : ''}
            <p class="export-note">Print at <strong>100% / Actual Size</strong>. Start with the plain-paper test on the Print guide.</p>
          </section>
          <section class="mini-help-card"><span class="mini-help-icon">?</span><div><strong>New to label sheets?</strong><button class="inline-link" data-page="guide">Read the 60-second print guide ↗</button></div></section>
        </aside>
      </div>
    </main>`;
}

function renderGuide() {
  return `
    <main class="page reading-page">
      <div class="reading-header"><p class="eyebrow">PRINT GUIDE</p><h1>One quick test saves a sheet.</h1><p>PDF alignment is exact, but printers can scale or feed paper differently. Use this short check before loading sticker stock.</p></div>
      <div class="guide-grid">
        <section class="guide-card lead-guide"><span class="guide-number">01</span><div><h2>Print the test page on plain paper</h2><p>Download your PDF from Studio, then print one page onto ordinary A4 paper. Use <strong>Actual Size</strong> or <strong>100%</strong>—never Fit, Shrink, or Scale to Printable Area.</p></div><div class="settings-strip"><span>Paper size <b>A4</b></span><span>Scale <b>100%</b></span><span>Media <b>Labels / Heavyweight</b></span></div></section>
        <section class="guide-card"><span class="guide-number">02</span><h2>Lay it over the sticker sheet</h2><p>Hold the printed page behind the sticker sheet against a bright window or light. The content should sit inside each label.</p><div class="guide-illustration overlay-illustration"><div class="paper-outline"></div><div class="label-outline"></div><span>alignment</span></div></section>
        <section class="guide-card"><span class="guide-number">03</span><h2>Only then use sticker stock</h2><p>Feed one sheet at a time. Use the printer’s manual or multipurpose tray when available, and choose a thicker media setting.</p><div class="guide-illustration feed-illustration"><span>plain paper</span><span>→</span><span>sticker sheet</span></div></section>
        <section class="guide-card warning-guide"><span class="guide-number">04</span><h2>If it is shifted</h2><p>Check that the PDF viewer did not scale the file. Different printers can have a small, consistent offset; adjust the printer driver or use the stock manufacturer’s recommended settings.</p></section>
      </div>
      <div class="back-link-row"><button class="back-link" data-page="studio">← Back to Studio</button></div>
    </main>`;
}

function renderPrivacy() {
  return `
    <main class="page reading-page privacy-page">
      <div class="reading-header"><p class="eyebrow">PRIVACY</p><h1>Your participant list stays with you.</h1><p>Label Studio is designed for small offices handling event information that should not become another cloud database.</p></div>
      <div class="privacy-grid">
        <section class="privacy-card accent-card"><span class="privacy-icon">↯</span><h2>Local processing</h2><p>Pasted spreadsheet data is held in this browser tab while you work. The PDF is assembled on this device and downloaded directly to you.</p></section>
        <section class="privacy-card"><span class="privacy-icon">□</span><h2>No account required</h2><p>No sign-in, participant database, file upload, or shared workspace is needed for the workflow.</p></section>
        <section class="privacy-card"><span class="privacy-icon">⌁</span><h2>Templates are separate</h2><p>Stock templates and content patterns are product configuration, not participant records. Your data is only used to fill the chosen layout.</p></section>
      </div>
      <div class="privacy-note"><strong>Prototype note</strong><span>This prototype keeps the pasted data in memory only. Closing or refreshing the tab clears the working data.</span></div>
      <div class="back-link-row"><button class="back-link" data-page="studio">← Back to Studio</button></div>
    </main>`;
}

function renderApp() {
  wizardView.renderApp();
}

function updateData(input) {
  const parsed = parsePastedData(input);
  markDirty();
  state.rawInput = input;
  state.headers = parsed.headers;
  state.rows = parsed.rows;
  Object.keys(state.mappings).forEach((key) => {
    if (!state.headers.includes(state.mappings[key])) state.mappings[key] = '';
  });
  ensureLayoutState();
}

function selectPage(page) {
  state.page = page;
  window.location.hash = page;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      selectPage(element.dataset.page);
    });
  });

  document.querySelector('[data-action="install-app"]')?.addEventListener('click', async () => {
    if (!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt = null;
    renderApp();
  });

  document.querySelector('#profile-select')?.addEventListener('change', (event) => {
    markDirty();
    state.profileId = event.target.value;
    renderApp();
  });

  document.querySelectorAll('[data-layout]').forEach((element) => {
    element.addEventListener('click', () => {
      markDirty();
      state.layoutId = element.dataset.layout;
      state.activeSlot = 0;
      ensureLayoutState();
      renderApp();
    });
  });

  document.querySelectorAll('[data-active-slot]').forEach((element) => {
    element.addEventListener('click', () => {
      state.activeSlot = Number(element.dataset.activeSlot);
      renderApp();
    });
  });

  document.querySelectorAll('[data-slot-label]').forEach((element) => {
    element.addEventListener('change', () => {
      state.customLabels[element.dataset.slotLabel] = element.value.trim() || 'Field';
      renderApp();
    });
  });

  document.querySelectorAll('[data-mapping]').forEach((element) => {
    element.addEventListener('change', () => {
      markDirty();
      state.mappings[element.dataset.mapping] = element.value;
      renderApp();
    });
  });

  document.querySelectorAll('[data-format]').forEach((element) => {
    element.addEventListener('click', () => {
      markDirty();
      const slot = currentLayout().slots[state.activeSlot];
      const style = state.styles[slot.key];
      if (element.dataset.format === 'bold') style.weight = style.weight === 'bold' ? 'normal' : 'bold';
      if (element.dataset.format === 'italic') style.italic = !style.italic;
      if (element.dataset.format === 'increase') style.fontSize = Math.min(28, style.fontSize + 1);
      if (element.dataset.format === 'decrease') style.fontSize = Math.max(7, style.fontSize - 1);
      renderApp();
    });
  });

  document.querySelector('#data-input')?.addEventListener('input', (event) => {
    state.rawInput = event.target.value;
  });

  document.querySelector('[data-action="apply-data"]')?.addEventListener('click', () => {
    updateData(document.querySelector('#data-input').value);
    renderApp();
  });

  document.querySelector('[data-action="load-sample"]')?.addEventListener('click', () => {
    updateData(sampleTSV);
    renderApp();
  });

  document.querySelector('[data-action="download-pdf"]')?.addEventListener('click', async () => {
    if (!state.rows.length || state.busy) return;
    state.busy = true;
    renderApp();
    try {
      const bytes = await buildPdf();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `label-studio-${currentProfile().id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      state.lastDownload = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } finally {
      state.busy = false;
      renderApp();
    }
  });

  document.querySelector('[data-action="show-warnings"]')?.addEventListener('click', () => {
    const warnings = getWarnings();
    const first = warnings[0];
    if (!first) return;
    window.alert(`Long text to review:\n\nRow ${first.rowIndex + 1}: ${first.slot}\n“${first.value}”\n\nTry a smaller font size or a wider label stock.`);
  });
}

const wizardView = (() => {
const wizardSteps = ['stock', 'layout', 'data', 'mapping', 'review'];
const stepMeta = {
  stock: { number: '01', label: 'Sheet', title: 'Choose your sticker sheet', description: 'Select the product code printed on the packet. We already know the layout details.' },
  layout: { number: '02', label: 'Design', title: 'Choose how the label reads', description: 'Pick a ready-made hierarchy, then make small optional adjustments if you need them.' },
  data: { number: '03', label: 'Data', title: 'Paste your participant list', description: 'Copy the header row and participant rows from Excel or Sheets.' },
  mapping: { number: '04', label: 'Match', title: 'Match your columns', description: 'Tell each label field which spreadsheet column should fill it.' },
  review: { number: '05', label: 'Export', title: 'Check your sheet', description: 'Review the first A4 page, resolve any warnings, and download the print-ready PDF.' },
};

function renderProfileOptions() {
  return profiles.map((profile) => '<option value="' + profile.id + '"' + selected(profile.id, state.profileId) + '>' + profile.brand + ' · ' + profile.name.split(' · ')[1] + '</option>').join('');
}

function renderProfileSummary() {
  const profile = currentProfile();
  return '<div class="selection-summary"><div class="stock-icon"><span></span><span></span><span></span></div><div><strong>' + escapeHtml(profile.brand) + ' · ' + escapeHtml(profile.name.split(' · ')[0]) + '</strong><span>' + escapeHtml(profile.detail) + '</span></div><span class="summary-check">✓</span></div>';
}

function renderLayoutCards() {
  return layouts.map((layout) => {
    const active = layout.id === state.layoutId;
    const miniLines = layout.slots.map((slot) => '<i class="mini-line align-' + slot.align + '" style="--mini-size:' + Math.max(0.45, slot.fontSize / 15) + '"></i>').join('');
    return '<button class="layout-card ' + (active ? 'active' : '') + '" data-layout="' + layout.id + '" aria-pressed="' + active + '"><span class="layout-mini ' + layout.kind + '">' + miniLines + '</span><span class="layout-copy"><strong>' + escapeHtml(layout.name) + '</strong><small>' + escapeHtml(layout.detail) + '</small></span><span class="radio-dot"></span></button>';
  }).join('');
}

function renderDesignTuning() {
  const layout = currentLayout();
  const slot = layout.slots[state.activeSlot] || layout.slots[0];
  const style = state.styles[slot.key] || slot;
  const tabs = layout.slots.map((item, index) => '<button class="' + (index === state.activeSlot ? 'active' : '') + '" data-active-slot="' + index + '">' + escapeHtml(state.customLabels[item.key] || item.label) + '</button>').join('');
  return '<details class="optional-panel"><summary>Fine-tune this design <span>Optional</span></summary><div class="tuning-body"><div class="slot-tabs">' + tabs + '</div><label class="field-label">Field name<input class="slot-label-input" data-slot-label="' + slot.key + '" value="' + escapeHtml(state.customLabels[slot.key] || slot.label) + '" aria-label="Field name" /></label><div class="format-toolbar" aria-label="Text formatting"><span class="toolbar-caption">TYPE STYLE <span>· ' + escapeHtml(state.customLabels[slot.key] || slot.label) + '</span></span><div class="toolbar-actions"><button class="format-button ' + (style.weight === 'bold' ? 'pressed' : '') + '" data-format="bold"' + checked(style.weight === 'bold') + ' title="Bold">B</button><button class="format-button italic ' + (style.italic ? 'pressed' : '') + '" data-format="italic"' + checked(style.italic) + ' title="Italic">I</button><button class="format-button" data-format="decrease" title="Decrease font size">A<span>−</span></button><span class="font-readout">' + style.fontSize + ' pt</span><button class="format-button" data-format="increase" title="Increase font size">A<span>+</span></button></div></div></div></details>';
}

function renderA4Paper(rows = state.rows) {
  const profile = currentProfile();
  const layout = currentLayout();
  const capacity = profile.cols * profile.rows;
  const previewRows = rows.slice(0, capacity);
  while (previewRows.length < capacity) previewRows.push({});
  return '<div class="a4-paper" style="--cols:' + profile.cols + ';--rows:' + profile.rows + ';">' + previewRows.map((row, index) => renderPreviewLabel(row, layout, index, profile)).join('') + '</div>';
}

function renderPreview(options = {}) {
  const profile = currentProfile();
  const title = options.title || 'First page';
  const eyebrow = options.eyebrow || 'LIVE PREVIEW';
  const rows = options.rows || state.rows;
  const note = options.note || 'Printable label area';
  return '<section class="step-preview"><div class="preview-heading"><div><p class="eyebrow">' + eyebrow + '</p><h2>' + escapeHtml(title) + '</h2></div><span class="preview-count">' + profile.cols + ' × ' + profile.rows + '</span></div><div class="paper-stage">' + renderA4Paper(rows) + '</div><div class="preview-footer"><span><i class="legend-swatch"></i>' + escapeHtml(note) + '</span><span>A4 · ' + escapeHtml(profile.detail.split(' · ')[0]) + '</span></div></section>';
}

function renderPreviewLabel(row, layout, index, profile) {
  const values = layout.slots.map((slot) => ({ slot, value: getSlotValue(row, slot), style: state.styles[slot.key] || slot }));
  const isEmpty = values.every(({ value }) => !value);
  const column = index % profile.cols;
  const rowIndex = Math.floor(index / profile.cols);
  const edgeClass = (column === profile.cols - 1 ? ' last-col' : '') + (rowIndex === profile.rows - 1 ? ' last-row' : '');
  const text = values.map(({ slot, value, style }) => {
    const positionClass = layout.kind === 'triptych' ? ' triptych-' + (slot.position || style.align) : '';
    return '<span class="preview-text align-' + style.align + positionClass + '" style="font-size:' + Math.max(6, style.fontSize * 0.34) + 'px;font-weight:' + (style.weight === 'bold' ? 750 : 450) + ';font-style:' + (style.italic ? 'italic' : 'normal') + '">' + escapeHtml(value || ' ') + '</span>';
  }).join('');
  return '<div class="preview-label ' + (isEmpty ? 'empty ' : '') + layout.kind + edgeClass + '"><div class="label-content">' + text + '</div>' + (index === 0 && !isEmpty ? '<span class="preview-focus">1</span>' : '') + '</div>';
}

function renderSingleLabel(row = state.rows[0] || {}) {
  const layout = currentLayout();
  const text = layout.slots.map((slot) => {
    const style = state.styles[slot.key] || slot;
    const value = getSlotValue(row, slot);
    const positionClass = layout.kind === 'triptych' ? ' triptych-' + (slot.position || style.align) : '';
    return '<span class="preview-text align-' + style.align + positionClass + '" style="font-size:' + Math.max(12, style.fontSize * 0.82) + 'px;font-weight:' + (style.weight === 'bold' ? 750 : 450) + ';font-style:' + (style.italic ? 'italic' : 'normal') + '">' + escapeHtml(value || state.customLabels[slot.key] || slot.label) + '</span>';
  }).join('');
  return '<div class="single-label-wrap"><p class="eyebrow">ONE LABEL</p><div class="single-label ' + layout.kind + '"><div class="label-content">' + text + '</div></div><p class="preview-hint">This is the first participant as it will appear on every label.</p></div>';
}

function renderDataTable(parsed) {
  if (!parsed.headers.length) return '<div class="empty-data"><strong>No rows detected yet</strong><span>Paste a header row followed by participant details.</span></div>';
  const headers = parsed.headers.slice(0, 4);
  const rows = parsed.rows.slice(0, 3);
  const head = headers.map((header) => '<th>' + escapeHtml(header) + '</th>').join('');
  const body = rows.map((row) => '<tr>' + headers.map((header) => '<td>' + escapeHtml(row[header] || '—') + '</td>').join('') + '</tr>').join('');
  return '<div class="data-table-wrap"><div class="table-meta"><strong>' + formatCount(parsed.rows.length, 'row') + ' detected</strong><span>Showing first ' + Math.min(rows.length, 3) + '</span></div><table class="data-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
}

function renderMappingList() {
  const layout = currentLayout();
  return '<div class="mapping-list">' + layout.slots.map((slot, index) => '<div class="mapping-row"><div class="mapping-field"><span class="slot-number">0' + (index + 1) + '</span><strong>' + escapeHtml(state.customLabels[slot.key] || slot.label) + '</strong><small>Prints as ' + escapeHtml(state.customLabels[slot.key] || slot.label) + '</small></div><select class="column-select" data-mapping="' + slot.key + '" aria-label="Spreadsheet column for ' + escapeHtml(state.customLabels[slot.key] || slot.label) + '"><option value=""' + (!state.mappings[slot.key] ? ' selected' : '') + '>Choose a column</option>' + state.headers.map((header) => '<option value="' + escapeHtml(header) + '"' + selected(header, state.mappings[slot.key]) + '>' + escapeHtml(header) + '</option>').join('') + '</select></div>').join('') + '</div>';
}

function getMappingGaps() {
  return currentLayout().slots.filter((slot) => !state.mappings[slot.key] || !state.headers.includes(state.mappings[slot.key]));
}

function renderChecks() {
  const warnings = getWarnings();
  const mappingGaps = getMappingGaps();
  const profile = currentProfile();
  const pages = Math.max(1, Math.ceil(state.rows.length / (profile.cols * profile.rows)));
  const issueCount = warnings.length + mappingGaps.length;
  const details = state.warningOpen ? '<div class="warning-detail-panel">' + warnings.slice(0, 8).map((warning) => '<div><strong>Row ' + (warning.rowIndex + 1) + ' · ' + escapeHtml(warning.slot) + '</strong><span>' + escapeHtml(warning.value) + '</span></div>').join('') + '</div>' : '';
  return '<div class="checks-card"><div class="checks-head"><span class="eyebrow">PRE-FLIGHT</span><span class="check-count">' + (issueCount ? issueCount + ' item' + (issueCount === 1 ? '' : 's') + ' to review' : 'All clear') + '</span></div><div class="check-line ' + (state.rows.length > 0 ? 'good' : 'bad') + '"><span class="check-icon">' + (state.rows.length > 0 ? '✓' : '!') + '</span><span>' + (state.rows.length > 0 ? state.rows.length + ' participant rows ready' : 'No participant rows yet') + '</span></div>' + (mappingGaps.length ? '<div class="check-line bad"><span class="check-icon">!</span><span>' + mappingGaps.length + ' field' + (mappingGaps.length === 1 ? '' : 's') + ' still need a source column</span></div>' : '<div class="check-line good"><span class="check-icon">✓</span><span>Every label field has a source column</span></div>') + '<div class="check-line good"><span class="check-icon">✓</span><span>' + pages + ' ' + (pages === 1 ? 'A4 page' : 'A4 pages') + ' · ' + profile.cols * profile.rows + ' labels per page</span></div>' + (warnings.length ? '<div class="warning-list"><div class="check-line warning"><span class="check-icon">!</span><span>' + warnings.length + ' text field' + (warnings.length === 1 ? ' may' : 's may') + ' run long</span></div><button class="warning-detail" data-action="show-warnings">' + (state.warningOpen ? 'Hide long-text details' : 'Review long-text details') + ' ↗</button></div>' + details : '<div class="check-line good"><span class="check-icon">✓</span><span>Text fits the current label size</span></div>') + '</div>';
}

function renderStepHeading(step) {
  const meta = stepMeta[step];
  return '<div class="step-heading"><p class="eyebrow">STEP ' + meta.number + ' OF 05 · ' + meta.label.toUpperCase() + '</p><h1>' + meta.title + '</h1><p>' + meta.description + '</p></div>';
}

function renderFooter(step, primaryLabel, disabled = false) {
  const index = wizardSteps.indexOf(step);
  const previous = wizardSteps[index - 1];
  const progress = wizardSteps.map((item, itemIndex) => '<span class="progress-dot ' + (itemIndex < index ? 'complete ' : '') + (item === step ? 'current' : '') + '" title="' + stepMeta[item].label + '"></span>').join('');
  return '<footer class="wizard-footer"><div class="wizard-footer-inner">' + (previous ? '<button class="footer-back" data-page="' + previous + '">← Back</button>' : '<span class="footer-back-placeholder"></span>') + '<div class="footer-progress" aria-label="Step ' + (index + 1) + ' of ' + wizardSteps.length + '"><div>' + progress + '</div><span>Step ' + (index + 1) + ' of ' + wizardSteps.length + ' · ' + stepMeta[step].label + '</span></div><div class="footer-tools">' + (state.installPrompt ? '<button class="footer-link" data-action="install-app">Install app</button>' : '') + '<button class="footer-link" data-page="guide">Print guide</button><button class="footer-link" data-page="privacy">Privacy</button><button class="theme-button" data-action="toggle-theme" aria-label="Switch to ' + (state.theme === 'dark' ? 'light' : 'dark') + ' mode">' + (state.theme === 'dark' ? '☼ Light' : '☾ Dark') + '</button></div><button class="footer-primary" data-action="' + (step === 'review' ? 'download-pdf' : 'next-step') + '"' + (disabled ? ' disabled' : '') + '>' + (state.busy && step === 'review' ? 'Building PDF…' : primaryLabel) + '<span>→</span></button></div></footer>';
}

function renderStockStep() {
  const profile = currentProfile();
  return '<main class="wizard-page"><div class="wizard-content step-layout"><section class="step-control">' + renderStepHeading('stock') + '<div class="control-card"><label class="field-label" for="profile-select">Sticker product</label><select id="profile-select" class="profile-select">' + renderProfileOptions() + '</select>' + renderProfileSummary() + '</div><div class="trust-note"><span>⌁</span><div><strong>Sheet geometry is handled for you</strong><p>No margin, gap, or corner measurements needed.</p></div></div></section>' + renderPreview({ title: profile.brand + ' · ' + profile.name.split(' · ')[0], eyebrow: 'WHAT YOU WILL PRINT', note: 'Sheet alignment preview', rows: state.rows }) + '</div>' + renderFooter('stock', 'Use this sheet') + '</main>';
}

function renderLayoutStep() {
  return '<main class="wizard-page"><div class="wizard-content step-layout"><section class="step-control">' + renderStepHeading('layout') + '<p class="preview-disclaimer">The sample content is only a preview. You’ll choose the real spreadsheet columns on Step 4.</p><div class="control-card layout-picker"><div class="control-card-heading"><strong>Ready-made patterns</strong><span>Choose one</span></div><div class="layout-grid">' + renderLayoutCards() + '</div></div>' + renderDesignTuning() + '</section><section class="step-preview design-preview"><div class="preview-heading"><div><p class="eyebrow">DESIGN PREVIEW</p><h2>Your label hierarchy</h2></div><span class="preview-count">Sample</span></div>' + renderSingleLabel(state.rows[0] || {}) + '<div class="preview-note"><strong>' + escapeHtml(currentLayout().name) + '</strong><span>' + escapeHtml(currentLayout().detail) + '</span></div></section></div>' + renderFooter('layout', 'Use this design') + '</main>';
}

function renderDataStep() {
  const draft = parsePastedData(state.rawInput);
  return '<main class="wizard-page"><div class="wizard-content step-layout"><section class="step-control">' + renderStepHeading('data') + '<p class="preview-disclaimer">The sample content is only a preview. You’ll choose the real spreadsheet columns on Step 4.</p><div class="control-card data-card"><label class="field-label" for="data-input">Spreadsheet rows</label><textarea id="data-input" class="data-input" spellcheck="false" aria-label="Paste participant spreadsheet data">' + escapeHtml(state.rawInput) + '</textarea><div class="data-actions"><button class="text-button" data-action="load-sample">↺ Load sample data</button><span>Tab-separated works best</span></div></div><div class="privacy-inline"><span>Local only</span><p>Rows are held in this browser tab and used to create the PDF on this device.</p></div></section><section class="step-preview data-preview"><div class="preview-heading"><div><p class="eyebrow">DATA CHECK</p><h2>What we found</h2></div><span class="preview-count">' + formatCount(draft.rows.length, 'row') + '</span></div>' + renderDataTable(draft) + '</section></div>' + renderFooter('data', 'Use these rows', draft.rows.length === 0) + '</main>';
}

function renderMappingStep() {
  const gaps = getMappingGaps();
  return '<main class="wizard-page"><div class="wizard-content step-layout"><section class="step-control">' + renderStepHeading('mapping') + '<div class="control-card mapping-card"><div class="control-card-heading"><strong>Label fields</strong><span>' + (gaps.length ? gaps.length + ' to match' : 'All matched') + '</span></div>' + renderMappingList() + '</div><div class="mapping-tip"><strong>Tip</strong><span>We matched familiar headers automatically. Change any source that looks wrong.</span></div></section><section class="step-preview mapping-preview"><div class="preview-heading"><div><p class="eyebrow">LIVE LABEL</p><h2>First participant</h2></div><span class="preview-count">' + (state.rows[0] ? 'Row 1' : 'No row') + '</span></div>' + renderSingleLabel(state.rows[0] || {}) + '<div class="preview-note"><strong>Every label uses this same structure</strong><span>Only the participant values change.</span></div></section></div>' + renderFooter('mapping', 'Review my sheet', gaps.length > 0 || state.rows.length === 0) + '</main>';
}

function renderReviewStep() {
  const gaps = getMappingGaps();
  const blocked = gaps.length > 0 || state.rows.length === 0 || state.busy;
  return '<main class="wizard-page"><div class="wizard-content step-layout review-layout">' + renderPreview({ title: 'First page · ' + currentProfile().name, eyebrow: 'FINAL A4 PREVIEW', note: currentProfile().cols * currentProfile().rows + ' printable positions', rows: state.rows }) + '<section class="step-control review-control">' + renderStepHeading('review') + renderChecks() + '<div class="print-settings"><span>Print setting</span><strong>100% · Actual Size</strong></div>' + (state.lastDownload ? '<div class="download-success"><span>✓</span><div><strong>PDF downloaded</strong><span>Before using sticker stock, test one page on plain A4 paper.</span></div></div>' : '<p class="review-note">Check the first page against a plain sheet before loading sticker stock.</p>') + '</section></div>' + renderFooter('review', state.lastDownload ? 'Download again' : 'Download A4 PDF', blocked) + '</main>';
}

function renderWizard(step) {
  ensureLayoutState();
  if (step === 'stock') return renderStockStep();
  if (step === 'layout') return renderLayoutStep();
  if (step === 'data') return renderDataStep();
  if (step === 'mapping') return renderMappingStep();
  return renderReviewStep();
}

function renderGuide() {
  return '<main class="support-page"><div class="support-content"><button class="support-back" data-page="review">← Back to sheet</button><div class="support-heading"><p class="eyebrow">PRINT GUIDE</p><h1>One quick test saves a sheet.</h1><p>Use ordinary A4 paper first. The test catches printer scaling before you spend a sticker sheet.</p></div><div class="guide-list"><article><span>01</span><div><h2>Print at Actual Size</h2><p>Choose A4 and 100% / Actual Size. Do not use Fit, Shrink, or Scale to Printable Area.</p></div></article><article><span>02</span><div><h2>Lay it over the stock</h2><p>Hold the plain-paper test behind the sticker sheet against a bright window. Text should sit inside each label.</p></div></article><article><span>03</span><div><h2>Then use sticker stock</h2><p>Feed one sheet at a time and use the manual or multipurpose tray when available.</p></div></article><article class="warning-card"><span>!</span><div><h2>If it is shifted</h2><p>Check that scaling is still 100%. A small consistent offset belongs in the printer driver or manufacturer settings.</p></div></article></div></div>' + renderSupportFooter() + '</main>';
}

function renderPrivacy() {
  return '<main class="support-page"><div class="support-content"><button class="support-back" data-page="review">← Back to sheet</button><div class="support-heading"><p class="eyebrow">PRIVACY</p><h1>Your participant list stays with you.</h1><p>This tool is designed for small offices handling event information that should not become another cloud database.</p></div><div class="privacy-list"><article><span>⌁</span><div><h2>Local processing</h2><p>Pasted data stays in this browser tab. The PDF is assembled on this device and downloaded directly to you.</p></div></article><article><span>□</span><div><h2>No account or upload</h2><p>No sign-in, participant database, file upload, or shared workspace is needed.</p></div></article><article><span>↯</span><div><h2>Memory-only prototype</h2><p>Closing or refreshing this tab clears the working data.</p></div></article></div></div>' + renderSupportFooter() + '</main>';
}

function renderSupportFooter() {
  return '<footer class="support-footer"><button class="footer-link" data-page="review">Back to export</button><button class="theme-button" data-action="toggle-theme" aria-label="Switch to ' + (state.theme === 'dark' ? 'light' : 'dark') + ' mode">' + (state.theme === 'dark' ? '☼ Light' : '☾ Dark') + '</button></footer>';
}

function renderApp() {
  document.documentElement.dataset.theme = state.theme;
  const view = wizardSteps.includes(state.page) ? renderWizard(state.page) : state.page === 'guide' ? renderGuide() : renderPrivacy();
  app.innerHTML = view;
  bindEvents();
}

function updateData(input) {
  const parsed = parsePastedData(input);
  markDirty();
  state.rawInput = input;
  state.headers = parsed.headers;
  state.rows = parsed.rows;
  Object.keys(state.mappings).forEach((key) => {
    if (!state.headers.includes(state.mappings[key])) state.mappings[key] = '';
  });
  ensureLayoutState();
}

function selectPage(page) {
  const nextPage = page === 'studio' ? 'stock' : page;
  state.page = nextPage;
  window.location.hash = nextPage;
  renderApp();
}

async function downloadPdf() {
  if (!state.rows.length || getMappingGaps().length || state.busy) return;
  state.busy = true;
  renderApp();
  try {
    const bytes = await buildPdf();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'label-studio-' + currentProfile().id + '.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    state.lastDownload = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } finally {
    state.busy = false;
    renderApp();
  }
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      selectPage(element.dataset.page);
    });
  });
  document.querySelector('[data-action="toggle-theme"]')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    renderApp();
  });
  document.querySelector('[data-action="install-app"]')?.addEventListener('click', async () => {
    if (!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt = null;
    renderApp();
  });
  document.querySelector('#profile-select')?.addEventListener('change', (event) => {
    markDirty();
    state.profileId = event.target.value;
    renderApp();
  });
  document.querySelectorAll('[data-layout]').forEach((element) => {
    element.addEventListener('click', () => {
      markDirty();
      state.layoutId = element.dataset.layout;
      state.activeSlot = 0;
      ensureLayoutState();
      renderApp();
    });
  });
  document.querySelectorAll('[data-active-slot]').forEach((element) => {
    element.addEventListener('click', () => {
      state.activeSlot = Number(element.dataset.activeSlot);
      renderApp();
    });
  });
  document.querySelectorAll('[data-slot-label]').forEach((element) => {
    element.addEventListener('change', () => {
      state.customLabels[element.dataset.slotLabel] = element.value.trim() || 'Field';
      renderApp();
    });
  });
  document.querySelectorAll('[data-mapping]').forEach((element) => {
    element.addEventListener('change', () => {
      markDirty();
      state.mappings[element.dataset.mapping] = element.value;
      renderApp();
    });
  });
  document.querySelectorAll('[data-format]').forEach((element) => {
    element.addEventListener('click', () => {
      markDirty();
      const slot = currentLayout().slots[state.activeSlot];
      const style = state.styles[slot.key];
      if (element.dataset.format === 'bold') style.weight = style.weight === 'bold' ? 'normal' : 'bold';
      if (element.dataset.format === 'italic') style.italic = !style.italic;
      if (element.dataset.format === 'increase') style.fontSize = Math.min(28, style.fontSize + 1);
      if (element.dataset.format === 'decrease') style.fontSize = Math.max(7, style.fontSize - 1);
      renderApp();
    });
  });
  document.querySelector('#data-input')?.addEventListener('input', (event) => {
    state.rawInput = event.target.value;
  });
  document.querySelector('[data-action="load-sample"]')?.addEventListener('click', () => {
    state.rawInput = sampleTSV;
    renderApp();
  });
  document.querySelector('[data-action="next-step"]')?.addEventListener('click', () => {
    const step = state.page;
    if (step === 'data') updateData(document.querySelector('#data-input').value);
    const next = wizardSteps[wizardSteps.indexOf(step) + 1];
    if (next) selectPage(next);
  });
  document.querySelector('[data-action="download-pdf"]')?.addEventListener('click', downloadPdf);
  document.querySelector('[data-action="show-warnings"]')?.addEventListener('click', () => {
    state.warningOpen = !state.warningOpen;
    renderApp();
  });
}

return { renderApp, steps: wizardSteps };
})();
const wizardSteps = wizardView.steps;

function fontForStyle(fonts, style) {
  if (style.weight === 'bold' && style.italic) return fonts.boldItalic;
  if (style.weight === 'bold') return fonts.bold;
  if (style.italic) return fonts.italic;
  return fonts.normal;
}

function fitFontSize(text, font, preferredSize, maxWidth) {
  let size = preferredSize;
  while (size > 7 && font.widthOfTextAtSize(text, size) > maxWidth) size -= 0.5;
  return size;
}

function drawCenteredRows(page, record, layout, profile, fonts, topMm, leftMm) {
  const labelW = profile.labelW * MM_TO_PT;
  const labelH = profile.labelH * MM_TO_PT;
  const padding = Math.min(14, profile.labelW * MM_TO_PT * 0.07);
  const values = layout.slots.map((slot) => {
    const style = state.styles[slot.key] ?? slot;
    const text = getSlotValue(record, slot);
    const font = fontForStyle(fonts, style);
    const size = fitFontSize(text, font, style.fontSize, labelW - padding * 2);
    return { text, font, size, style };
  });
  const lineGap = Math.max(2, labelH * 0.035);
  const lineHeights = values.map(({ font, size }) => font.heightAtSize(size) * 0.96);
  const totalHeight = lineHeights.reduce((sum, height) => sum + height, 0) + lineGap * Math.max(0, values.length - 1);
  let cursor = page.getHeight() - (topMm + profile.labelH) * MM_TO_PT + (labelH + totalHeight) / 2;
  values.forEach(({ text, font, size, style }, index) => {
    const width = font.widthOfTextAtSize(text, size);
    const x = (leftMm * MM_TO_PT) + (labelW - width) / 2;
    cursor -= lineHeights[index];
    if (text) page.drawText(text, { x, y: cursor, size, font, color: rgb(0.08, 0.12, 0.2) });
    cursor -= lineGap;
  });
}

function drawTriptych(page, record, layout, profile, fonts, topMm, leftMm) {
  const labelW = profile.labelW * MM_TO_PT;
  const labelH = profile.labelH * MM_TO_PT;
  const padding = Math.min(12, labelW * 0.06);
  layout.slots.forEach((slot) => {
    const style = state.styles[slot.key] ?? slot;
    const text = getSlotValue(record, slot);
    const font = fontForStyle(fonts, style);
    const size = fitFontSize(text, font, style.fontSize, labelW - padding * 2);
    const width = font.widthOfTextAtSize(text, size);
    const align = style.align || slot.align;
    const position = slot.position || (align === 'center' ? 'center' : align === 'left' ? 'top-left' : 'top-right');
    const x = align === 'left' ? leftMm * MM_TO_PT + padding : align === 'right' ? leftMm * MM_TO_PT + labelW - padding - width : leftMm * MM_TO_PT + (labelW - width) / 2;
    const y = position === 'center'
      ? page.getHeight() - (topMm + profile.labelH / 2) * MM_TO_PT - font.heightAtSize(size) * 0.35
      : page.getHeight() - (topMm + 7) * MM_TO_PT;
    if (text) page.drawText(text, { x, y, size, font, color: rgb(0.08, 0.12, 0.2) });
  });
}

async function buildPdf() {
  const pdf = await PDFDocument.create();
  const fonts = {
    normal: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  };
  const profile = currentProfile();
  const layout = currentLayout();
  const perPage = profile.cols * profile.rows;
  const pageCount = Math.max(1, Math.ceil(state.rows.length / perPage));
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdf.addPage([A4.width * MM_TO_PT, A4.height * MM_TO_PT]);
    const pageRows = state.rows.slice(pageIndex * perPage, (pageIndex + 1) * perPage);
    pageRows.forEach((record, index) => {
      const row = Math.floor(index / profile.cols);
      const column = index % profile.cols;
      const leftMm = profile.marginX + column * (profile.labelW + profile.gapX);
      const topMm = profile.marginY + row * (profile.labelH + profile.gapY);
      if (layout.kind === 'triptych') drawTriptych(page, record, layout, profile, fonts, topMm, leftMm);
      else drawCenteredRows(page, record, layout, profile, fonts, topMm, leftMm);
    });
  }
  return pdf.save();
}

window.addEventListener('hashchange', () => {
  const page = window.location.hash.replace('#', '');
  const nextPage = page === 'studio' ? 'stock' : page;
  if ([...wizardSteps, 'guide', 'privacy'].includes(nextPage) && nextPage !== state.page) {
    state.page = nextPage;
    renderApp();
  }
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  state.installPrompt = event;
  renderApp();
});

window.addEventListener('appinstalled', () => {
  state.installPrompt = null;
  renderApp();
});

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}

const initialPage = window.location.hash.replace('#', '');
const initialRoute = initialPage === 'studio' ? 'stock' : initialPage;
if ([...wizardSteps, 'guide', 'privacy'].includes(initialRoute)) state.page = initialRoute;
ensureLayoutState();
renderApp();
