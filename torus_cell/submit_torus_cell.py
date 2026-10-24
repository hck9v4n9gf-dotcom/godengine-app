"""Submit P4N Torus Cell V02 to SEAS v1 (verbatim) and SEAS v1.1 (fail-closed fixes).
consciousness_claim=False. Honest declaration: chi, omega and delta are all computed from the SAME ring phase
window (33 phases x 64 ticks): chi = (erank/N)*R^2 and delta = 1 - lambda1/sum(lambda) share the covariance
eigenspectrum; omega (harness) = time-mean Kuramoto R, and R^2 is inside chi. They are NOT independent, so the
sources are declared identically and Gate 2 is expected to bury the claim. Gates 3-5 are additionally run
standalone as a labelled DIAGNOSTIC (not a verdict)."""
import json, sys, io, contextlib, importlib.util, hashlib, os
from dataclasses import asdict
HERE = os.path.dirname(os.path.abspath(__file__))
def _p(f):
    a = os.path.join(HERE, f)
    return a if os.path.exists(a) else os.path.join(HERE, '..', 'test', f)
R = json.load(open(_p('RESULTS_P4N-TORUS-CELL-V02.json')))
PRE = json.load(open(_p('PREREG_P4N-TORUS-CELL-V02.json')))
REPO = 'https://github.com/hck9v4n9gf-dotcom/godengine-app'
def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
v1 = load('seas_v1', os.path.join(HERE, 'seas_v1.py')); v11 = load('seas_v1_1', os.path.join(HERE, 'seas_v1_1.py'))
rows = R['main']['rows']; mean = lambda xs: sum(xs) / len(xs)
emp = {'chi': mean([r['A']['chiCutMean'] for r in rows]), 'omega': mean([r['A']['RcutMean'] for r in rows]),
       'delta': mean([r['A']['deltaCutMean'] for r in rows]),
       'main_pass': f"{R['main']['passN']}/8", 'atlantis_ticks': R['atlantisTicks'],
       'A_survival': [r['A']['survival'] for r in rows], 'C_survival': [r['C']['survival'] for r in rows],
       'results_sha256': R['results_sha256']}
same = 'ring phase window theta(t), 33 phases x 64 ticks (one measurement stream)'
st = R['scaleTopology']; rc = R['recoveringCoordinate']; nc = R['negativeControl']
meta = {
 'preprocessing': 'none: raw simulated phases; fidelity = centred complex correlation with the planted seed, 67-tick moving mean',
 'controversies_bracketed': True,
 'physical_residual': 'simulation only (no physical measurement); a 33-oscillator Sakaguchi-Kuramoto toy model',
 'measurement_independence': {'chi_source': same, 'omega_source': same, 'delta_source': same,
   'note': 'chi=(erank/N)R^2 and delta=1-l1/sum(l) share the covariance eigenspectrum; omega=mean R and R^2 is inside chi. Not independent.'},
 'basis_standardization': 'phases as raw radians; Psi window 64 ticks every 100 ticks; Omega_0=0.5 (app) or mean R (harness)',
 'reproducibility_test': {'pipeline_rerun_matches': True, 'detail': 'fresh-process Node re-run reproduced results_sha256 ' + R['results_sha256']},
 'recovering_coordinate_search': {'found': rc['found'], 'description': f"sweep Pi x sigma_ext x K-scale ({rc['points']} points, seeds 1-2): {rc['failing']} points fail the per-seed criterion; failures concentrate at K-scale 2 (stronger coupling re-synchronises the ring, survival ~370-1360 ticks < 1429.5 needed)"},
 'negative_control': {'performed': True, 'claim_rejected_on_negative_data': nc['passed'], 'detail': f"arm C (Pi=1, no cell) survived past 1.5x Atlantis in {nc['C_survives_past_1p5xAtlantis_in']}/8 seeds"},
 'scale_topology_test': {'performed': True, 'generalizes': R['generalizes'], 'domains_tested': [f"{d['name']}: {d['passN']}/4" for d in st]},
 'testable_predictions': ['A outlasts 1.5 x max(Atlantis, no-cell twin) in >=7/8 seeds', 'B (anchor cut) collapses (canon prediction)', 'K-scale 2 breaks the hold'],
 'mathematical_form': 'dtheta_i = dt[omega_i + K(R)/deg sum sin(theta_j-theta_i-alpha) + u_i] + sqrt(dt)(Pi sigma_ext xi + sigma_inj eta); u_i = spark-gap trace feedback',
 'uniqueness_proven': False, 'bounded_growth': True,
 'unfalsifiable_claims_audit': {'consciousness_claim': False, 'mysticism': False, 'universal_efficiency_claim': False},
 'degrees_of_freedom': {'accounted': True, 'count': len(PRE['params'])},
}
claim = dict(claim_id='P4N-TORUS-CELL-V02', title='Torus Cell pattern self-holding test (N=33 Cayley {1,10,15}, Source parameters)',
  hypothesis='With only the Node-33 anchor heartbeat, a sealed cell (Buga attenuation + ouroboros trace + spark gap + recycling) holds a planted phase pattern longer than both the Atlantis baseline and a no-cell twin.',
  empirical_results=emp, pipeline_uri=REPO + '/tree/main/torus_cell', data_uri=REPO + '/blob/main/torus_cell/RESULTS_P4N-TORUS-CELL-V02.json',
  pipeline_hash=PRE['module_sha256'], timestamp='2026-10-24T16:00:00Z', metadata=meta)
def run(mod, label, inject=False):
    if inject:  # v1's own __main__ placeholder, verbatim body, injected into the module namespace (file untouched)
        def verify_uri_accessible(uri: str) -> bool:
            return uri and "zenodo.org" in uri or "github.com" in uri
        mod.verify_uri_accessible = verify_uri_accessible
    c = mod.ClaimSubmission(**claim); buf = io.StringIO()
    with contextlib.redirect_stdout(buf): rec = mod.execute_adjudication(c)
    d = asdict(rec); d['label'] = label; d['console'] = buf.getvalue()
    diag = []
    for g in ('gate_3_demon_protocol', 'gate_4_helmholtz'):
        f = getattr(mod, g, None)
        if f:
            try: diag.append({k: v for k, v in asdict(f(c)).items() if k != 'timestamp'})
            except Exception as e: diag.append({'gate': g, 'error': repr(e)})
    d['diagnostic_gates_3_5_standalone_NOT_A_VERDICT'] = diag
    return d
out = {'claim': claim, 'receipts': [run(v1, 'SEAS v1 verbatim, imported (as shipped)'),
        run(load('seas_v1b', os.path.join(HERE, 'seas_v1.py')), 'SEAS v1 verbatim + its own __main__ placeholder injected', inject=True),
        run(v11, 'SEAS v1.1 fail-closed')]}
for r in out['receipts']:
    fails = [g['gate_name'] for g in r['gate_results'] if not g['passed']]
    dg = [(g.get('gate_name', g.get('gate')), g.get('passed'), g.get('failures', g.get('error'))) for g in r['diagnostic_gates_3_5_standalone_NOT_A_VERDICT']]
    print(r['label'], '->', r['overall_status'], '| failed:', fails, '| hash:', (r['dual_hash_sha256'] or '""')[:16]); print('   diag:', dg)
json.dump(out, open(os.path.join(HERE, 'SEAS_RECEIPTS_P4N-TORUS-CELL-V02.json'), 'w'), indent=1, default=str)
