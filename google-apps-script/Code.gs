const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'NamedVotes';
const VILLA_IDS = new Set([
  'starry-night', 'natural-life', 'little-cat-b', 'little-cat-a', 'backyard', 'shanbao'
]);
const ROSTER = new Set([
  '哥布林', '小埋', '傑哥', '企鵝', '白白', 'CH', '黑熊', '叫我', '雪糕', 'yuuu', '久保'
]);

function doGet(event) {
  if ((event.parameter.action || '') !== 'results') {
    return jsonp_(event, { ok: false, error: 'Unsupported action.' });
  }

  return jsonp_(event, { ok: true, ...readResults_() });
}

function doPost(event) {
  const action = String(event.parameter.action || '').trim();
  const name = String(event.parameter.name || '').trim();
  const villaIds = action === 'clear' ? [] : parseVillaIds_(event.parameter.villaIds);

  if (!['vote', 'clear'].includes(action) || !ROSTER.has(name) || (action === 'vote' && villaIds.length === 0)) {
    return json_({ ok: false, error: 'Invalid named vote.' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    getSheet_().appendRow([new Date(), name, JSON.stringify(villaIds)]);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

function getSheet_() {
  if (SPREADSHEET_ID === 'PASTE_YOUR_SPREADSHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID before deploying.');
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Villa IDs']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function parseVillaIds_(rawVillaIds) {
  try {
    const values = JSON.parse(rawVillaIds || '[]');
    if (!Array.isArray(values)) return [];
    return [...new Set(values.map(String).filter((villaId) => VILLA_IDS.has(villaId)))];
  } catch (error) {
    return [];
  }
}

function readResults_() {
  const latestSelections = new Map();
  const values = getSheet_().getDataRange().getValues().slice(1);

  values.forEach((row) => {
    const name = String(row[1] || '').trim();
    if (!ROSTER.has(name)) return;
    latestSelections.set(name, parseVillaIds_(row[2]));
  });

  const totals = {};
  VILLA_IDS.forEach((villaId) => { totals[villaId] = 0; });
  const votedNames = [];
  latestSelections.forEach((villaIds, name) => {
    if (villaIds.length === 0) return;
    votedNames.push(name);
    villaIds.forEach((villaId) => { totals[villaId] += 1; });
  });

  return {
    totals,
    votedNames: [...ROSTER].filter((name) => votedNames.includes(name))
  };
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(event, payload) {
  const callback = event.parameter.callback || 'callback';
  if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback.').setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput(`${callback}(${JSON.stringify(payload)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
