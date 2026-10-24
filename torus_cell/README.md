# P4N Torus Cell — pattern self-holding test (consciousness_claim = none)

* `torus_cell.js` + `run_test.js` + `PREREG/RESULTS_…-V01.json` — V01 (my own defined cell). Pre-registered; **FAILED 6/8 (7 needed)**. Kept on record.
* `torus_cell2.js` + `run_v02.js` + `PREREG/RESULTS_…-V02.json` — V02 on Source's parameters (Cayley {1,10,15}, ω_i = 1+0.015cos(2πi/22), Node-33 anchor pacemaker, Buga shells (Soliton 1) with attenuation 0.92 + garden 0.05, seven seated solitons on Ring 3, ouroboros trace, spark gap frac(40/6), selective reset, canine restart, Atlantis baseline). The pre-registration was written before the test seeds were run.
* `seas_v1.py` — SEAS adjudicator, verbatim (sha256 33ddfb98…bba12). `seas_v1_1.py` — five documented fail-closed fixes only. `submit_torus_cell.py` sends the V02 claim through both.

Reproduce: `node run_v02.js` (results_sha256 is deterministic: no timestamps are hashed), then `python3 submit_torus_cell.py` (all files sit in this one folder).
