import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('outputs/taichung-villa-vote.html', 'utf8');
const index = await readFile('outputs/index.html', 'utf8');
const appsScript = await readFile('google-apps-script/Code.gs', 'utf8');

assert.ok(index.includes('taichung-villa-vote.html'), 'index page must direct visitors to the voting page');

const scriptStart = html.indexOf('<script>') + '<script>'.length;
const scriptEnd = html.lastIndexOf('</script>');
assert.ok(scriptStart >= '<script>'.length && scriptEnd > scriptStart, 'inline script must exist');
new Function(html.slice(scriptStart, scriptEnd));

for (const text of ['starry-night', 'natural-life', 'little-cat-b', 'backyard', 'shanbao']) {
  assert.ok(html.includes(text), `missing villa data: ${text}`);
}

assert.ok(html.includes("name:'后里 Backyard（已被訂走）'"), 'Houli Backyard must be marked as booked');
assert.ok(html.includes("newYear:'$42,000'"), 'Shanbao must show the updated 42000 price');
assert.ok(html.includes("'德州撲克'"), 'Shanbao must include Texas poker as a facility tag');

for (const text of ['localStorage', 'VOTE_API_URL', 'loadRemoteResults', 'submitRemoteVote', 'voter-name', 'villa-choice', 'voted-list', 'pending-list']) {
  assert.ok(html.includes(text), `missing shared-vote frontend component: ${text}`);
}

for (const name of ['哥布林', '小埋', '傑哥', '企鵝', '白白', 'CH', '黑熊', '叫我', '雪糕', 'yuuu', '久保']) {
  assert.ok(html.includes(name), `missing roster member: ${name}`);
  assert.ok(appsScript.includes(name), `Apps Script roster missing member: ${name}`);
}

for (const text of ['votedNames', 'villaIds', 'selectedVillaIds', '多選']) {
  assert.ok(html.includes(text), `missing named multi-select frontend component: ${text}`);
}

assert.ok(
  html.includes("const VOTE_API_URL = 'https://script.google.com/macros/s/AKfycbxr2mL4AwK2Fd3ifaY4NgxpGq7PjYFZ56PLfEq3GYfcYk-j2ThJA-mqah2nQpk8WAQT/exec';"),
  'shared voting must point at the deployed Apps Script endpoint'
);

for (const text of ['function doGet', 'function doPost', 'SPREADSHEET_ID', 'ROSTER', 'NamedVotes', 'votedNames', 'villaIds']) {
  assert.ok(appsScript.includes(text), `missing Apps Script backend component: ${text}`);
}

console.log('villa page named multi-select vote checks passed');
