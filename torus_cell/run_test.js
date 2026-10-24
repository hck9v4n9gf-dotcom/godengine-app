const T=require('./torus_cell.js'),fs=require('fs');
const out=[];for(const sd of T.PREREG.seeds){const c=T.run(sd,true),k=T.run(sd,false);const s=T.summarize(c,k);out.push(s);
 fs.writeFileSync(`series_seed${sd}.json`,JSON.stringify({cell:c.series,control:k.series}));}
const passN=out.filter(s=>s.verdict.pass).length,p1=out.filter(s=>s.verdict.P1).length,p2=out.filter(s=>s.verdict.P2).length;
const res={prereg:T.PREREG.id,module:T.VERSION,seeds:out,tally:{P1:p1,P2:p2,both:passN,need:7,of:8},OVERALL:passN>=7?'PASS':'FAIL'};
res.results_sha256=T.sha256(JSON.stringify(T.round6(out.map(s=>s.sha256))));
fs.writeFileSync('RESULTS_P4N-TORUS-CELL-V01.json',JSON.stringify(res,null,1));
const r=x=>x===null?'—':(+x).toFixed(3);
console.log('seed | CELL hl F_end R Ψmean Ψ+held rec sparks | CTRL hl F_end R Ψmean rec | ratio P1 P2 | sha');
for(const s of out){const c=s.cell,k=s.control;console.log([s.seed,'|',c.halfLife+(c.halfLifeCensored?'+':''),r(c.F_end),r(c.RcutMean),r(c.psiCutMean),c.psiPosHeldLongestTicks,r(c.recoveryMean),c.sparks,'|',k.halfLife+(k.halfLifeCensored?'+':''),r(k.F_end),r(k.RcutMean),r(k.psiCutMean),r(k.recoveryMean),'|',r(s.verdict.ratio),s.verdict.P1,s.verdict.P2,'|',s.sha256.slice(0,12)].join(' '))}
console.log(JSON.stringify(res.tally),res.OVERALL,res.results_sha256);
