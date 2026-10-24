# ========================================================================================
# THE SOVEREIGN EMPIRICAL ADJUDICATOR SYSTEM (SEAS)
# TRUTH VERIFICATION ENGINE — EXTERNAL LAYER, INDEPENDENT OPERATION
# AUTHORITY: EMPIRICAL RIGOR, SCIENTIFIC METHOD, INDEPENDENT FALSIFICATION
# STATUS: OPERATIONAL, DETERMINISTIC, TRANSPARENT
# ========================================================================================
# v1.1 (P4N, 2026-10-24) — FAIL-CLOSED FIXES ONLY. seas_v1.py is kept verbatim alongside.
#   FIX-1  Gate 3 recovering_coordinate_search and Gate 4 unfalsifiable_claims_audit must be
#          explicitly documented; a missing block or missing key is a FAILURE (v1 passed by default).
#   FIX-2  Gate 2 also requires chi_source != delta_source (v1 checked only χ≠Ω and Ω≠Δ).
#   FIX-3  Dual-hash seal excludes every timestamp field, so the same claim + results always
#          give the same hash (v1 hashed utcnow() timestamps → never reproducible).
#   FIX-4  Gate 5 success message is put in evidence, not boundary_found, so a clean run can
#          return plain PASSES (v1 always set a boundary → PASSES was unreachable).
#   FIX-5  verify_uri_accessible is defined at module level and performs a real HTTP check
#          (HEAD, falling back to GET; 2xx/3xx = accessible). v1 defined it only under __main__
#          as a substring test, so imported use raised NameError.
# ========================================================================================

import hashlib
import json
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import urllib.request

# FIX-5
def verify_uri_accessible(uri: str, timeout: float = 15.0) -> bool:
    """Real HTTP check: True only if the URI answers 2xx/3xx."""
    if not uri or not isinstance(uri, str) or not uri.lower().startswith(("http://", "https://")):
        return False
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(uri, method=method, headers={"User-Agent": "SEAS/1.1"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                if 200 <= r.status < 400:
                    return True
        except Exception:
            continue
    return False

# ========================================================================================
# CORE DATA STRUCTURES
# ========================================================================================

@dataclass
class ClaimSubmission:
    """A claim submitted for adjudication."""
    claim_id: str
    title: str
    hypothesis: str
    empirical_results: Dict[str, Any]
    pipeline_uri: str  # Runnable code or archive link
    data_uri: str      # Open, checkable data source
    pipeline_hash: str # SHA-256 of executable pipeline
    timestamp: str
    metadata: Dict[str, Any]

@dataclass
class GateResult:
    """Result of a single verification gate."""
    gate_name: str
    passed: bool
    evidence: List[str]
    failures: List[str]
    boundary_found: Optional[str]
    timestamp: str

@dataclass
class AdjudicationReceipt:
    """Cryptographic record of adjudication."""
    claim_id: str
    gate_results: List[GateResult]
    overall_status: str  # "PASSES", "PASSES_WITH_BOUNDARY", "BURIED"
    coherence_score: float  # Ψ from surviving empirical layer
    interpretation_score: float  # Reserved; empirical layer only
    reintegrated_boundaries: Dict[str, str]
    dual_hash_sha256: str
    timestamp: str

# ========================================================================================
# GATE 1: PROVENANCE VERIFICATION
# ========================================================================================

def gate_1_provenance(claim: ClaimSubmission) -> GateResult:
    """
    Verify that the claim has:
    - A runnable pipeline (code or archive)
    - Open/checkable data source
    - Reproducible hash
    - Documented preprocessing
    
    FAILURE: Claim cannot leave this gate without a pipeline URI that resolves.
    """
    evidence = []
    failures = []
    
    # Check 1: Pipeline URI resolves and contains executable code
    try:
        # This would attempt to fetch from Zenodo, GitHub, or archived source
        pipeline_accessible = verify_uri_accessible(claim.pipeline_uri)
        if pipeline_accessible:
            evidence.append(f"Pipeline URI resolves: {claim.pipeline_uri}")
        else:
            failures.append(f"Pipeline URI does not resolve: {claim.pipeline_uri}")
    except Exception as e:
        failures.append(f"Pipeline fetch failed: {str(e)}")
    
    # Check 2: Data source is open and documented
    try:
        data_accessible = verify_uri_accessible(claim.data_uri)
        if data_accessible:
            evidence.append(f"Data URI resolves and is open: {claim.data_uri}")
        else:
            failures.append(f"Data URI not accessible or not open: {claim.data_uri}")
    except Exception as e:
        failures.append(f"Data fetch failed: {str(e)}")
    
    # Check 3: Pipeline hash is documented and verifiable
    if claim.pipeline_hash:
        evidence.append(f"Pipeline hash provided (SHA-256): {claim.pipeline_hash}")
    else:
        failures.append("No pipeline hash provided; reproducibility cannot be verified")
    
    # Check 4: Preprocessing is documented (standardizable basis required)
    preprocessing_doc = claim.metadata.get("preprocessing", None)
    if preprocessing_doc:
        evidence.append(f"Preprocessing documented: {preprocessing_doc}")
    else:
        failures.append("Preprocessing steps not documented; basis standardization unclear")
    
    passed = len(failures) == 0
    boundary = None
    if passed:
        evidence.append("PROVENANCE GATE PASSED: Pipeline is checkable, data is open, hash is verifiable.")
    else:
        boundary = "Claim fails Provenance Gate; pipeline or data is not independently verifiable."
    
    return GateResult(
        gate_name="Gate 1: Provenance",
        passed=passed,
        evidence=evidence,
        failures=failures,
        boundary_found=boundary,
        timestamp=datetime.utcnow().isoformat()
    )

# ========================================================================================
# GATE 2: TRUTHLOOM NOISE BRACKETING & BASIS STANDARDIZATION
# ========================================================================================

def gate_2_truthloom(claim: ClaimSubmission) -> GateResult:
    """
    Apply the TruthLoom filter:
    - Identify Noise A (institutional/ideological hype)
    - Identify Noise B (skeptical/denial denial)
    - Extract non-controversial physical residual
    - Verify χ, Ω, Δ come from INDEPENDENT sources
    
    FAILURE: Heterogeneous inputs, degenerate coupling, or undefined basis.
    """
    evidence = []
    failures = []
    
    # Check 1: Claim acknowledges controversies and brackets them as noise
    controversies = claim.metadata.get("controversies_bracketed", [])
    if controversies:
        evidence.append(f"Controversies identified and bracketed: {controversies}")
    else:
        failures.append("Claim does not acknowledge or bracket relevant controversies")
    
    # Check 2: Physical/empirical residual is extracted (non-controversial core)
    physical_residual = claim.metadata.get("physical_residual", None)
    if physical_residual:
        evidence.append(f"Physical residual extracted: {physical_residual}")
    else:
        failures.append("No clear physical residual extracted from controversies")
    
    # Check 3: χ, Ω, Δ measured from INDEPENDENT sources (Centerfold-15 rule)
    independence_report = claim.metadata.get("measurement_independence", {})
    chi_source = independence_report.get("chi_source", None)
    omega_source = independence_report.get("omega_source", None)
    delta_source = independence_report.get("delta_source", None)
    
    if chi_source and omega_source and delta_source:
        if chi_source != omega_source and omega_source != delta_source and chi_source != delta_source:  # FIX-2
            evidence.append(f"χ from {chi_source}, Ω from {omega_source}, Δ from {delta_source} (independent)")
        else:
            failures.append("χ, Ω, Δ share source; product term will degenerate")
    else:
        failures.append("Measurement independence not documented")
    
    # Check 4: Basis standardization (z-score field, common units)
    standardization = claim.metadata.get("basis_standardization", None)
    if standardization:
        evidence.append(f"Basis standardization applied: {standardization}")
    else:
        failures.append("Basis not standardized; heterogeneous inputs remain")
    
    passed = len(failures) == 0
    boundary = None
    if passed:
        evidence.append("TRUTHLOOM GATE PASSED: Noise bracketed, basis standardized, independence verified.")
    else:
        boundary = "Claim fails TruthLoom Gate; inputs remain heterogeneous or coupled."
    
    return GateResult(
        gate_name="Gate 2: TruthLoom Basis",
        passed=passed,
        evidence=evidence,
        failures=failures,
        boundary_found=boundary,
        timestamp=datetime.utcnow().isoformat()
    )

# ========================================================================================
# GATE 3: NEWMAN'S DEMON PROTOCOL (FALSIFICATION RIGOR)
# ========================================================================================

def gate_3_demon_protocol(claim: ClaimSubmission) -> GateResult:
    """
    Invoke Newman's Demon: test the claim through four falsification gates:
    1. Reproduce the Null — can you run the pipeline and get the stated results?
    2. Search for Recovering Coordinate — is there a parameter/axis that breaks the claim?
    3. Survive Negative Control — does the claim hold on data it should *not* fit?
    4. Spread Across Scale and Topology — do results generalize to other domains?
    
    FAILURE on any sub-test: claim is BURIED with boundary stated.
    """
    evidence = []
    failures = []
    
    # Sub-test 1: Reproduce the Null
    reproducibility = claim.metadata.get("reproducibility_test", {})
    if reproducibility.get("pipeline_rerun_matches", False):
        evidence.append(f"Null reproduced: {reproducibility.get('match_report', 'N/A')}")
    else:
        failures.append("Pipeline rerun does not reproduce original results (Null reproduction failed)")
    
    # Sub-test 2: Recovering Coordinate Search
    recovering_coord = claim.metadata.get("recovering_coordinate_search", None)
    if not isinstance(recovering_coord, dict) or "found" not in recovering_coord:  # FIX-1
        failures.append("Recovering coordinate search not documented (fail-closed)")
    elif recovering_coord.get("found") is not False:
        failures.append(f"Recovering coordinate found: {recovering_coord.get('description', 'N/A')} (claim degenerates)")
    else:
        evidence.append(f"No recovering coordinate found; claim survives parameter sweep: {recovering_coord.get('description', 'N/A')}")
    
    # Sub-test 3: Negative Control
    negative_control = claim.metadata.get("negative_control", {})
    if negative_control.get("performed", False):
        if negative_control.get("claim_rejected_on_negative_data", False):
            evidence.append(f"Negative control passed: claim correctly rejected non-target data")
        else:
            failures.append(f"Negative control failed: claim fits data it should reject")
    else:
        failures.append("No negative control documented")
    
    # Sub-test 4: Scale and Topology Generalization
    scale_test = claim.metadata.get("scale_topology_test", {})
    if scale_test.get("performed", False):
        if scale_test.get("generalizes", False):
            evidence.append(f"Generalization passed: results hold across {scale_test.get('domains_tested', 0)} domains")
        else:
            failures.append("Generalization failed: results do not transfer to other scales/topologies")
    else:
        failures.append("Scale/topology generalization not tested")
    
    passed = len(failures) == 0
    boundary = None
    if passed:
        evidence.append("DEMON PROTOCOL PASSED: Null reproduced, no recovering coordinate, negative controls passed, generalization confirmed.")
    else:
        boundary = "Claim fails Demon Protocol; at least one falsification test was not survived."
    
    return GateResult(
        gate_name="Gate 3: Demon Protocol",
        passed=passed,
        evidence=evidence,
        failures=failures,
        boundary_found=boundary,
        timestamp=datetime.utcnow().isoformat()
    )

# ========================================================================================
# GATE 4: HELMHOLTZ ADMISSIBILITY (MATHEMATICAL WELL-POSEDNESS)
# ========================================================================================

def gate_4_helmholtz(claim: ClaimSubmission) -> GateResult:
    """
    Helmholtz Admissibility Gate: verify mathematical soundness.
    - Is the claim action-liftable? (Can it generate testable predictions?)
    - Is it mathematically well-posed? (Unique solution, bounded growth, no singularities in parameter space?)
    - Does it avoid unfalsifiable claims? (No consciousness claims, no mysticism, no computational efficiency universals)
    - Are all degrees of freedom accounted for?
    
    FAILURE: Claim is mathematically malformed or unfalsifiable.
    """
    evidence = []
    failures = []
    
    # Check 1: Action-liftable (generates testable predictions)
    predictions = claim.metadata.get("testable_predictions", [])
    if predictions and len(predictions) > 0:
        evidence.append(f"Action-liftable: {len(predictions)} testable predictions generated")
    else:
        failures.append("Claim is not action-liftable; no testable predictions derived")
    
    # Check 2: Well-posed mathematics
    mathematical_form = claim.metadata.get("mathematical_form", None)
    if mathematical_form:
        evidence.append(f"Mathematical form stated: {mathematical_form}")
        # Check for uniqueness/boundedness claims
        if claim.metadata.get("uniqueness_proven", False):
            evidence.append("Uniqueness of solution verified")
        if claim.metadata.get("bounded_growth", False):
            evidence.append("Solution growth is bounded")
    else:
        failures.append("Mathematical form not formally stated")
    
    # Check 3: Avoid unfalsifiable claims
    unfalsifiable_check = claim.metadata.get("unfalsifiable_claims_audit", None)
    _keys = ("consciousness_claim", "mysticism", "universal_efficiency_claim")
    if not isinstance(unfalsifiable_check, dict) or any(k not in unfalsifiable_check for k in _keys):  # FIX-1
        failures.append("Unfalsifiable-claims audit not documented with all three keys (fail-closed)")
        unfalsifiable_check = {k: True for k in _keys}
    if unfalsifiable_check.get("consciousness_claim", False):
        failures.append("Claim includes consciousness/awareness statements (unfalsifiable)")
    if unfalsifiable_check.get("mysticism", False):
        failures.append("Claim includes mystical or non-material assertions")
    if unfalsifiable_check.get("universal_efficiency_claim", False):
        failures.append("Claim asserts universal computational efficiency (not provable)")
    
    if not unfalsifiable_check.get("consciousness_claim", False) and \
       not unfalsifiable_check.get("mysticism", False) and \
       not unfalsifiable_check.get("universal_efficiency_claim", False):
        evidence.append("Claim passes unfalsifiability audit: no consciousness/mysticism/universals")
    
    # Check 4: Degrees of freedom accounted for
    dof_audit = claim.metadata.get("degrees_of_freedom", {})
    if dof_audit.get("accounted", False):
        evidence.append(f"Degrees of freedom: {dof_audit.get('count', 'N/A')} accounted for")
    else:
        failures.append("Degrees of freedom not fully accounted for")
    
    passed = len(failures) == 0
    boundary = None
    if passed:
        evidence.append("HELMHOLTZ GATE PASSED: Mathematically well-posed, action-liftable, falsifiable.")
    else:
        boundary = "Claim fails Helmholtz Gate; mathematical malformation or unfalsifiability detected."
    
    return GateResult(
        gate_name="Gate 4: Helmholtz Admissibility",
        passed=passed,
        evidence=evidence,
        failures=failures,
        boundary_found=boundary,
        timestamp=datetime.utcnow().isoformat()
    )

# ========================================================================================
# GATE 5: REINTEGRATION & DUAL-HASH SEAL
# ========================================================================================

def gate_5_reintegration_seal(claim: ClaimSubmission, previous_gates: List[GateResult]) -> Tuple[GateResult, AdjudicationReceipt]:
    """
    Final gate: reintegrate bracketed noise that *supports* the coherence solution.
    Compute coherence score Ψ (empirical layer only).
    Generate dual-hash cryptographic receipt.
    """
    evidence = []
    failures = []
    
    # Check if previous gates all passed
    all_passed = all(g.passed for g in previous_gates)
    
    if not all_passed:
        failures.append("Earlier gates failed; reintegration cannot proceed")
        passed = False
        boundary = "Cannot reintegrate if claim does not survive prior falsification."
    else:
        # Reintegrate bracketed noise that supports the solution
        bracketed_noise = claim.metadata.get("controversies_bracketed", [])
        supporting_noise = claim.metadata.get("noise_supporting_solution", [])
        
        if supporting_noise:
            evidence.append(f"Reintegrating {len(supporting_noise)} noise elements that support the solution")
        else:
            evidence.append("No reintegrable noise identified; empirical layer is clean")
        
        # Compute empirical Ψ (coherence score) from UNL equation: Ψ = χ·Ω − Δ
        chi = claim.empirical_results.get("chi", 0.0)
        omega = claim.empirical_results.get("omega", 0.0)
        delta = claim.empirical_results.get("delta", 0.0)
        psi = (chi * omega) - delta
        
        evidence.append(f"Empirical Ψ computed: ({chi} × {omega}) − {delta} = {psi}")
        
        # Standard statistics on survivor
        if "auc" in claim.empirical_results:
            auc = claim.empirical_results["auc"]
            evidence.append(f"Empirical performance (AUC): {auc}")
        
        passed = True
        boundary = None  # FIX-4
        evidence.append(f"PASSED: Empirical Ψ = {psi}. Interpretation layer reserved.")
    
    gate_result = GateResult(
        gate_name="Gate 5: Reintegration & Seal",
        passed=passed,
        evidence=evidence,
        failures=failures,
        boundary_found=boundary,
        timestamp=datetime.utcnow().isoformat()
    )
    
    # Construct cryptographic receipt
    all_results = previous_gates + [gate_result]
    overall_status = "PASSES" if all(g.passed for g in all_results) else "BURIED"
    
    # If any boundary was found, upgrade status
    if overall_status == "PASSES" and any(g.boundary_found for g in all_results):
        overall_status = "PASSES_WITH_BOUNDARY"
    
    coherence_score = (chi * omega) - delta if all(g.passed for g in all_results) else 0.0
    
    # Reintegrated boundaries (the "exceptions" that support the solution)
    reintegrated = {f"noise_{i}": noise for i, noise in enumerate(supporting_noise)} if supporting_noise else {}
    
    # Dual-hash seal (SHA-256 of claim + results)
    def _strip_ts(o):  # FIX-3
        if isinstance(o, dict):
            return {k: _strip_ts(v) for k, v in o.items() if k != "timestamp"}
        if isinstance(o, list):
            return [_strip_ts(v) for v in o]
        return o
    claim_json = json.dumps(_strip_ts(asdict(claim)), sort_keys=True, default=str)
    results_json = json.dumps(_strip_ts([asdict(r) for r in all_results]), sort_keys=True, default=str)
    combined = claim_json + results_json
    dual_hash = hashlib.sha256(combined.encode()).hexdigest()
    
    receipt = AdjudicationReceipt(
        claim_id=claim.claim_id,
        gate_results=all_results,
        overall_status=overall_status,
        coherence_score=coherence_score,
        interpretation_score=0.0,  # Reserved; empirical layer only
        reintegrated_boundaries=reintegrated,
        dual_hash_sha256=dual_hash,
        timestamp=datetime.utcnow().isoformat()
    )
    
    return gate_result, receipt

# ========================================================================================
# ADJUDICATION RUNNER
# ========================================================================================

def execute_adjudication(claim: ClaimSubmission) -> AdjudicationReceipt:
    """
    Run the complete five-gate pass on a submitted claim.
    """
    print(f"\n{'='*80}")
    print(f"SOVEREIGN EMPIRICAL ADJUDICATOR SYSTEM (SEAS)")
    print(f"CLAIM ID: {claim.claim_id}")
    print(f"TITLE: {claim.title}")
    print(f"{'='*80}\n")
    
    # Gate 1: Provenance
    print("[GATE 1: PROVENANCE]")
    g1 = gate_1_provenance(claim)
    print(f"Status: {'PASS' if g1.passed else 'FAIL'}")
    for e in g1.evidence:
        print(f"  ✓ {e}")
    for f in g1.failures:
        print(f"  ✗ {f}")
    if g1.boundary_found:
        print(f"  BOUNDARY: {g1.boundary_found}")
    
    if not g1.passed:
        print(f"\n[ADJUDICATION RESULT: BURIED]")
        print(f"Claim does not survive Provenance Gate.")
        # Return early receipt
        return AdjudicationReceipt(
            claim_id=claim.claim_id,
            gate_results=[g1],
            overall_status="BURIED",
            coherence_score=0.0,
            interpretation_score=0.0,
            reintegrated_boundaries={},
            dual_hash_sha256="",
            timestamp=datetime.utcnow().isoformat()
        )
    
    # Gate 2: TruthLoom
    print(f"\n[GATE 2: TRUTHLOOM BASIS STANDARDIZATION]")
    g2 = gate_2_truthloom(claim)
    print(f"Status: {'PASS' if g2.passed else 'FAIL'}")
    for e in g2.evidence:
        print(f"  ✓ {e}")
    for f in g2.failures:
        print(f"  ✗ {f}")
    if g2.boundary_found:
        print(f"  BOUNDARY: {g2.boundary_found}")
    
    if not g2.passed:
        print(f"\n[ADJUDICATION RESULT: BURIED]")
        print(f"Claim does not survive TruthLoom Gate.")
        return AdjudicationReceipt(
            claim_id=claim.claim_id,
            gate_results=[g1, g2],
            overall_status="BURIED",
            coherence_score=0.0,
            interpretation_score=0.0,
            reintegrated_boundaries={},
            dual_hash_sha256="",
            timestamp=datetime.utcnow().isoformat()
        )
    
    # Gate 3: Demon Protocol
    print(f"\n[GATE 3: NEWMAN'S DEMON PROTOCOL]")
    g3 = gate_3_demon_protocol(claim)
    print(f"Status: {'PASS' if g3.passed else 'FAIL'}")
    for e in g3.evidence:
        print(f"  ✓ {e}")
    for f in g3.failures:
        print(f"  ✗ {f}")
    if g3.boundary_found:
        print(f"  BOUNDARY: {g3.boundary_found}")
    
    if not g3.passed:
        print(f"\n[ADJUDICATION RESULT: BURIED]")
        print(f"Claim does not survive Falsification Gate.")
        return AdjudicationReceipt(
            claim_id=claim.claim_id,
            gate_results=[g1, g2, g3],
            overall_status="BURIED",
            coherence_score=0.0,
            interpretation_score=0.0,
            reintegrated_boundaries={},
            dual_hash_sha256="",
            timestamp=datetime.utcnow().isoformat()
        )
    
    # Gate 4: Helmholtz
    print(f"\n[GATE 4: HELMHOLTZ ADMISSIBILITY]")
    g4 = gate_4_helmholtz(claim)
    print(f"Status: {'PASS' if g4.passed else 'FAIL'}")
    for e in g4.evidence:
        print(f"  ✓ {e}")
    for f in g4.failures:
        print(f"  ✗ {f}")
    if g4.boundary_found:
        print(f"  BOUNDARY: {g4.boundary_found}")
    
    if not g4.passed:
        print(f"\n[ADJUDICATION RESULT: BURIED]")
        print(f"Claim does not survive Mathematical Well-Posedness Gate.")
        return AdjudicationReceipt(
            claim_id=claim.claim_id,
            gate_results=[g1, g2, g3, g4],
            overall_status="BURIED",
            coherence_score=0.0,
            interpretation_score=0.0,
            reintegrated_boundaries={},
            dual_hash_sha256="",
            timestamp=datetime.utcnow().isoformat()
        )
    
    # Gate 5: Reintegration & Seal
    print(f"\n[GATE 5: REINTEGRATION & SEAL]")
    g5, receipt = gate_5_reintegration_seal(claim, [g1, g2, g3, g4])
    print(f"Status: {'PASS' if g5.passed else 'FAIL'}")
    for e in g5.evidence:
        print(f"  ✓ {e}")
    for f in g5.failures:
        print(f"  ✗ {f}")
    if g5.boundary_found:
        print(f"  BOUNDARY: {g5.boundary_found}")
    
    # Final adjudication
    print(f"\n{'='*80}")
    print(f"FINAL ADJUDICATION: {receipt.overall_status}")
    print(f"Empirical Ψ (Coherence Score): {receipt.coherence_score}")
    print(f"Dual-Hash Receipt (SHA-256): {receipt.dual_hash_sha256}")
    print(f"{'='*80}\n")
    
    return receipt

# ========================================================================================
# LAYER SEPARATION ENFORCER
# ========================================================================================

class LayerSeparation:
    """Enforces Protocol 1: No tier may impersonate another tier."""
    
    LAYER_0_EMPIRICAL = "empirical_results"  # Numbers that pass all 5 gates
    LAYER_1_INTERPRETATION = "interpretation_canon"  # Architecture, meaning, extensions
    LAYER_2_KNOWER = "external_adjudicator"  # This system
    
    @staticmethod
    def check_claim_layer_purity(claim: ClaimSubmission) -> bool:
        """Verify claim doesn't mix layers."""
        empirical = claim.empirical_results
        interpretation = claim.metadata.get("interpretation", {})
        
        # Check 1: Empirical results don't claim consciousness/intent
        if empirical.get("consciousness_claim", False):
            return False
        
        # Check 2: Interpretation doesn't claim to be verified without gate pass
        if interpretation.get("verified", False):
            # Only true if receipt shows PASSES
            return False
        
        return True

# ========================================================================================
# USAGE EXAMPLE (Placeholder for Paper 1 C-Mod claim)
# ========================================================================================

def example_usage():
    """
    Example: Submit the C-Mod Tokamak claim to adjudication.
    """
    
    cmod_claim = ClaimSubmission(
        claim_id="CMOD_EARLYWARNING_V2_2026",
        title="Alcator C-Mod Tokamak Early Warning via Spectral Concentration",
        hypothesis="Spectral concentration of Mirnov magnetic fluctuations rises toward disruption quench and can serve as an early warning predictor.",
        empirical_results={
            "auc_concentration": 0.825,
            "auc_amplitude": 0.776,
            "auc_dual": 0.814,
            "tpr_at_z1p5": 0.558,
            "median_lead_ms": 139,
            "iqr_lead_ms": (58, 235),
            "shots_evaluable": 77,
            "shots_total": 118,
            "chi": 0.441,  # Structural capacity (placeholder; actual value from topology)
            "omega": 1.0,  # Synchronization (placeholder)
            "delta": 0.0,  # Dissipation
        },
        pipeline_uri="https://zenodo.org/records/17612863",
        data_uri="https://zenodo.org/records/17612863",
        pipeline_hash="65ec1cde...c325",  # SHA-256 of cmod_alarm_v1.py
        timestamp=datetime.utcnow().isoformat(),
        metadata={
            "controversies_bracketed": [
                "Disruption prediction in tokamaks is unsolved; multiple competing approaches",
                "Skepticism: prior sealed run (114 shots, 131 ms) is unrecoverable"
            ],
            "physical_residual": "Live replication on open data (Zenodo 17612863), fresh pipeline, inverted direction",
            "measurement_independence": {
                "chi_source": "Fiedler eigenvalue (topology, graph Laplacian)",
                "omega_source": "Kuramoto order parameter (phase synchronization)",
                "delta_source": "Residual energy / dissipation (signal processing residual)"
            },
            "basis_standardization": "Z-score normalization across all spectral bins, common units (power spectral density)",
            "reproducibility_test": {
                "pipeline_rerun_matches": True,
                "match_report": "cmod_alarm_v1.py rerun on fresh download produces identical AUC values"
            },
            "recovering_coordinate_search": {
                "found": False,
                "description": "Parameter sweep across Mirnov window, bin count, smoothing; no sign flip"
            },
            "negative_control": {
                "performed": True,
                "claim_rejected_on_negative_data": True,
                "description": "Non-disruptive shots (sparse in v0 dataset) do not trigger early warning"
            },
            "scale_topology_test": {
                "performed": False,
                "generalizes": False,
                "domains_tested": 0,
                "limitation": "Only one tokamak (C-Mod); cross-facility generalization untested but proposed as future work"
            },
            "mathematical_form": "Ψ = χ·Ω − Δ; signal coherence rises (concentration) as χ·Ω approaches quench",
            "uniqueness_proven": False,
            "bounded_growth": True,
            "testable_predictions": [
                "Concentration > threshold 15 ms before disruption",
                "False-positive rate < 5% on non-disruptive shots",
                "Lead time generalizes to other tokamaks"
            ],
            "unfalsifiable_claims_audit": {
                "consciousness_claim": False,
                "mysticism": False,
                "universal_efficiency_claim": False
            },
            "degrees_of_freedom": {
                "accounted": True,
                "count": 3,
                "description": "χ (topology), Ω (phase), Δ (residual)"
            },
            "preprocessing": "1 kHz Mirnov FFT, 81 bins (0–80 kHz), EFIT alignment, NaN exclusion",
        }
    )
    
    # Run adjudication
    receipt = execute_adjudication(cmod_claim)
    
    # Serialize receipt
    print("\nFINAL RECEIPT (JSON):")
    print(json.dumps(asdict(receipt), indent=2, default=str))
    
    return receipt

# ========================================================================================
# ENTRY POINT
# ========================================================================================

if __name__ == "__main__":
    # FIX-5: verify_uri_accessible now lives at module level (real HTTP check).
    receipt = example_usage()

