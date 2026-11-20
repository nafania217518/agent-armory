# threat-model ← department-of-internal-arguments (improvement)

Sources:
- https://github.com/ChiefGyk3D/department-of-internal-arguments `packs/threat-model/PACK.md` lines 19, 21 @a9d4347 (Apache-2.0, with NOTICE; release 0.4.0)

Status: draft, not adopted

All text is paraphrase; no source text is copied.

## What it brings

The `threat-model` draft's register gets an order. A threat ranks by what an attacker
needs before the attack, so a moderate threat that anyone can reach ranks above a severe
one that needs a credential first. The plan and the user then see the cheapest attack
first.

## Cons

- Changes a draft, so it applies only if `threat-model` is adopted.
- Adds about 3 lines to a 58-line draft; its `max-lines` would rise to 61.
- The rank orders the Risks lines but changes no disposition; its gain is attention, not
  a new control.
- Dropped: the source's verification step (a test that goes red without the control).
  The `threat-model` draft §4 already asks each mitigation `TR` for a `tests:` case that
  tries the threat and fails without the control.

## Proposed changes

### 1. Rank by exploit prerequisite

- Target: `threat-model` draft §4 Register (add bullet after the disposition bullet)
- Text:
  ```
  - Threat lines MUST be ranked by exploit prerequisite first: what an attacker needs
    before the attack (network position, a credential, a merged change). A threat anyone
    can reach MUST rank above one that needs a credential, even at lower impact.
  ```
- Target: `threat-model` draft §4 Register (replace "Done when each threat line has its
  disposition.")
- Text:
  ```
  - Done when each threat line has its disposition and the lines are in rank order.
  ```
- Why: the draft's register has no order, so a severe threat behind a login can take the
  plan's attention from a moderate one open to anyone.
- Evidence needed: a threat register, or a security finding, where an open threat that
  anyone could reach was handled after one that needed a credential.
