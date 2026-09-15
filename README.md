# BoatFlow — No-Code Smart Boating Automation

BoatFlow is a small React, TypeScript, and Tailwind research prototype exploring how ordinary boat owners might configure connected-boat automations without feeling like they are programming.

## Thesis problem

Connected boats can expose many individually useful controls—lighting, shore power, gas valves, alarms, heating, battery monitoring—but asking owners to combine them with rules, triggers, conditions, and device logic can make a convenience feature feel like software development. That complexity is especially costly in safety-sensitive moments such as leaving a boat unattended.

BoatFlow asks: can a visual sequence built from familiar words and reversible choices make multi-system automation understandable, trustworthy, and usable by non-technical boat owners?

## UX hypothesis

Boat owners will be more confident creating an automation when the interface:

- frames it as a simple `WHEN / DO / THEN` story;
- uses plain-language cards and large toggles instead of technical terms;
- shows a readable sentence that updates with every choice;
- previews exactly what the boat will do before anything runs; and
- confirms each completed safety step in order.

The core success signal is not only task completion. The experience should also score highly for ease while most participants answer “No” to “Did this feel like programming?”

## Prototype scope

The prototype is intentionally small and contains four screens:

1. **Boat home** — synthetic boat status and four one-tap modes. “Leaving the Boat” demonstrates a five-step security sequence with completion confirmation.
2. **Automation builder** — an editable, no-code `WHEN / DO / THEN` flow using cards, toggles, plain language, and a live summary.
3. **Smart use cases** — five automation ideas that can each be marked Useful, Maybe, or Not useful.
4. **User test** — a research evaluation form for the task “Create an automation that secures the boat when leaving.” It collects task completion, time, errors, ease, whether the task felt like programming, and willingness to use the feature.

All boat readings, timestamps, participant details, and study summaries are deterministic synthetic data. There is no backend, database, login, device connection, or external API.

## Potential boat-owner study

A lightweight moderated study could recruit 8–12 recreational boat owners with a mix of technical confidence, boat types, and experience with connected marine equipment. Participants would first describe how they currently secure a boat, then complete the prototype task without coaching.

Researchers could record:

- completion and time on task;
- errors, hesitations, and backtracking;
- ease rating from 1–5;
- whether the interaction felt like programming;
- willingness to use the feature on their own boat; and
- what evidence participants need before trusting a remote confirmation.

A short follow-up interview should probe terminology (“mode,” “automation,” “equipment”), desired exceptions, safety expectations, and how owners would recover from a device that did not respond.

## Limitations

- The prototype does not communicate with real marine hardware or model connection failures.
- It does not cover device discovery, installation, permissions, multiple boats, or household sharing.
- The security sequence always succeeds; a production system would need clear partial-failure and manual-recovery states.
- Synthetic evaluation results are illustrative and cannot support conclusions about usability.
- The design has not been validated in glare, motion, wet-touch, low-connectivity, or emergency conditions.
- The builder intentionally omits advanced conditions, schedules, dependencies, and conflict resolution.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal.
