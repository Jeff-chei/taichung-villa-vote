import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('outputs/taichung-villa-vote.html', 'utf8');
const index = await readFile('outputs/index.html', 'utf8');
assert.ok(index.includes('taichung-villa-vote.html'), 'index page must direct visitors to the villa page');

const scriptStart = html.indexOf('<script>') + '<script>'.length;
const scriptEnd = html.lastIndexOf('</script>');
assert.ok(scriptStart >= '<script>'.length && scriptEnd > scriptStart, 'inline script must exist');
new Function(html.slice(scriptStart, scriptEnd));

for (const text of ['starry-night', 'natural-life', 'little-cat-b', 'backyard', 'shanbao']) assert.ok(html.includes(text), `missing villa data: ${text}`);
for (const text of ['投票已截止', '當選民宿', '大雪星空 Starry Night', '匯款進度', '已匯 0／11 人', '累計 $0', '$3,000']) assert.ok(html.includes(text), `missing final-result component: ${text}`);
for (const name of ['哥布林', '小埋', '傑哥', '企鵝', '白白', 'CH', '黑熊', '叫我', '雪糕', 'yuuu', '久保']) assert.ok(html.includes(name), `missing roster member: ${name}`);
for (const text of ['VOTE_API_URL', 'loadRemoteResults', 'submitRemoteVote', 'voter-name', 'villa-choice', 'submit-vote', 'copy-vote', 'reset-vote']) assert.ok(!html.includes(text), `closed page must not include voting component: ${text}`);
assert.ok(html.includes("name:'后里 Backyard（已被訂走）'"), 'Houli Backyard must remain marked as booked');
assert.ok(html.includes("price:'跨年 $42,000'"), 'Shanbao must keep the updated price');
assert.ok(html.includes("'德州撲克'"), 'Shanbao must include Texas poker');
assert.match(html, /grid-template-columns:\s*minmax\(0,\s*4fr\)\s+minmax\(/, 'desktop layout must use a 4:1 grid');
assert.match(html, /@media\s*\(max-width:\s*1040px\)[\s\S]*grid-template-columns:\s*1fr/, 'narrow screens must stack into one column');
assert.ok(html.includes("{ name: '白白', paid: true }"), '白白 must be recorded as paid');
assert.ok(html.includes("{ name: '叫我', paid: true }"), '叫我 must be recorded as paid');
assert.ok(html.includes("{ name: '黑熊', amount: 6000, paid: true }"), '黑熊 must be recorded as paid 6000');
for (const text of ["{ name: '哥布林', note: '小埋墊', paid: true }", "{ name: '企鵝', note: '小埋墊', paid: true }", "{ name: '傑哥', note: '叫我墊', paid: true }", "{ name: '久保', note: '叫我墊', paid: true }"]) {
  assert.ok(html.includes(text), `missing payment note: ${text}`);
}
assert.ok(html.includes('payer-note'), 'payment notes must render below the payer name');
for (const name of ['小埋', '白白', 'CH', '叫我', '雪糕', 'yuuu']) {
  assert.ok(html.includes(`{ name: '${name}', paid: true }`), `${name} must be recorded as paid`);
}
assert.equal((html.match(/paid: true/g) || []).length, 11, 'all eleven members must be marked paid');
assert.equal((html.match(/paid: false/g) || []).length, 0, 'no members may remain unpaid');
assert.ok(html.includes('paid.reduce((total,person)=>total+amountFor(person),0)'), 'summary must total actual paid amounts');
for (const text of ['rank:1, votes:9', 'rank:2, votes:5', 'rank:3, votes:4', 'rank:4, votes:4', 'rank:5, votes:3', 'rank:6, votes:1', '第 ${villa.rank} 名 · ${villa.votes} 票']) {
  assert.ok(html.includes(text), `missing vote ranking: ${text}`);
}
console.log('villa page result and payment-progress checks passed');
