"""Self-test: each v1.1 fix vs v1 on synthetic claims (no network needed except FIX-5 which uses github.com)."""
import importlib.util, os, io, contextlib, copy, json
from dataclasses import asdict
H=os.path.dirname(os.path.abspath(__file__))
def L(n):
    s=importlib.util.spec_from_file_location(n,os.path.join(H,n+'.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
v1,v11=L('seas_v1'),L('seas_v1_1')
v1.verify_uri_accessible=lambda uri: uri and "zenodo.org" in uri or "github.com" in uri  # v1's own __main__ placeholder
base=dict(claim_id='SELFTEST',title='t',hypothesis='h',empirical_results={'chi':0.5,'omega':0.8,'delta':0.1},
 pipeline_uri='https://github.com/hck9v4n9gf-dotcom/godengine-app',data_uri='https://github.com/hck9v4n9gf-dotcom/godengine-app',pipeline_hash='x'*64,timestamp='T',
 metadata={'preprocessing':'p','controversies_bracketed':True,'physical_residual':'r','measurement_independence':{'chi_source':'a','omega_source':'b','delta_source':'c'},
 'basis_standardization':'s','reproducibility_test':{'pipeline_rerun_matches':True},'recovering_coordinate_search':{'found':False,'description':'d'},
 'negative_control':{'performed':True,'claim_rejected_on_negative_data':True},'scale_topology_test':{'performed':True,'generalizes':True,'domains_tested':['x','y']},
 'testable_predictions':['p'],'mathematical_form':'f','uniqueness_proven':True,'bounded_growth':True,
 'unfalsifiable_claims_audit':{'consciousness_claim':False,'mysticism':False,'universal_efficiency_claim':False},'degrees_of_freedom':{'accounted':True,'count':3}})
def adj(m,c):
    with contextlib.redirect_stdout(io.StringIO()): return m.execute_adjudication(m.ClaimSubmission(**c))
cases={}
cases['clean claim']=base
c=copy.deepcopy(base);del c['metadata']['recovering_coordinate_search'];cases['FIX-1a recovering_coordinate missing']=c
c=copy.deepcopy(base);del c['metadata']['unfalsifiable_claims_audit'];cases['FIX-1b audit missing']=c
c=copy.deepcopy(base);c['metadata']['measurement_independence']['delta_source']='a';cases['FIX-2 chi_source==delta_source']=c
c=copy.deepcopy(base);c['pipeline_uri']='https://github.com/hck9v4n9gf-dotcom/no-such-repo-p4n-404';cases['FIX-5 dead github URI']=c
out=[]
for k,c in cases.items():
    a,b=adj(v1,c),adj(v11,c);row={'case':k,'v1':a.overall_status,'v1_1':b.overall_status}
    if k=='clean claim':
        a2,b2=adj(v1,c),adj(v11,c);row['FIX-3 v1 hash stable']=a.dual_hash_sha256==a2.dual_hash_sha256;row['FIX-3 v1.1 hash stable']=b.dual_hash_sha256==b2.dual_hash_sha256
    out.append(row);print(row)
json.dump(out,open(os.path.join(H,'SEAS_FIX_SELFTEST.json'),'w'),indent=1)
