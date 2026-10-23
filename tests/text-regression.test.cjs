const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,process.env.NEON_TEST_SOURCE || '../index.html'),'utf8');
const rain=source.match(/metrics.textContent=coins[^;]+;/)[0];
const history=source.match(/stats.textContent=entry.points[^;]+;/)[0];
for(const n of [0,1,2]){
 test(`rain summary agrees for ${n} coin(s)`,()=>{
  const ctx={metrics:{},coins:n,rainContacts:0,rainWetSeconds:0};
  vm.runInNewContext(rain,ctx);
  assert.ok(ctx.metrics.textContent.startsWith(n+(n===1?' moeda coletada · ':' moedas coletadas · ')));
 });
 test(`saved history agrees for ${n} coin(s)`,()=>{
  const ctx={stats:{},entry:{points:711,coins:n,combo:0,time:38,mode:'rapid',stages:1}};
  vm.runInNewContext(history,ctx);
  assert.ok(ctx.stats.textContent.includes(' · '+n+(n===1?' moeda · ':' moedas · ')));
 });
}
