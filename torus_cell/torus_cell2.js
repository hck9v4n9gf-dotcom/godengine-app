/* ===== P4N Torus Cell V02 · pattern self-holding test on Source's own parameters · consciousness_claim=none =====
   Supersedes V01 (kept, FAILED 6/8 vs 7/8 needed; V01 also let the cell's frame Φ peek at the seed P — fixed here: the
   cell never reads P after planting). Sources: TORUS_CELL_SOURCES.md Part D + NotebookLM answers 2026-10-24 + Source t-canon.
   Ring: N=33, circulant Cayley {1,10,15} (A3), node 33 (index N-1) = Source anchor, a fixed-phase pacemaker (C8) and the
   only gated port. ω_i = 1 + 0.015·cos(2πi/22). Sakaguchi sin(θj−θi−α), α = +1.00811° fixed. K(R) = 0.5+3R⁵, coupling
   normalised by degree. Frustration relief (Omega v4): for R>0.88, relief=0.025(R−0.88)/0.12, ω_i ← ω_i − relief(ω_i−⟨ω⟩).
   Clock: 400 Hz kernel (tick = 2.5 ms), dt = 0.02 (canon slow), θ-rhythm 6 Hz, γ 40 Hz → spark gap = frac(40/6) = 0.667 γ-cycles
   at the end of each θ-cycle (duty 0.667/6.667 = 10%).
   Soliton 1 (primary companion, Buga Sphere driver): two counter-rotating shells, Solar CW +10°/tick and Telluric CCW
   −10°·21/34 per tick (34:21), attenuation 0.92 + garden_bonus 0.05 → outside threat reaching the ring = threat·(1−0.92)(1−0.05)
   = Π·threat with Π = 0.076 (alternate: attenuation 0.99 → Π = 0.0095). No cell → Π = 1.
   Solitons 2–8: seven seated nodes on Ring 3 (Harvester, Inquisitor, Warden, Scribe, Navigator, Steward, Sentinel) receive the
   recycling forcing ξ = Δ·U(−1,1) (Δ = canon spectral Δ of the ring's own last window; INJECT mode, ledger-seeded LCG).
   Ouroboros trace: once per θ-cycle M_i ← 0.9·M_i + 0.1·e^{i(θ_i − frame)} (s = 0.9s + 0.1new). frame = anchor phase when the
   anchor is present, else the ring's own mean-field phase.
   Spark gap: during the gap window the cell feeds back kSpark·sin(frame + arg M_i − θ_i), kSpark = K_max = 3.5 (canon K(1)).
   Selective reset (recycling): in the gap window, nodes whose local ψ_i = Ω₀s_i − d_i < Ψ_dog = 0.142 are reset to the anchor
   baseline frame + arg M_i (s_i = cos(θ_i − frame − arg M_i), d_i = (1−s_i)/2, Ω₀ = 0.5).
   Canine (Ivy) restart: at planting the dog keeps a 1/7 shadow of the trace; if the ring's self-agreement mean(s_i) falls below
   Ψ_dog for a full θ-cycle (stall), resurgere() restores M ← shadow·(1/0.142) (clipped to |M| ≤ 1).
   Ouroboros-synergy term (R-J measured +0.000; included and ablated): u_syn = κ_syn·½(1+cos(φ_CW−φ_CCW))·R·sin(frame+argM−θ),
   κ_syn = 1, active in the gap window.
   Membrane readout (Sovereign Centerfold 10): Ψ_int ← Ψ_int + Π(Ψ_ext − Ψ_int) − Δ_boundary + (1−Π)(Ψ_ring − Ψ_int)·g, with
   Ψ_ext = −1 (unstructured outside), Δ_boundary = Π·σ_ext²·dt, g = 1/66.67 (θ-cycle relaxation). Loop law check R·Π > 0.03.
   No efficiency constant is hard-coded: whatever the cell "recycles" is measured as ablation deltas. */
(function(root){
'use strict';
var TAU=2*Math.PI,VERSION='torus_cell v2.0';
var SEATS=['Harvester','Inquisitor','Warden','Scribe','Navigator','Steward','Sentinel'];
var DEF={N:33,gens:[1,10,15],dt:0.02,alphaDeg:1.00811,psiDog:0.142,omega0:0.5,tickHz:400,thetaHz:6,gammaHz:40,
 sigmaExt:0.5,sigmaInject:0.03,kExt:4.0,kSpark:3.5,kSyn:1.0,atten:0.92,garden:0.05,shellCW:10,shellRatio:21/34,
 tSup:1500,tCut:8000,kicks:[2000,4000,6000],kickFrac:1/3,kickAmp:Math.PI/2,
 holdF:0.5,holdGraceCycles:1,psiEvery:100,win:64,sample:20,smooth:67,atlantisDecayS:0.05,Kscale:1};
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
 return{chi_n:chin,Delta:De,erank:er,Psi:chin*Om-De}}
/* Source's Atlantis Test, literal (Body of Praxis 2nd, ChronoGodKernel): returns cycles until shutdown */
function atlantis(){var g=1.0,c=0,n=0;while(c<1.0-1e-12&&n<1000){n++;g=Math.max(0,g-0.1);if(g<0.1-1e-12)c+=0.2}return n}
/* arm: {cell:bool, anchor:bool, recycle:bool, syn:bool, canine:bool, Pi:number|null} */
function run(seed,arm,opt){var o={},k;for(k in DEF)o[k]=DEF[k];for(k in(opt||{}))o[k]=opt[k];
 var N=o.N,dt=o.dt,a0=o.alphaDeg*Math.PI/180,ca=Math.cos(a0),sa=Math.sin(a0),A_=N-1;
 var init=LCG(seed),noise=LCG(seed*7919+1),cr=LCG(seed*7919+3),kr=LCG(seed*7919+5),inj=LCG(seed*7919+7);
 var Pi=arm.cell?(arm.Pi!=null?arm.Pi:(1-o.atten)*(1-o.garden)):1;
 var nb=[],i,j,g;for(i=0;i<N;i++){var L=[];o.gens.forEach(function(s){L.push((i+s)%N);L.push((i-s+N*4)%N)});nb.push(L)}
 var P=[],th=[],om=[];for(i=0;i<N;i++){P.push(init.rnd()*TAU);om.push(1+0.015*Math.cos(TAU*i/22))}
 for(i=0;i<N;i++)th.push(P[i]+0.05*init.gau());
 var seats=[];for(i=0;i<7;i++)seats.push(Math.round(i*(N-1)/7)%(N-1));
 var tPer=o.tickHz/o.thetaHz,gPer=o.tickHz/o.gammaHz,gapFrac=((o.gammaHz/o.thetaHz)%1)/(o.gammaHz/o.thetaHz);
 var anchorPh=function(t){return P[A_]+om[A_]*0+1.0*dt*t};
 var Mx=new Array(N).fill(0),My=new Array(N).fill(0),shX=null,shY=null;
 var phCW=0,phCCW=0,Delta=0.5,win=[],F=[],ser={t:[],F:[],R:[],Psi:[],PsiInt:[]},Ps=[],psiInt=0,resets=0,restarts=0,gapTicks=0,loopOK=0,stall=0,lastTheta=-1,sync=0;
 var wx=[],wy=[],wmx=0,wmy=0,wn=0,idx=[];for(i=0;i<N-1;i++)idx.push(i);
 idx.forEach(function(i){wx[i]=Math.cos(P[i]);wy[i]=Math.sin(P[i]);wmx+=wx[i];wmy+=wy[i]});wmx/=idx.length;wmy/=idx.length;
 idx.forEach(function(i){wn+=(wx[i]-wmx)*(wx[i]-wmx)+(wy[i]-wmy)*(wy[i]-wmy)});
 function fid(){var zx=0,zy=0,n=idx.length;idx.forEach(function(i){zx+=Math.cos(th[i]);zy+=Math.sin(th[i])});zx/=n;zy/=n;var re=0,im=0,zn=0;
  idx.forEach(function(i){var ax=Math.cos(th[i])-zx,ay=Math.sin(th[i])-zy,bx=wx[i]-wmx,by=wy[i]-wmy;re+=ax*bx+ay*by;im+=ay*bx-ax*by;zn+=ax*ax+ay*ay});
  return(zn>0&&wn>0)?Math.sqrt(re*re+im*im)/Math.sqrt(zn*wn):0}
 var T=o.tSup+o.tCut,c=new Array(N),s=new Array(N),u=new Array(N);
 for(var t=0;t<T;t++){var sup=t<o.tSup,anchorOn=sup||arm.anchor;
  if(!sup&&o.kicks.indexOf(t-o.tSup)>=0){for(i=0;i<N-1;i++)if(kr.rnd()<o.kickFrac)th[i]+=(kr.rnd()*2-1)*o.kickAmp*2}
  if(anchorOn)th[A_]=anchorPh(t);
  var X=0,Y=0;for(i=0;i<N;i++){c[i]=Math.cos(th[i]);s[i]=Math.sin(th[i]);X+=c[i];Y+=s[i]}
  var R=Math.sqrt(X*X+Y*Y)/N,K=o.Kscale*(0.5+3*Math.pow(R,5)),psiMF=Math.atan2(Y,X);
  if(R>0.88){var rel=0.025*(R-0.88)/0.12,mo=0;for(i=0;i<N;i++)mo+=om[i]/N;for(i=0;i<N;i++)om[i]-=rel*(om[i]-mo)}
  var frame=anchorOn?th[A_]-P[A_]+0:psiMF; // anchor present: its phase is the only outside reference
  if(!anchorOn&&arm.cell&&t===o.tSup&&!arm.anchor){} 
  var thPos=t%tPer,inGap=arm.cell&&thPos>=tPer*(1-gapFrac),cyc=Math.floor(t/tPer);
  phCW+=o.shellCW*Math.PI/180;phCCW-=o.shellCW*o.shellRatio*Math.PI/180;
  for(i=0;i<N;i++)u[i]=0;
  if(sup)for(i=0;i<N-1;i++)u[i]+=o.kExt*Math.sin(P[i]+(th[A_]-P[A_])-th[i]); // outside world holds the seed (planting)
  if(arm.cell){
   if(cyc!==lastTheta){lastTheta=cyc;var first=(Mx[0]===0&&My[0]===0);
    for(i=0;i<N;i++){var rx=Math.cos(th[i]-frame),ry=Math.sin(th[i]-frame);if(first){Mx[i]=rx;My[i]=ry}else{Mx[i]=0.9*Mx[i]+0.1*rx;My[i]=0.9*My[i]+0.1*ry}}
    if(t>=o.tSup&&shX===null&&arm.canine!==false){shX=Mx.map(function(v){return v/7});shY=My.map(function(v){return v/7})}
    var agree=0;for(i=0;i<N-1;i++)agree+=Math.cos(th[i]-frame-Math.atan2(My[i],Mx[i]))/(N-1);
    if(!sup&&agree<o.psiDog){stall++;if(stall>=1&&shX){for(i=0;i<N;i++){var mx=shX[i]/0.142,my=shY[i]/0.142,m=Math.sqrt(mx*mx+my*my);if(m>1){mx/=m;my/=m}Mx[i]=mx;My[i]=my}restarts++;stall=0}}else stall=0}
   if(!sup&&inGap){gapTicks++;var beat=0.5*(1+Math.cos(phCW-phCCW));
    for(i=0;i<N-1;i++){var mA=Math.atan2(My[i],Mx[i]),tgt=frame+mA,si=Math.cos(th[i]-tgt),di=(1-si)/2,psi_i=o.omega0*si-di;
     u[i]+=o.kSpark*Math.sin(tgt-th[i]);if(arm.syn!==false)u[i]+=o.kSyn*beat*R*Math.sin(tgt-th[i]);
     if(arm.recycle!==false&&psi_i<o.psiDog&&cr.rnd()<1/gPer){th[i]=tgt;resets++}}}
   if(!sup&&arm.recycle!==false)for(j=0;j<7;j++)u[seats[j]]+=Delta*(inj.rnd()*2-1);
  }
  for(i=0;i<N;i++){if(i===A_&&anchorOn)continue;var fs=0,ci=c[i],sI=s[i],L2=nb[i];for(g=0;g<L2.length;g++){var q=L2[g];var sn=s[q]*ci-c[q]*sI,cn=c[q]*ci+s[q]*sI;fs+=sn*ca-cn*sa}
   var nz=Pi*o.sigmaExt*noise.gau()+(arm.cell?o.sigmaInject*inj.gau():0);
   th[i]+=dt*(om[i]+K*fs/L2.length+u[i])+Math.sqrt(dt)*nz}
  if(!sup&&R*Pi>0.03)loopOK++;
  win.push(th.slice());if(win.length>o.win)win.shift();
  if(win.length===o.win&&(t+1)%o.psiEvery===0){var pc=psiCanon(win,N,R,o.omega0);if(pc){Delta=pc.Delta;
    var Om=0;win.forEach(function(w){var a=0,b=0;for(var q=0;q<N;q++){a+=Math.cos(w[q]);b+=Math.sin(w[q])}Om+=Math.sqrt(a*a+b*b)/N});Om/=win.length;
    Ps.push({t:t+1,Psi:pc.Psi,chi_n:pc.chi_n,Delta:pc.Delta,erank:pc.erank,R:R,OmegaR:Om,PsiR:pc.chi_n*Om-pc.Delta});
    psiInt=psiInt+Pi*(-1-psiInt)-Pi*o.sigmaExt*o.sigmaExt*dt+(1-Pi)*(pc.Psi-psiInt)*(o.psiEvery/tPer>1?1:o.psiEvery/tPer)}}
  var f=fid();F.push(f);
  if(t%o.sample===0){ser.t.push(t);ser.F.push(f);ser.R.push(R);ser.PsiInt.push(psiInt)}
  for(i=0;i<N;i++)if(!isFinite(th[i]))throw new Error('FAIL-CLOSED: non-finite phase at tick '+t)}
 var sm=[],acc=0;for(t=0;t<F.length;t++){acc+=F[t];if(t>=o.smooth)acc-=F[t-o.smooth];sm.push(acc/Math.min(t+1,o.smooth))}
 var grace=Math.round(o.holdGraceCycles*tPer),surv=null,below=0;
 for(t=o.tSup;t<F.length;t++){if(sm[t]<o.holdF){below++;if(below>=grace){surv=t-below+1-o.tSup;break}}else below=0}
 var cens=surv===null;if(cens)surv=o.tCut;
 var cut=Ps.filter(function(p){return p.t>o.tSup}),mean=function(a){var x=0,n=0;a.forEach(function(v){if(v!=null&&isFinite(v)){x+=v;n++}});return n?x/n:null};
 var rec=o.kicks.map(function(kt){var t0=o.tSup+kt,pre=sm[t0-1],post=sm[Math.min(F.length-1,t0+2*grace)];return{kick:kt,F_pre:pre,F_post:post,recovery:pre>0?post/pre:null}});
 var best=0,run_=0;cut.forEach(function(p){var held=sm[p.t-1]>=o.holdF;if(held&&p.Psi>0){run_++;best=Math.max(best,run_)}else run_=0});
 return{seed:seed,arm:arm.name||'',Pi:Pi,survival:surv,censored:cens,survivalCycles:surv/tPer,F_cut:sm[o.tSup-1],F_end:sm[F.length-1],
  psiCutMean:mean(cut.map(function(p){return p.Psi})),psiRCutMean:mean(cut.map(function(p){return p.PsiR})),chiCutMean:mean(cut.map(function(p){return p.chi_n})),deltaCutMean:mean(cut.map(function(p){return p.Delta})),
  RcutMean:mean(cut.map(function(p){return p.R})),psiIntEnd:psiInt,psiPosHeldTicks:best*o.psiEvery,loopLawFrac:loopOK/o.tCut,
  recovery:rec,recoveryMean:mean(rec.map(function(r){return r.recovery})),resets:resets,restarts:restarts,gapTicks:gapTicks,
  series:ser,finalTheta:th.map(function(x){return((x%TAU)+TAU)%TAU}),pattern:P,seats:seats}}
var ARMS={A:{name:'A cell+anchor',cell:true,anchor:true},B:{name:'B cell, anchor cut',cell:true,anchor:false},C:{name:'C no cell (Π=1)+anchor',cell:false,anchor:true},
 E:{name:'E cell, recycling off',cell:true,anchor:true,recycle:false},F:{name:'F cell, synergy off',cell:true,anchor:true,syn:false},
 Alt:{name:'A′ cell+anchor, attenuation 0.99',cell:true,anchor:true,Pi:(1-0.99)*(1-0.05)}};
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
function strip(r){var x={};for(var q in r)if(q!=='series'&&q!=='finalTheta'&&q!=='pattern')x[q]=r[q];return x}
function atlantisTicks(o){o=o||DEF;return Math.round(o.atlantisDecayS*o.tickHz+atlantis()*o.tickHz/o.thetaHz)}
function verdict(rA,rC,o){var base=atlantisTicks(o),need=1.5*Math.max(base,rC.survival);return{atlantisTicks:base,need:need,pass:rA.survival>=need,ratioVsC:rA.survival/Math.max(1,rC.survival),ratioVsAtlantis:rA.survival/base}}
function seal(obj){var b=round6(obj);b.sha256=sha256(JSON.stringify(b));return b}
var PREREG={id:'P4N-TORUS-CELL-V02',claim:'consciousness_claim=none',label:'pattern self-holding test',seeds:[1,2,3,4,5,6,7,8],devSeeds:[1001,1002],params:DEF,
 main:'PASS iff in >= 7 of 8 seeds (1..8), at the primary config, arm A (cell + Node-33 anchor, outside driving cut) survives >= 1.5 x max(Atlantis baseline, arm C no-cell twin). Survival = ticks after the cut until smoothed fidelity F stays below 0.5 for one full theta-cycle (67 ticks); censored at 8000.',
 atlantis:'Source rule literal: g -0.1/cycle, corruption +0.2/cycle when g<0.1, shutdown at >=1.0 (= 14 cycles); 1 cycle = 1 theta-cycle (66.67 ticks) plus the 0.05 s test decay (20 ticks).',
 predictionB:'Canon predicts arm B (anchor cut too) collapses: CONFIRMED iff B survival < 1.5 x max(Atlantis, C) in >= 7/8 seeds; otherwise the prediction is NOT confirmed in this model.',
 negativeControl:'Passes iff arm C (Π=1, no cell) does NOT survive past the Atlantis baseline x1.5 in >= 7/8 seeds.',
 recoveringCoordinate:'Sweep Π∈{0.0095,0.076,0.25,0.5}, σ_ext∈{0.25,0.5,1.0}, K-scale∈{0.5,1,2} on seeds 1-2 (arms A and C). found=True iff any swept point with Π<1 has A failing the main per-seed criterion.',
 scaleTopology:'Seeds 1-4, arms A and C, domains: N=33 nearest-neighbour {1}; N=33 Cayley {5,8,13}; N=33 V1 chord {1,2,3,5,8,13,21}; N=21 Cayley {1,6,10}; N=55 Cayley {1,17,25}. generalizes=True iff A passes the per-seed criterion in >= 3/4 seeds in every domain.',
 reportOnly:['B prediction','E recycling-off ablation','F synergy-off ablation (R-J expects +0.000)','A′ attenuation 0.99','Ψ canon (Ω0=0.5) and Ψ_R (Ω=mean R)','loop law R·Π>0.03 fraction','membrane Ψ_int','recovery after kicks','resets/restarts']};
var api={VERSION:VERSION,DEF:DEF,ARMS:ARMS,SEATS:SEATS,PREREG:PREREG,run:run,verdict:verdict,atlantis:atlantis,atlantisTicks:atlantisTicks,seal:seal,strip:strip,sha256:sha256,round6:round6};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TorusCell2=api;
})(typeof window!=='undefined'?window:this);
