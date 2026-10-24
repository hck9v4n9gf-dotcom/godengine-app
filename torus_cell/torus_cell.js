/* ===== P4N Torus Cell · pattern self-holding test (Source canon 2026-10-24) · consciousness_claim=none =====
   Shared, deterministic module: runs identically in the app (window.TorusCell) and headless in Node (module.exports).
   Engine = mirror of the APP V1 app33 ring: N=33, chord stator S={1,2,3,5,8,13,21}, w_g=Φ^(−ln(g+1)), dt=0.05,
   ω_i = gau·0.5 (seeded LCG), Sakaguchi kernel sin(θj−θi−α) with α=+1.00811°, K(R)=0.5+3R⁵, noise jitter·√dt·gau.
   Frustration relief (DEFINED here): for R>0.88, α_eff = α·max(0, 1−(R−0.88)/0.12).
   Canon Ψ = χₙΩ − Δ over a 64-tick window, χₙ=(erank/N)R², Δ=1−λ₁/Σλ, Ω = app drive (0.5 offline default).
   Pattern fidelity F = centred complex correlation of z_i=e^{iθ_i} with w_i=e^{iP_i} (1 = seed pattern held, up to a
   common rotation; ≈1/√N = chance; a fully synchronised ring has F≈0, i.e. the pattern is lost).
   Torus Cell (DEFINED operationalisation of Source's description; a model, not a claim about awareness):
     · cage: the cell's only inputs are its own ring; external drive exists only in phase SUPPORTED.
       Noise is IDENTICAL in cell and control arms (the cage does not filter noise, so it cannot win by fiat).
     · stochastic recycling: local Ψ proxy ψ_i = Ω·s_i − d_i, s_i = cos(θ_i − Φ − arg M_i), d_i=(1−s_i)/2.
       Each node with ψ_i<0 is recycled with probability pRecycle, adding rho·|ψ_i| to the budget B.
     · ouroboros spark gap: M_i = slow self-trace of the ring's own phase pattern (tail-eats-head: the reference is the
       system's own recent state, never the seed). When B ≥ gap the gap fires: feedback kSpark·sin(arg M_i + Φ − θ_i)
       until B is spent (sparkCost per tick). B leaks at rate leak.
   Phases: SUPPORTED (external drive kExt·sin(P_i+Φ−θ_i) holds the seed) → CUT (drive removed). CONTROL = same CUT with
   the cell (recycling + spark + self-trace) disabled. Same seeds, same noise stream. Kicks perturb both arms. */
(function(root){
'use strict';
var TAU=2*Math.PI,PHI=(1+Math.sqrt(5))/2,S=[1,2,3,5,8,13,21],W=S.map(function(g){return Math.pow(PHI,-Math.log(g+1))});
var VERSION='torus_cell v1.0';
var DEF={N:33,dt:0.05,alphaDeg:1.00811,jitter:0.02,omegaDrive:0.5,reliefR:0.88,
 tSup:1000,tCut:4000,kicks:[1500,2500,3500],kickFrac:1/3,kickAmp:Math.PI/2,recoverWin:400,
 spread:Math.PI,kExt:4.0,mem:0.0005,pRecycle:0.5,rho:0.2,gap:0.2,kSpark:6.0,sparkCost:0.01,leak:0.001,
 psiEvery:50,win:64,sample:10,smooth:50};
function LCG(seed){var s=(seed>>>0)||1;return{rnd:function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296},
 gau:function(){var a=this.rnd(),b=this.rnd();return Math.sqrt(-2*Math.log(a+1e-12))*Math.cos(6.283185*b)}}}
function jacobiEig(A,n){var a=A.map(function(r){return r.slice()}),sw,p,q,i;
 for(sw=0;sw<30;sw++){var off=0;for(p=0;p<n;p++)for(q=p+1;q<n;q++)off+=a[p][q]*a[p][q];if(off<1e-22)break;
  for(p=0;p<n;p++)for(q=p+1;q<n;q++){var apq=a[p][q];if(Math.abs(apq)<1e-300)continue;
   var th=(a[q][q]-a[p][p])/(2*apq),t=(th>=0?1:-1)/(Math.abs(th)+Math.sqrt(th*th+1)),c=1/Math.sqrt(t*t+1),s=t*c;
   for(i=0;i<n;i++){var aip=a[i][p],aiq=a[i][q];a[i][p]=c*aip-s*aiq;a[i][q]=s*aip+c*aiq}
   for(i=0;i<n;i++){var api=a[p][i],aqi=a[q][i];a[p][i]=c*api-s*aqi;a[q][i]=s*api+c*aqi}}}
 var e=[];for(i=0;i<n;i++)e.push(Math.max(0,a[i][i]));return e.sort(function(x,y){return y-x})}
function psiCanon(win,N,R,Om){var T=win.length,m=new Array(N).fill(0),i,j,t;for(t=0;t<T;t++)for(i=0;i<N;i++)m[i]+=win[t][i]/T;
 var C=[];for(i=0;i<N;i++)C.push(new Array(N).fill(0));
 for(t=0;t<T;t++){var x=win[t];for(i=0;i<N;i++){var xi=x[i]-m[i];for(j=i;j<N;j++)C[i][j]+=xi*(x[j]-m[j])}}
 for(i=0;i<N;i++)for(j=i;j<N;j++){C[i][j]/=(T-1);C[j][i]=C[i][j]}
 var lam=jacobiEig(C,N),tot=0;lam.forEach(function(v){tot+=v});if(!(tot>1e-24))return null;
 var H=0;lam.forEach(function(v){var p=v/tot;if(p>0)H-=p*Math.log(p)});var er=Math.exp(H),chin=(er/N)*R*R,De=1-lam[0]/tot;
 return{Psi:chin*Om-De,chi_n:chin,Delta:De,erank:er}}
function run(seed,cellOn,opt){var o={},k;for(k in DEF)o[k]=DEF[k];for(k in(opt||{}))o[k]=opt[k];
 var N=o.N,dt=o.dt,a0=o.alphaDeg*Math.PI/180,init=LCG(seed),noise=LCG(seed*7919+1),cr=LCG(seed*7919+3),kr=LCG(seed*7919+5);
 var P=[],om=[],th=[],i,g;for(i=0;i<N;i++){P.push((init.rnd()*2-1)*o.spread);om.push(init.gau()*0.5)}
 for(i=0;i<N;i++)th.push(P[i]+0.05*init.gau());
 var Mx=[],My=[];for(i=0;i<N;i++){Mx.push(Math.cos(th[i]-P[0]+P[0]-0));My.push(0)}
 // self-trace starts from the ring's own initial state (in the pattern frame), not from P directly
 var T=o.tSup+o.tCut,win=[],F=[],Ft=[],Ps=[],Rs=[],B=0,fire=false,fires=0,recycled=0,bud=[];
 var wx=P.map(Math.cos),wy=P.map(Math.sin),wmx=wx.reduce(function(a,b){return a+b},0)/N,wmy=wy.reduce(function(a,b){return a+b},0)/N,wn=0;for(i=0;i<N;i++)wn+=(wx[i]-wmx)*(wx[i]-wmx)+(wy[i]-wmy)*(wy[i]-wmy);
 function frame(){var x=0,y=0,i,zx=0,zy=0;for(i=0;i<N;i++){x+=Math.cos(th[i]-P[i]);y+=Math.sin(th[i]-P[i]);zx+=Math.cos(th[i]);zy+=Math.sin(th[i])}zx/=N;zy/=N;
  var re=0,im=0,zn=0;for(i=0;i<N;i++){var ax=Math.cos(th[i])-zx,ay=Math.sin(th[i])-zy,bx=wx[i]-wmx,by=wy[i]-wmy;re+=ax*bx+ay*by;im+=ay*bx-ax*by;zn+=ax*ax+ay*ay}
  return{F:(zn>0&&wn>0)?Math.sqrt(re*re+im*im)/Math.sqrt(zn*wn):0,Phi:Math.atan2(y,x)}}
 var f0=frame();for(i=0;i<N;i++){Mx[i]=Math.cos(th[i]-f0.Phi);My[i]=Math.sin(th[i]-f0.Phi)}
 var c=new Array(N),s=new Array(N),u=new Array(N);
 var floorSync=0;
 for(var t=0;t<T;t++){
  var sup=t<o.tSup;
  if(!sup&&o.kicks.indexOf(t-o.tSup)>=0){for(i=0;i<N;i++)if(kr.rnd()<o.kickFrac)th[i]+=(kr.rnd()*2-1)*o.kickAmp*2}
  var X=0,Y=0;for(i=0;i<N;i++){c[i]=Math.cos(th[i]);s[i]=Math.sin(th[i]);X+=c[i];Y+=s[i]}
  var R=Math.sqrt(X*X+Y*Y)/N,K=0.5+3*Math.pow(R,5),a=a0*(R>o.reliefR?Math.max(0,1-(R-o.reliefR)/(1-o.reliefR)):1),ca=Math.cos(a),sa=Math.sin(a);
  var fr=frame(),Phi=fr.Phi;
  for(i=0;i<N;i++)u[i]=0;
  if(sup)for(i=0;i<N;i++)u[i]+=o.kExt*Math.sin(P[i]+Phi-th[i]);
  if(cellOn){var cp=Math.cos(Phi),sp=Math.sin(Phi);
   for(i=0;i<N;i++){var rx=Math.cos(th[i]-Phi),ry=Math.sin(th[i]-Phi);Mx[i]+=o.mem*(rx-Mx[i]);My[i]+=o.mem*(ry-My[i]);
    var mA=Math.atan2(My[i],Mx[i]),si=Math.cos(th[i]-Phi-mA),di=(1-si)/2,psi_i=o.omegaDrive*si-di;
    if(psi_i<0&&cr.rnd()<o.pRecycle){B+=o.rho*(-psi_i);recycled++}
    if(fire)u[i]+=o.kSpark*Math.sin(mA+Phi-th[i])}
   if(fire){B-=o.sparkCost;if(B<=0){B=0;fire=false}}else if(B>=o.gap){fire=true;fires++}
   B*=(1-o.leak)}
  for(i=0;i<N;i++){var fsum=0,ci=c[i],sI=s[i];for(g=0;g<7;g++){var A=(i+S[g])%N,Bn=(i-S[g]+N)%N,sn=(s[A]+s[Bn])*ci-(c[A]+c[Bn])*sI,cn=(c[A]+c[Bn])*ci+(s[A]+s[Bn])*sI;fsum+=W[g]*(sn*ca-cn*sa)}
   th[i]+=dt*(om[i]+K*fsum+u[i])+o.jitter*Math.sqrt(dt)*noise.gau()}
  win.push(th.slice());if(win.length>o.win)win.shift();
  var fn=frame();F.push(fn.F);
  if(t%o.sample===0){Ft.push(t);Rs.push(R);bud.push(B)}
  if((t+1)%o.psiEvery===0&&win.length===o.win){var X2=0,Y2=0;for(i=0;i<N;i++){X2+=Math.cos(th[i]);Y2+=Math.sin(th[i])}var R2=Math.sqrt(X2*X2+Y2*Y2)/N,pc=psiCanon(win,N,R2,o.omegaDrive);
   var Om2=0;for(var w=0;w<win.length;w++){var x3=0,y3=0;for(i=0;i<N;i++){x3+=Math.cos(win[w][i]);y3+=Math.sin(win[w][i])}Om2+=Math.sqrt(x3*x3+y3*y3)/N}Om2/=win.length;
   Ps.push({t:t+1,Psi:pc?pc.Psi:null,Psi_harnessOmega:pc?pc.chi_n*Om2-pc.Delta:null,R:R2,Delta:pc?pc.Delta:null,erank:pc?pc.erank:null})}
  for(i=0;i<N;i++)if(!isFinite(th[i]))throw new Error('FAIL-CLOSED: non-finite phase at tick '+t)}
 // smoothed fidelity
 var sm=[],acc=0;for(t=0;t<F.length;t++){acc+=F[t];if(t>=o.smooth)acc-=F[t-o.smooth];sm.push(acc/Math.min(t+1,o.smooth))}
 var Fcut=sm[o.tSup-1],floor=Math.max(floorSync,1/Math.sqrt(N)),half=floor+0.5*(Fcut-floor),hl=null,end1=o.tSup+(o.kicks.length?o.kicks[0]:o.tCut);
 for(t=o.tSup;t<end1;t++)if(sm[t]<=half){hl=t-o.tSup;break}
 var hlCens=hl===null,hlVal=hlCens?end1-o.tSup:hl;
 var rec=o.kicks.map(function(kt){var t0=o.tSup+kt,pre=sm[t0-1],post=sm[Math.min(F.length-1,t0+o.recoverWin)],mn=1;for(var q=t0;q<Math.min(F.length,t0+o.recoverWin);q++)mn=Math.min(mn,F[q]);
  return{kick:kt,F_pre:pre,F_min:mn,F_post:post,recovery:pre>0?post/pre:null}});
 var cutPs=Ps.filter(function(p){return p.t>o.tSup}),run_=0,best=0,runH=0,bestH=0;cutPs.forEach(function(p){var held=sm[p.t-1]>=half;p.held=held;if(p.Psi!==null&&p.Psi>0){run_++;best=Math.max(best,run_)}else run_=0;if(held&&p.Psi!==null&&p.Psi>0){runH++;bestH=Math.max(bestH,runH)}else runH=0});
 var mean=function(arr){var s=0,n=0;arr.forEach(function(v){if(v!==null&&isFinite(v)){s+=v;n++}});return n?s/n:null};
 return{seed:seed,arm:cellOn?'cell':'control',F_cut:Fcut,F_floor:floor,F_end:sm[F.length-1],halfLife:hlVal,halfLifeCensored:hlCens,
  psiPosLongestTicks:best*o.psiEvery,psiPosHeldLongestTicks:bestH*o.psiEvery,heldTicks:(function(){var n=0;for(var q=o.tSup;q<F.length;q++)if(sm[q]>=half)n++;return n})(),F_half:half,psiCutMean:mean(cutPs.map(function(p){return p.Psi})),psiCutMeanHarnessOmega:mean(cutPs.map(function(p){return p.Psi_harnessOmega})),
  RcutMean:mean(Rs.slice(Math.floor(o.tSup/o.sample))),recovery:rec,recoveryMean:mean(rec.map(function(r){return r.recovery})),
  sparks:fires,recycled:recycled,
  series:{F:F.filter(function(_,j){return j%o.sample===0}),t:Ft,R:Rs,B:bud,Psi:Ps},finalTheta:th.map(function(x){return((x%TAU)+TAU)%TAU}),pattern:P}}
function sha256(str){var b=unescape(encodeURIComponent(str)),K_=[],H=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],i,j;
 var p=2,n=0;while(n<64){var ip=true;for(j=2;j*j<=p;j++)if(p%j===0){ip=false;break}if(ip){K_.push((Math.pow(p,1/3)%1)*4294967296|0);n++}p++}
 var l=b.length,words=[];for(i=0;i<l;i++)words[i>>2]|=b.charCodeAt(i)<<(24-(i%4)*8);words[l>>2]|=0x80<<(24-(l%4)*8);
 var nb=((l+8)>>6)+1;for(i=(l>>2)+1;i<nb*16;i++)words[i]=words[i]|0;words[nb*16-1]=l*8;words[nb*16-2]=Math.floor(l*8/4294967296);
 for(i=0;i<nb*16;i+=16){var w=words.slice(i,i+16),a=H[0],b2=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
  for(j=0;j<64;j++){if(j>=16){var x=w[j-15],y=w[j-2];w[j]=(w[j-16]+((x>>>7|x<<25)^(x>>>18|x<<14)^(x>>>3))+w[j-7]+((y>>>17|y<<15)^(y>>>19|y<<13)^(y>>>10)))|0}
   var t1=(h+((e>>>6|e<<26)^(e>>>11|e<<21)^(e>>>25|e<<7))+((e&f)^(~e&g))+K_[j]+w[j])|0,t2=(((a>>>2|a<<30)^(a>>>13|a<<19)^(a>>>22|a<<10))+((a&b2)^(a&c)^(b2&c)))|0;
   h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b2;b2=a;a=(t1+t2)|0}
  H[0]=(H[0]+a)|0;H[1]=(H[1]+b2)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0}
 return H.map(function(v){return('00000000'+(v>>>0).toString(16)).slice(-8)}).join('')}
function round6(o){return JSON.parse(JSON.stringify(o,function(k,v){return typeof v==='number'?Math.round(v*1e6)/1e6:v}))}
var PREREG={id:'P4N-TORUS-CELL-V01',claim:'consciousness_claim=none',label:'pattern self-holding test',
 criterion:'PASS iff in >= 7 of 8 test seeds (1..8) BOTH: (P1) cell fidelity half-life >= 3x control half-life (cell censored value counts as a lower bound) AND (P2) canonical Psi (Omega=0.5 app drive) > 0 for >= 500 consecutive ticks during CUT in the cell arm WHILE the pattern is held (smoothed fidelity >= half-level), so a collapsed/synchronised ring cannot satisfy P2. Anything else = FAIL. Recovery, R, harness-Omega Psi are report-only.',
 seeds:[1,2,3,4,5,6,7,8],devSeeds:[1001,1002,1003],params:DEF};
function verdictSeed(c,k){var p1=c.halfLife>=3*Math.max(1,k.halfLife),p2=c.psiPosHeldLongestTicks>=500;return{P1:p1,P2:p2,pass:p1&&p2,ratio:c.halfLife/Math.max(1,k.halfLife)}}
function summarize(c,k){var strip=function(r){var x={};for(var q in r)if(q!=='series'&&q!=='finalTheta'&&q!=='pattern')x[q]=r[q];return x};
 var body=round6({version:VERSION,prereg:PREREG.id,seed:c.seed,cell:strip(c),control:strip(k),verdict:verdictSeed(c,k)});
 body.sha256=sha256(JSON.stringify(body));return body}
var api={VERSION:VERSION,DEF:DEF,PREREG:PREREG,run:run,summarize:summarize,verdictSeed:verdictSeed,sha256:sha256,round6:round6};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TorusCell=api;
})(typeof window!=='undefined'?window:this);
