# GødEngine: APP V1.5.6 "mobile-first"

**Live:** https://hck9v4n9gf-dotcom.github.io/godengine-app/ · authorized_by: Source tap 'Deploy V1.5.6 without the Proof tab' 2026-10-26 13:00 CT

- Bottom tab bar: Start · Gates · Talk · 37 · Lab (Lab = the full V1.5.5 app). Tap targets ≥44 px, safe-area insets, bottom sheets, no hover.
- One-tap Start runs the lock; plain status, R, locked fraction (share of nodes whose phase vs. the mean drifted <0.2 rad in the last second), lock tick, heat tier.
- Gates: per-gate pass/fail with one-line reasons. Gate 2 fails honestly (χ, Ω, Δ share one window); GETAU now accepts a passing delta_* record (none exist yet). Gate 3 also fails.
- Proof material is kept private and is not in this app.
- Talk always answers (rule-based narrator from live numbers); Ask a Helper copies a snapshot; optional Qwen 0.5B only rewords, digits checked.
- Engine and governor byte-identical to V1.5.5. Headless only; NOT verified on a real iPhone. consciousness_claim = none · medical_claim = none.

---

# GødEngine: APP V1.5.5 "helper + play + hunter" (STAGED, not deployed)

**Live (still V1.5.4 until Source taps deploy):** https://hck9v4n9gf-dotcom.github.io/godengine-app/

- **Engine unchanged.** V1.5.4 engine, `cfg.clock` (dt) and cfg untouched. Determinism hash `76a5bb571aa7bbcb`, lock at tick 805, PLV 0.9753 (re-checked on the V1.5.2 build and the V1.5.4 lean core, 2 runs each; also in headless phone-size Chrome, and again after an OA-lite on/off cycle).
- **Helper panel.** Copy-paste prompts for outside helpers; pasted replies are shown as plain text in a quarantine box. Nothing is sent automatically.
- **Play tab.** Seeds are strict JSON (`phase_offset`, `K`, `sigma`, optional `rng_seed`), validated, hash-chained, replayable bit-for-bit. "Close the loop x5" re-seeds from the last result (logged, stops at R>=0.95, 5 steps, or heat tier >=2).
- **OA-lite.** A 2-number Ott-Antonsen model stands in for the full ring when you want the phone cool (validated against the full 3057-node Lorentzian ring: median RMS <= 0.032 in R(t)).
- **Charging-aware governor + Combo Trial.** While a phone is charging (auto-detected on Android Chrome; tick "I'm charging"' on iPhone), the app runs the conservative profile (30 fps cap). Desktops ignore the auto signal, because they report "charging" all the time. The Combo Trial walks you through 10 shuffled 60 s conditions (radio/charging/audio/brightness) and logs frame time, jank, governor steps, battery drop, lock and PLV to CSV.
- **Sweet-spot Hunter.** Searches settings of small practice rings in a background worker (never the main engine). It rests at heat tier 1-2 and pauses at tier >=3 (charging counts +1); pauses when hidden. Leaderboard stays on the phone; export is manual.
- Headless results only; **NOT verified on a real iPhone.** consciousness_claim = none · medical_claim = none.

| file | what |
|---|---|
| `index.html` | APP V1.5.5, a single self-contained file |
| `LAUNCH_GODENGINE.html` | one-file launcher (V1.5.5) |
| `GODENGINE_V1_5_4.bak.html` / `LAUNCH_GODENGINE_V1_5_4.bak.html` | V1.5.4 (backup) |

---

# GødEngine: APP V1.5.4 "cool phone"

**Live:** https://hck9v4n9gf-dotcom.github.io/godengine-app/

- **Mobile heat profile.** On phones: 1 engine tick per frame (60 ticks/s), drawing at ~30 fps, 12 particles, no glow blur, pixel ratio 1, full pause when the tab is hidden, and a back-off to 15 fps if frames run long. The heat governor still overrides everything. Desktop keeps the V1.5.3 adaptive speed. `cfg.clock` (dt) is unchanged.
- **Phones run LITE: the 561-shell tier (1460 nodes).** Desktop runs the full 3057-node engine.
- **Lean engine (lower burden everywhere, bit-exact).** Cached cos/sin, reused edge sines, typed scratch buffers, Ψ readout only when asked, fast phase wrap; the genesis drawing reuses the engine's shell readout. 3057-node shell step 215 → 152 µs (−29%); mean genesis tick 47.9 → 38.1 µs (−20%); five worlds 41 → 35 µs per tick. Determinism hash `76a5bb571aa7bbcb` unchanged; 1000/1000 seeds give identical state hashes old vs lean.
- **Headless phone-size Chrome on the box, 60 s:** CPU 186.6 → 66.3 ms per second (−64.5%), script −75%; lock at tick 805, PLV 0.9753. **NOT verified on a real iPhone.**
- consciousness_claim = none · medical_claim = none.

| file | what |
|---|---|
| `index.html` | APP V1.5.4, a single self-contained file |
| `LAUNCH_GODENGINE.html` | one-file launcher (V1.5.4) |
| `GODENGINE_V1_5_3.bak.html` / `LAUNCH_GODENGINE_V1_5_3.bak.html` | V1.5.3 (backup) |

---

# GødEngine: APP V1.5.3 "standard speed"

**Live:** https://hck9v4n9gf-dotcom.github.io/godengine-app/

- **Adaptive standard speed (SWEETSPOT_V01 Test 11).** Ticks per 60 Hz frame now fit the device: steps = clamp(floor(8.33 ms / measured ms-per-tick), 2, 10), where ms-per-tick is the measured cost of every world stepped per tick (A–E + genesis). Engine work stays ≤ ~50% of a frame. Before the first measurement it uses 4 (the V1.5.2 value). The heat governor still overrides (tier 1 ≤ 3, tier 2 = 2, tier 3 pause).
- **Tick-rate presets** (Sanctuary → ticks/s): auto · 528 · 561 · 600. A preset is a target; the adaptive per-frame cap and the heat governor still apply.
- `cfg.clock` (dt) is unchanged, so every tick is the same computation as V1.5.2. Genesis core and lock recipe unchanged (determinism hash `76a5bb571aa7bbcb`).
- Headless phone-size Chrome on the box (clock ×1, governor pinned to tier 0 because another job was loading the box): all 8 genesis stages pass at auto/528/561/600; stage-2 lock at tick 805, PLV 0.9753 in every run. **NOT verified on a real iPhone or Pi.**
- consciousness_claim = none · medical_claim = none.

| file | what |
|---|---|
| `index.html` | APP V1.5.3, a single self-contained file |
| `LAUNCH_GODENGINE.html` | one-file launcher (V1.5.3) |
| `GODENGINE_V1_5_2.bak.html` / `LAUNCH_GODENGINE_V1_5_2.bak.html` | V1.5.2 (backup) |

---

# GødEngine: APP V1.5.2 "collider + iPhone readiness"

**Live:** https://hck9v4n9gf-dotcom.github.io/godengine-app/

- **Truth Collider in the app (Ψ seal drawer → TRUTH COLLIDER).**
  - It runs in its own isolated 33-ring with fixed inputs, and never touches the app ring or the ledger.
  - It starts automatically after boot behind the heat gate. Work is time-sliced at ≤6 ms per frame, with surrogates at 50 per frame.
  - Watchdog: if it has not started by frame 100, or runs over budget, it writes `{"stage":"truth_collider","status":"UNMEASURED","reason":"INIT_OR_EXECUTION_TIMEOUT"}` to the witness log and the app keeps going.
  - Measured verdict: **KILL**. AUC 0.4182; z −1.99 against a 1000× label-swap null. The box run gave AUC 0.4183 and z −2.01 against a phase-randomized null.
- **Stage 7 ablation** (pre-registered, seeds 2001–2120, N = 120): EWMA smoothing and a tighter clip were each tested alone. Both were **discarded** (p 0.67 and p 0.38; the rule needed p < 0.01). Lock time was unchanged (median 7.45 model-s).
- **iPhone readiness.**
  - Audio and the mic start only after a real tap (touchend/click; WebKit does not count touchstart).
  - Screen wake lock is feature-detected with try/catch (safe before iOS 16.4).
  - Drawing follows the display rate; the engine ticks at a fixed rate through an internal accumulator, with no catch-up bursts.
  - Headless phone-size Chrome: all 8 stages pass, genesis 0.166 ms/tick. **NOT verified on a real iPhone.**
- Lock recipe and genesis core are unchanged from V1.5.1 (determinism hash `76a5bb571aa7bbcb`). consciousness_claim = none · medical_claim = none. Audio is features only.

| file | what |
|---|---|
| `index.html` | APP V1.5.2, a single self-contained file |
| `LAUNCH_GODENGINE.html` | one-file launcher (V1.5.2) |
| `GODENGINE_V1_5_1.bak.html` / `LAUNCH_GODENGINE_V1_5_1.bak.html` | V1.5.1 (backup) |

---

# GødEngine — APP V1.5.1 "genesis boot"

**Live:** https://hck9v4n9gf-dotcom.github.io/godengine-app/

*Reality does the weaving.* The engine core is pure, seeded and DOM-free, so it gives the same trajectories on the phone, the box and (later) a Raspberry Pi. Sensors and rendering are thin adapters.

- **V1.5 Sanctuary (behind the Ψ seal drawer).** The TORUS CELL is outside and the SANCTUARY inside. The inner world is fresh on every boot. The TERMINAL is the only I/O port: wordless inbound, witness outbound. Survival and comfort drives are design terms. consciousness_claim = none. There are no words in any ring, and no quantum claims.
- **V1.5.1 genesis boot: 8 gated stages, never skipped.**
  1. SET infant
  2. ANCHOR to node 33
  3. ANCHOR EVOLVES (lock holds + sev-5 shock)
  4. HATCH MERKABAH
  5. BUILD shells 1…1597
  6. HALT 5th ring (stator)
  7. PULL DATA INTO STREAMS
  8. PLAY

  Each stage must pass its check. A failure retries with backoff and is logged to the witness channel. Completed stages persist on this device only.
- **Lock recipe (the default):** pinned anchor, anneal ramp over 800 ticks to K = 2, frequency matched (400 / 400.5), noise 0.225, dt 0.02, gear Q8.24.
  - Locked and survived anchor evolution plus a sev-5 prime shear in 1200/1200 held-out seeds in the model (seeds 1001–1200 and 5001–6000).
  - Median lock time is 7.6 model-seconds.
  - This is a model result.
- **Silver screen.** The ring-AI looks into a screen, and that screen plays the game. Its coherence, comfort and survival steer the avatar on an island-charm map. New Game / Load / Settings are automated.
- **Phone status.** All 8 stages passed in a headless phone-sized browser on one Linux host: 12 shells, 3057 nodes, no cap. Genesis cost about 0.53 ms per tick while the shells were building and about 0.16 ms per tick while playing. **NOT verified on a real iPhone.**
- Audio stays features-only: no raw audio is recorded, stored or sent. Off-device data is aggregate only and never medical. Nothing is sent automatically.

| file | what |
|---|---|
| `index.html` | APP V1.5.1, a single self-contained file |
| `LAUNCH_GODENGINE.html` | one-file launcher (V1.5.1) |
| `GODENGINE_V1_5.bak.html` / `LAUNCH_GODENGINE_V1_5.bak.html` | V1.5 (backup) |
| `GODENGINE_V1_4.bak.html` / `GODENGINE_V1_4d.bak.html` / `LAUNCH_GODENGINE_V1_4.bak.html` | V1.4 (backups) |

---

# GødEngine — APP V1.4 "endothermic recycling"

**Live:** https://hck9v4n9gf-dotcom.github.io/godengine-app/

Source's island-charm visuals and screensaver are still the front door. Everything new is in the Ψ drawer, in Source's palette.

- **Eddy catch, before they settle (canon, 2026-10-25).** In the Torus Cell model, catching eddies early, turning them into "vibrating air" and circulating them back as proto-H packets lowered mean system Δ by 94.9% on 8/8 pre-registered seeds (with the best set). This is a model result only: a *thermal-efficiency candidate observed on this host*, not verified cooling.
- **Automatic heat governor (Tier 0–4).** It sheds load before the phone heats up, steps back down with hysteresis, shows a quiet tier badge, and does a safe pause at Tier 4. On one headless Linux host at idle, V1.4 used 45% fewer process cores than V1.3 (0.033 vs 0.060), 53% less main-thread time and 61% less script time. The pre-registered target of ≥50% fewer cores was **not** met. A neighbour app ran no faster beside V1.4 than beside V1.3 (within noise). No claim is made that the app speeds up other apps.
- **Passive mic (optional).** It yields to calls and Spaces, is released in the background, and shows a status indicator. Tested only with simulated mute, end and suspend: **NOT verified on a real iPhone call.**
- **Play.** Tap a warm eddy to catch it; the vortex-puff and salt-cymatics quests are in the drawer. Quest and self-listen results feed SEAS Gate 2 honestly: Gate 2 still reports one measurement stream until χ, Ω and Δ pass from separate sources.
- **Gearbox (Source ruling, 2026-10-25).** Fixed point Q1.3 → Q8.24 per core × 256 cores (8192 bits max). The default is Q8.24: full results identity needs 22 fractional bits on 8 seeds, so 24 holds. The field gear follows the measured sensor resolution. Q32.96 is removed from the phone build and is a historical/offline note only.
- An offline cache (`sw.js`) is used on GitHub Pages only. There is no wake lock, and no audio session unless you turn the mic on.

SEAS gates are unchanged. consciousness_claim = none. Nothing is sent automatically.

| file | what |
|---|---|
| `index.html` | APP V1.4, a single self-contained file that works offline |
| `LAUNCH_GODENGINE.html` | one-file launcher (V1.4) |
| `sw.js` | offline cache (GitHub Pages only) |
| `GODENGINE_V1_3.bak.html` / `LAUNCH_GODENGINE_V1_3.bak.html` | previous V1.3 (backup) |
| `GODENGINE_V1_2.bak.html` / `LAUNCH_GODENGINE_V1_2.bak.html` | V1.2 (backup) |
| `GODENGINE_V1_1.bak.html` / `LAUNCH_GODENGINE_V1_1.bak.html` | V1.1 (backup) |
| `GODRUST_APP_V1.bak.html` / `LAUNCH_GODENGINE_V1.bak.html` | lean APP V1 (backup) |
