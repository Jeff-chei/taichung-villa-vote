import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('outputs/taichung-villa-vote.html', 'utf8');
const index = await readFile('outputs/index.html', 'utf8');
const appsScript = await readFile('google-apps-script/Code.gs', 'utf8');

assert.ok(index.includes('taichung-villa-vote.html'), 'index page must direct visitors to the voting page');

for (const text of ['starry-night', 'natural-life', 'little-cat-b', 'backyard', 'shanbao']) {
  assert.ok(html.includes(text), `missing villa data: ${text}`);
}

for (const text of ['localStorage', 'VOTE_API_URL', 'loadRemoteResults', 'submitRemoteVote']) {
  assert.ok(html.includes(text), `missing shared-vote frontend component: ${text}`);
}

assert.ok(
  html.includes("const VOTE_API_URL = 'https://script.google.com/macros/s/AKfycbxr2mL4AwK2Fd3ifaY4NgxpGq7PjYFZ56PLfEq3GYfcYk-j2ThJA-mqah2nQpk8WAQT/exec';"),
  'shared voting must point at the deployed Apps Script endpoint'
);

for (const text of ['function doGet', 'function doPost', 'SPREADSHEET_ID', 'clientId']) {
  assert.ok(appsScript.includes(text), `missing Apps Script backend component: ${text}`);
}

console.log('villa page shared-vote checks passed');
