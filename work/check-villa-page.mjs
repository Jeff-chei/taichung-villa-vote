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
assert.equal((html.match(/paid: false/g) || []).length, 11, 'all 11 members must initially be marked unpaid');
console.log('villa page result and payment-progress checks passed');
