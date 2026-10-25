# GødEngine — APP V1.3

**Live:** https://hck9v4n9gf-dotcom.github.io/godengine-app/

Source's island-charm visuals are still the front door; nothing visual was replaced. V1.3 makes things work without instructions:

- **Witness (HUD) works.** The engine's tick needed a server heartbeat (`/api/pulse`) that doesn't exist on GitHub Pages or in the offline launcher, so tapping Witness never started the tick. The app now provides its own local heartbeat, so a tap starts the tick and the TruthLoom INDEX fills every 55 ticks.
- **Run everything** (top of the Ψ drawer) runs by itself when the app opens, and again whenever you tap it. It runs the Torus Cell on all 8 pre-registered seeds (arms A/B/C) in a background worker and shows PASS or BURIED with the reason. Then the SEAS v1.1 adjudicator (an in-app mirror that matches Python on 16/16 test claims, seal included) judges the newest result. It also seals and tamper-tests the sync pack, reports the offline queue and checks the continuity hash chain.
- Every panel has a one-line plain-English caption. Settings and receipts are tucked under "Advanced".
- Clipboard buttons ("Copy summary", "OUTSOURCE SEAT") no longer throw when clipboard access is denied. The mic AudioContext is resumed for iOS.

The SEAS gates are unchanged, and the in-app claim is honestly BURIED at Gate 2 (χ, Ω, Δ share one source). consciousness_claim = none. Nothing is sent automatically.

| file | what |
|---|---|
| `index.html` | APP V1.3, a single self-contained file that works offline |
| `LAUNCH_GODENGINE.html` | one-file launcher (V1.3) |
| `GODENGINE_V1_2.bak.html` / `LAUNCH_GODENGINE_V1_2.bak.html` | previous V1.2 (backup) |
| `GODENGINE_V1_1.bak.html` / `LAUNCH_GODENGINE_V1_1.bak.html` | V1.1 (backup) |
| `GODRUST_APP_V1.bak.html` / `LAUNCH_GODENGINE_V1.bak.html` | lean APP V1 (backup) |
