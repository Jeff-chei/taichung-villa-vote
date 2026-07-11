const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Votes';
const VILLA_IDS = new Set([
  'starry-night', 'natural-life', 'little-cat-b', 'little-cat-a', 'backyard', 'shanbao'
]);

function doGet(event) {
  if ((event.parameter.action || '') !== 'results') {
    return jsonp_(event, { ok: false, error: 'Unsupported action.' });
  }

  return jsonp_(event, { ok: true, totals: readTotals_() });
}

function doPost(event) {
  const action = (event.parameter.action || '').trim();
  const villaId = (event.parameter.villaId || '').trim();
  const clientId = (event.parameter.clientId || '').trim();

  if (!/^[a-zA-Z0-9-]{12,64}$/.test(clientId) || (action === 'vote' && !VILLA_IDS.has(villaId)) || !['vote', 'clear'].includes(action)) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Invalid vote.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const sheet = getSheet_();
    sheet.appendRow([new Date(), action === 'clear' ? '' : villaId, clientId]);
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  if (SPREADSHEET_ID === 'PASTE_YOUR_SPREADSHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID before deploying.');
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Villa ID', 'Client ID']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readTotals_() {
  const values = getSheet_().getDataRange().getValues().slice(1);
  const latestVotes = new Map();
  values.forEach((row) => {
    const villaId = String(row[1] || '');
    const clientId = String(row[2] || '');
    if (clientId) latestVotes.set(clientId, VILLA_IDS.has(villaId) ? villaId : '');
  });

  const totals = {};
  VILLA_IDS.forEach((villaId) => { totals[villaId] = 0; });
  latestVotes.forEach((villaId) => { if (VILLA_IDS.has(villaId)) totals[villaId] += 1; });
  return totals;
}

function jsonp_(event, payload) {
  const callback = event.parameter.callback || 'callback';
  if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback.').setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput(`${callback}(${JSON.stringify(payload)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
