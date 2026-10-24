const T=require('./torus_cell2.js'),fs=require('fs');
const P=T.PREREG,out={prereg:P.id,module:T.VERSION,atlantisTicks:T.atlantisTicks(),atlantisCycles:T.atlantis()};
const mainRows=[],series={};
for(const sd of P.seeds){const r={};for(const k of ['A','B','C','E','F','Alt'])r[k]=T.run(sd,T.ARMS[k]);
 const v=T.verdict(r.A,r.C),vB=T.verdict(r.B,r.C),vE=T.verdict(r.E,r.C),vAlt=T.verdict(r.Alt,r.C);
 series[sd]={A:r.A.series,B:r.B.series,C:r.C.series};
 mainRows.push(T.seal({seed:sd,A:T.strip(r.A),B:T.strip(r.B),C:T.strip(r.C),E:T.strip(r.E),F:T.strip(r.F),Alt:T.strip(r.Alt),verdict:v,B_holds:vB.pass,E_holds:vE.pass,Alt_holds:vAlt.pass,synergyDelta:r.A.survival-r.F.survival,recyclingDelta:r.A.survival-r.E.survival}))}
const passN=mainRows.filter(x=>x.verdict.pass).length,bHold=mainRows.filter(x=>x.B_holds).length,cHold=mainRows.filter(x=>x.C.survival>=1.5*out.atlantisTicks).length;
out.main={rows:mainRows,passN,need:7,OVERALL:passN>=7?'PASS':'FAIL'};
out.predictionB={B_holds_in:bHold,canon_prediction_confirmed:bHold<=1,note:'confirmed iff B fails in >=7/8'};
out.negativeControl={C_survives_past_1p5xAtlantis_in:cHold,passed:(8-cHold)>=7};
// recovering-coordinate sweep
const sw=[];for(const Pi of [0.0095,0.076,0.25,0.5])for(const se of [0.25,0.5,1.0])for(const ks of [0.5,1,2])for(const sd of [1,2]){
 const o={sigmaExt:se,Kscale:ks},a=T.run(sd,{...T.ARMS.A,Pi},o),c=T.run(sd,T.ARMS.C,o),v=T.verdict(a,c,{...T.DEF,...o});
 sw.push({Pi,sigmaExt:se,Kscale:ks,seed:sd,A:a.survival,C:c.survival,pass:v.pass})}
const flips=sw.filter(x=>!x.pass);
out.recoveringCoordinate={points:sw.length,failing:flips.length,found:flips.length>0,failingPoints:flips,sweep:sw};
// scale/topology
const doms=[{name:'N33 nearest-neighbour {1}',N:33,gens:[1]},{name:'N33 Cayley {5,8,13}',N:33,gens:[5,8,13]},{name:'N33 V1 chord {1,2,3,5,8,13,21}',N:33,gens:[1,2,3,5,8,13,21]},{name:'N21 Cayley {1,6,10}',N:21,gens:[1,6,10]},{name:'N55 Cayley {1,17,25}',N:55,gens:[1,17,25]}];
out.scaleTopology=doms.map(d=>{const rows=[1,2,3,4].map(sd=>{const o={N:d.N,gens:d.gens},a=T.run(sd,T.ARMS.A,o),c=T.run(sd,T.ARMS.C,o),v=T.verdict(a,c,{...T.DEF,...o});return{seed:sd,A:a.survival,C:c.survival,pass:v.pass}});const n=rows.filter(r=>r.pass).length;return{...d,rows,passN:n,holds:n>=3}});
out.generalizes=out.scaleTopology.every(d=>d.holds);
out.results_sha256=T.sha256(JSON.stringify(T.round6({main:mainRows.map(r=>r.sha256),sw:sw,st:out.scaleTopology})));
fs.writeFileSync('RESULTS_P4N-TORUS-CELL-V02.json',JSON.stringify(out,null,1));fs.writeFileSync('series_v02.json',JSON.stringify(series));
const f=x=>x==null?'—':(+x).toFixed(3);
console.log('Atlantis baseline',out.atlantisTicks,'ticks (',out.atlantisCycles,'cycles)');
console.log('seed | A surv | B surv | C surv | E(recyc off) | F(syn off) | A0.99 | need | PASS | ΨA ΨR_A RA | synΔ recΔ | sha');
for(const r of mainRows)console.log([r.seed,r.A.survival+(r.A.censored?'+':''),r.B.survival+(r.B.censored?'+':''),r.C.survival,r.E.survival,r.F.survival,r.Alt.survival,r.verdict.need,r.verdict.pass,f(r.A.psiCutMean),f(r.A.psiRCutMean),f(r.A.RcutMean),r.synergyDelta,r.recyclingDelta,r.sha256.slice(0,12)].join(' | '));
console.log('MAIN',passN+'/8',out.main.OVERALL,'| B holds',bHold+'/8 → canon prediction',out.predictionB.canon_prediction_confirmed?'CONFIRMED':'NOT confirmed','| negctl',out.negativeControl.passed,'| recov coord found',out.recoveringCoordinate.found,flips.length+'/'+sw.length,'| generalizes',out.generalizes);
for(const d of out.scaleTopology)console.log(' ',d.name,d.passN+'/4',d.rows.map(r=>r.A+'/'+r.C).join(' '));
console.log('failing sweep pts:',JSON.stringify(flips.map(x=>[x.Pi,x.sigmaExt,x.Kscale,x.seed,x.A,x.C])));
console.log('results_sha256',out.results_sha256);
