# Claude Code Hackathon Harness — Complete Environment & Operator Manual

**Document:** `CLAUDE_HARNESS_OPERATOR_MANUAL.md`  
**Environment:** Claude Code + OpenRouter/free + Agent Skills + MCP + Plugins + Hooks + Memory + project state  
**Primary platforms:** Linux and Windows  
**Repository branches:** `main` = frozen harness; `setup` = portable provisioning branch  
**Operational posture:** free-only model routing, no paid fallback, no account-rotation/quota-evasion, secrets kept machine-local

---

## 0. Purpose of This Document

This is the **operator manual** for the Claude Code environment in this repository.

It explains:

- what the repository contains;
- what the Linux and Windows installers do;
- what is machine-local versus Git-portable;
- how the model path is enforced;
- which Agent Skills are installed and where they come from;
- which Claude Code plugins are part of the environment;
- which MCP servers are attached and what each one is for;
- how the project hooks behave;
- how the specialist agents are used;
- how project rules, skills, state, memory, plugins, MCP and hooks interact;
- how to run a serious engineering workflow without wasting context;
- how to exploit the design/research stack rather than merely having it installed;
- how to recover from free-model quota exhaustion or tool failures;
- how teammates reproduce the environment on Linux and Windows;
- what must never be committed;
- how to verify, diagnose and maintain the system.

The intended usage model is **not** "Claude Code with a pile of extensions." The intended usage model is a layered engineering harness in which each layer has a narrow job:

```text
Project instructions
        ↓
Scoped rules
        ↓
Skills / progressive expertise
        ↓
Specialist agents
        ↓
MCP tools + external knowledge
        ↓
Hooks / deterministic guardrails
        ↓
Memory + execution state
        ↓
Git checkpoints
```

The objective is to make the agent more reliable and more useful while preserving human control over architectural, security and repository decisions.

---

# 1. Executive Architecture

## 1.1 High-level system

```text
                         ┌─────────────────────────┐
                         │       Human Operator    │
                         │ goals / approvals / Git │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      Claude Code        │
                         │   primary agent shell   │
                         └────────────┬────────────┘
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
             ▼                        ▼                        ▼
      CLAUDE.md + rules         Skills + agents          Plugins
      persistent behavior      task-specific expertise  packaged features
             │                        │                        │
             └──────────────┬─────────┴──────────────┬─────────┘
                            │                        │
                            ▼                        ▼
                       MCP servers               Hooks
                  research/design/QA       deterministic controls
                            │                        │
                            └────────────┬───────────┘
                                         ▼
                                Memory + State
                              ┌──────────┴─────────┐
                              │                    │
                         agent-state          Claude-Mem
                       execution truth       observations
                              │                    │
                              └──────────┬─────────┘
                                         ▼
                                      Git
                              feature checkpoints /
                              recovery boundaries
```

## 1.2 Model path

The live model route is intentionally simple:

```text
Claude Code
    │
    ▼
https://openrouter.ai/api
    │
    ▼
openrouter/free
    │
    ▼
currently available OpenRouter free model
```

All primary/default/subagent model environment variables are pointed at:

```text
openrouter/free
```

There is intentionally **no paid fallback** configured in this harness.

There is also intentionally **no local Ollama model in the live path**.

Headroom and OmniRoute may be installed for experimentation, but they are not configured as a gateway, proxy, fallback router or model switch in the production hackathon path.

---

# 2. Git / Branch Architecture

The repository has two important local branches.

## 2.1 `main`

`main` is the frozen baseline harness.

Current frozen commit recorded during setup:

```text
f9c0008 chore: freeze hackathon agent harness
```

This branch represents the harness state before the portable installer refactor.

Do not use `main` as a scratch area for installer experiments.

## 2.2 `setup`

`setup` is the local provisioning/portability branch.

Current commit recorded during setup:

```text
e2ae07b chore: replace one-off bootstrap with portable setup
```

This branch contains:

- `scripts/setup.sh`
- `scripts/setup.ps1`
- `SETUP.md`
- all of the frozen harness inherited from `main`

The setup branch was explicitly intended to remain local and **not be pushed** as part of the original environment procedure.

## 2.3 Why two branches exist

The separation is useful because:

- `main` is the known-good harness snapshot;
- `setup` contains machine bootstrap logic;
- installer changes can be developed independently from the frozen harness;
- a broken installer does not automatically invalidate the known-good harness state;
- teammates can use the setup scripts without needing any of the original one-off bootstrap scripts.

## 2.4 Git recovery strategy

The critical recovery unit is a commit, not memory.

Before meaningful features:

```bash
git status
git add -A
git commit -m "feat: ..."
```

When working with an AI agent, treat commits as **execution checkpoints**.

A good feature loop is:

```text
Plan
  ↓
Implement
  ↓
Test
  ↓
Review
  ↓
Commit
```

If a later model session becomes confused, you can reset or compare against a known checkpoint rather than asking the agent to reconstruct the entire history from context.

---

# 3. Repository Layout

The important project structure is:

```text
Project/
│
├── .claude/
│   ├── agents/
│   ├── hooks/
│   ├── rules/
│   ├── skills/
│   └── settings.json
│
├── agent-state/
│   ├── BLOCKERS.md
│   ├── DECISIONS.md
│   ├── GOAL.md
│   ├── PLAN.md
│   ├── PROGRESS.md
│   ├── SESSION.md
│   └── TASKS.md
│
├── scripts/
│   ├── setup.sh
│   └── setup.ps1
│
├── CLAUDE.md
├── CLAUDE_CODE_HACKATHON_MAXXER_README.md
├── SETUP.md
└── .gitignore
```

## 3.1 `.claude/agents/`

Contains the project's specialist roles.

These are **task executors/reviewers**, not general personality presets.

Current project agents:

| Agent | Primary purpose |
|---|---|
| `architect` | architecture, boundaries, trade-offs, system decomposition |
| `backend-engineer` | backend implementation, APIs, services, data layer |
| `code-reviewer` | code quality and correctness review |
| `frontend-engineer` | UI implementation and frontend architecture |
| `impeccable-asset-producer` | design-system/visual asset production workflows |
| `impeccable-documenter` | documenting visual/design-system decisions |
| `impeccable-finish-reviewer` | visual finishing and quality review |
| `impeccable-manual-edit-applier` | applying deliberate visual/design corrections |
| `researcher` | external research, evidence gathering, comparative analysis |
| `security-reviewer` | security threat review and hardening |
| `test-qa` | testing strategy, QA, regression verification |

### Agent selection principle

Do not ask every specialist to do every task.

Use a role when the task genuinely benefits from a specialist perspective.

Examples:

```text
architecture question       → architect
API/data implementation     → backend-engineer
UI implementation           → frontend-engineer
security-sensitive change   → security-reviewer
regression validation       → test-qa
code review                 → code-reviewer
visual refinement           → Impeccable agents
external investigation      → researcher
```

For small edits, the primary agent can usually handle the task directly.

---

# 4. Project Rules

The project has four key rule files.

```text
.claude/rules/design.md
.claude/rules/free-hackathon.md
.claude/rules/security.md
.claude/rules/stack-routing.md
```

## 4.1 `design.md`

Controls the intended design and visual workflow.

Core concept:

```text
research → references → source of truth → polish → motion → verification
```

The design stack is not meant to be a random collection of tools.

## 4.2 `free-hackathon.md`

Captures the operating constraints for a free-model hackathon environment.

Primary principles include:

- no paid model fallback;
- preserve checkpoints;
- do not expose secrets;
- avoid unnecessary external dependencies;
- recover cleanly from quota/tool failures;
- prioritize shipping over infrastructure churn.

## 4.3 `security.md`

Provides the repository-level security rules.

Typical concerns:

- credentials;
- secrets;
- dangerous shell operations;
- Git destruction;
- unsafe dependency changes;
- external side effects;
- excessive permissions.

## 4.4 `stack-routing.md`

Controls **which subsystem should be used for which job**.

This prevents tool proliferation from becoming tool confusion.

The basic routing logic is:

```text
Need project instruction?  → CLAUDE.md / rules
Need domain procedure?     → Skill
Need specialist execution? → Agent
Need external service?     → MCP
Need deterministic block?  → Hook
Need packaged feature?     → Plugin
Need durable state?        → agent-state / memory
Need recovery?             → Git
```

---

# 5. Project-Local Skills

The current committed project skill layer includes six local skills:

```text
.claude/skills/
├── context-hygiene/
├── demo-hardening/
├── free-model-operations/
├── hackathon-product/
├── impeccable/
└── security-gate/
```

## 5.1 `context-hygiene`

Purpose:

- reduce unnecessary context accumulation;
- keep task state explicit;
- avoid repeating repository facts unnecessarily;
- encourage useful summaries/checkpoints.

Use it when:

- a task has become large;
- multiple subagents have been used;
- a session is approaching compaction;
- requirements are changing rapidly.

## 5.2 `demo-hardening`

Purpose:

- turn a working feature into something suitable for a live demonstration;
- eliminate obvious demo-breaking issues;
- test happy paths and visible failure modes;
- verify startup and runtime conditions.

Use before:

- judging;
- demo recording;
- final presentation;
- hackathon submission.

## 5.3 `free-model-operations`

Purpose:

- preserve the free-only model policy;
- minimize wasteful model calls;
- maintain task checkpoints;
- recover from quota exhaustion without losing work.

This skill is particularly important because the model gateway is intentionally constrained to `openrouter/free`.

## 5.4 `hackathon-product`

Purpose:

- keep implementation tied to hackathon value;
- prevent infrastructure rabbit holes;
- prioritize demonstrable features;
- maintain a coherent MVP boundary.

The presence of a large engineering harness is not permission to build infrastructure for its own sake.

## 5.5 `impeccable`

Purpose:

- visual and interaction refinement;
- design-system consistency;
- layout, typography, hierarchy, spacing and polish;
- visual critique and iteration.

This is the local project copy of the Impeccable workflow.

The committed copy includes extensive reference material and local helper scripts.

## 5.6 `security-gate`

Purpose:

- force a security checkpoint before risky changes;
- identify secrets, insecure assumptions and dangerous operations;
- coordinate with the security reviewer and security plugin.

---

# 6. Global Agent Skills

The environment also installs a large global/shared skill layer through the `skills` CLI.

At the environment snapshot, the machine reported approximately **226 installed shared Agent Skills** under:

```text
~/.agents/skills
```

The exact count is a snapshot, not a compatibility contract. Upstream skill repositories can add, rename or remove skills.

The important architectural point is that the environment installs **skill sources**, not merely a handful of local hand-written prompts.

## 6.1 Skill source repositories

The portable installers pull from these sources:

| Source | Primary role |
|---|---|
| `anthropics/skills` | Anthropic-maintained general engineering and task skills |
| `wshobson/agents` | large engineering/DevOps/backend/frontend specialist skill collection |
| `vercel-labs/agent-skills` | modern web/frontend/Vercel-oriented skills |
| `mobbin/skills` | product/UI reference workflows |
| `referodesign/refero_skill` | design research workflows |
| `senlindesign/taste-skill` | aesthetic/design direction and anti-generic output checks |
| `emilkowalski/skills` | animation/motion/interaction craft |
| `rebelytics/one-skill-to-rule-them-all` | Task Observer-related workflow tooling |
| `microsoft/playwright` | browser automation and testing workflows |
| `upstash/context7` (`find-docs`) | documentation/context retrieval |
```

Impeccable is additionally installed through its own installer rather than being treated only as a generic skills repository.

## 6.2 Why so many skills?

The model does not need to memorize every tool's entire documentation in its base context.

The better pattern is:

```text
User asks for task
       ↓
Agent recognizes task class
       ↓
Relevant skill is selected
       ↓
Skill gives the procedure + references
       ↓
Agent uses MCP/tools only where necessary
```

This is the **progressive disclosure** model.

A skill should act as a router and procedure, not as an encyclopedia injected into every request.

## 6.3 Global skills versus project skills

Global skills:

- available across repositories;
- tied to the user's agent environment;
- not necessarily committed to the project;
- useful across Cursor/Codex/other compatible harnesses.

Project skills:

- committed with the repository;
- define project-specific behavior;
- portable with the project itself;
- can override or specialize generic workflows.

Use project skills for **project policy** and global skills for **general capability**.

---

# 7. Claude Code Plugins

The environment uses Claude Code plugins as packaged capability bundles.

## 7.1 Official Anthropic plugin set

The setup provisions these official plugins:

```text
claude-code-setup
claude-md-management
code-review
code-simplifier
commit-commands
feature-dev
figma
frontend-design
hookify
planning-with-files
plugin-dev
pr-review-toolkit
security-guidance
```

## 7.2 `claude-code-setup`

Useful for:

- Claude Code environment diagnostics;
- setup-related guidance;
- identifying configuration problems.

Use it when the question is about the Claude Code environment itself rather than the product code.

## 7.3 `claude-md-management`

Useful for:

- maintaining `CLAUDE.md`;
- keeping repository instructions coherent;
- improving long-lived agent instructions.

Use it when repeated sessions demonstrate that the agent keeps making the same wrong assumption.

Do not stuff every transient detail into `CLAUDE.md`.

Persistent instructions should be stable and high-value.

## 7.4 `code-review`

Use for systematic source review.

Ideal checkpoint:

```text
feature implemented
        ↓
code-review
        ↓
fix findings
        ↓
test
        ↓
commit
```

## 7.5 `code-simplifier`

Use after a feature works but has accumulated unnecessary complexity.

Typical use cases:

- duplicated abstractions;
- overly complex conditions;
- unnecessary helper layers;
- premature generalization.

Do not run it blindly after every tiny change.

## 7.6 `commit-commands`

Supports disciplined Git checkpoints.

Treat a commit as the boundary between reasoning episodes.

## 7.7 `feature-dev`

Useful for structured implementation of non-trivial features.

It should complement the project plan rather than replace it.

## 7.8 `figma`

Used for design retrieval/inspection and interaction with Figma through the connected Figma MCP.

Figma is the intended **source of truth** once the design direction has been established.

## 7.9 `frontend-design`

Provides frontend design/implementation capabilities.

Important routing rule:

If Refero + Mobbin + Figma + Impeccable have already established an explicit design direction, generic frontend-design should not casually overwrite that direction.

## 7.10 `hookify`

Useful for creating and managing deterministic hook-based behavior.

Hooks are preferable when a rule should be enforced regardless of model intent.

## 7.11 `planning-with-files`

Useful for long multi-step tasks.

This fits naturally with:

```text
agent-state/PLAN.md
agent-state/TASKS.md
agent-state/PROGRESS.md
agent-state/BLOCKERS.md
agent-state/DECISIONS.md
```

Use file-backed planning when a task cannot fit reliably into a single conversational turn.

## 7.12 `plugin-dev`

For developing/debugging Claude Code plugins.

Useful when extending the harness itself.

It is generally not needed while implementing ordinary product features.

## 7.13 `pr-review-toolkit`

Useful before sharing a substantial branch or pull request.

It complements local `code-review` rather than replacing tests.

## 7.14 `security-guidance`

Use for security-sensitive architecture, secrets, authentication, authorization, network boundaries, data validation, dependency exposure and unsafe operations.

## 7.15 Claude-Mem

Claude-Mem is a cross-session project observation/memory layer.

It is intentionally **machine-local**.

It is not the same thing as `agent-state`:

```text
agent-state → explicit current truth
Claude-Mem  → remembered observations across sessions
```

Claude-Mem should not be treated as the canonical place for hard project requirements.

## 7.16 Refero plugin

Provides Refero-specific integration on top of the standalone skill and MCP.

The architecture intentionally has both:

- Refero skill;
- Refero plugin;
- Refero MCP.

They are related but distinct layers.

## 7.17 Impeccable

Impeccable is a design-quality subsystem rather than a generic coding plugin.

It provides a structured visual critique/polish workflow and local helper tooling.

---

# 8. MCP Servers

The environment attaches five primary MCP servers.

| Name | Transport | Endpoint / command | Main purpose |
|---|---|---|---|
| `figma` | HTTP | `https://mcp.figma.com/mcp` | Figma design source of truth |
| `mobbin` | HTTP | `https://api.mobbin.com/mcp` | real-world UI/product references |
| `context7` | HTTP | `https://mcp.context7.com/mcp` | live/reference documentation retrieval |
| `refero` | HTTP | `https://api.refero.design/mcp` | design research and visual references |
| `playwright` | stdio | `npx -y @playwright/mcp@latest` | browser automation and validation |

## 8.1 Figma MCP

Use when:

- you need to inspect a Figma file;
- the design source needs to be read rather than guessed;
- components/tokens/layouts need to be implemented faithfully;
- the product has a formal design source of truth.

Do not use Figma merely to browse for inspiration if Refero/Mobbin are better suited to discovery.

## 8.2 Mobbin MCP

Use for:

- concrete real-world product screens;
- interaction-pattern references;
- onboarding examples;
- information architecture patterns;
- common mobile/web UX conventions.

Mobbin is particularly useful before writing the first UI implementation.

The high-value workflow is:

```text
problem
  ↓
Mobbin examples
  ↓
pattern extraction
  ↓
Figma design
  ↓
implementation
```

## 8.3 Context7 MCP

Use Context7 when the task depends on current or library-specific documentation.

Examples:

- framework API behavior;
- library version-specific configuration;
- SDK usage;
- implementation details that should not be guessed from model memory.

The operational rule is:

> When the exact library API matters, retrieve the documentation instead of improvising.

## 8.4 Refero MCP

Use Refero for design research and reference gathering.

The intended role is broader than a single screenshot lookup:

- visual language discovery;
- component patterns;
- screen comparisons;
- flow references;
- style analysis.

Refero is the top of the design research funnel.

## 8.5 Playwright MCP

Use Playwright for actual browser verification.

High-value tasks:

- open the app;
- inspect rendered UI;
- interact with controls;
- validate navigation;
- test forms;
- verify responsive behavior;
- capture evidence of the current UI;
- reproduce a bug.

Do not confuse Playwright with unit testing. It is primarily an **end-to-end/browser validation surface**.

---

# 9. The Design Intelligence Stack

The design environment should be used as a deliberate pipeline.

```text
                 DESIGN RESEARCH
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
           Refero              Mobbin
              │                   │
              └─────────┬─────────┘
                        ▼
                    synthesis
                        │
                        ▼
                      Figma
                source of truth
                        │
                        ▼
                   implementation
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
      Impeccable                   Taste
     visual quality          design-direction check
           │                         │
           └────────────┬────────────┘
                        ▼
                  Emil motion craft
                        │
                        ▼
                   Playwright
                  rendered QA
```

## 9.1 Why the order matters

A common failure mode in AI-generated interfaces is:

```text
prompt
 ↓
generate generic UI
 ↓
add gradients
 ↓
add animation
 ↓
call it finished
```

This environment is deliberately structured to avoid that.

The intended process is:

```text
research first
→ define visual language
→ establish design source of truth
→ implement
→ critique
→ refine
→ animate only where useful
→ verify in the browser
```

## 9.2 Refero vs Mobbin

Use **Refero** when you are exploring the design space.

Use **Mobbin** when you need concrete product examples and existing interface patterns.

They are complementary, not redundant.

## 9.3 Figma

Use Figma as the explicit reference when a design decision has already been made.

If the agent is repeatedly changing the visual direction during coding, the design source of truth is probably insufficiently established.

## 9.4 Impeccable

Use Impeccable after a complete visual surface exists.

High-value sequence:

```text
implement one coherent screen
        ↓
render it
        ↓
Impeccable critique
        ↓
apply highest-impact corrections
        ↓
render again
```

Do not ask for endless micro-polish before the information architecture is correct.

## 9.5 Taste

Taste acts as an anti-generic-direction layer.

Use it to ask questions such as:

- Is the visual hierarchy intentional?
- Is the composition generic?
- Are colors actually supporting hierarchy?
- Is the interface visually differentiated for a reason?
- Is the design borrowing conventions without becoming a clone?

## 9.6 Emil animation skills

Use motion after the static interface is coherent.

Good motion should clarify:

- state changes;
- hierarchy;
- causality;
- continuity;
- focus.

Do not add motion merely because an animation skill is available.

## 9.7 Playwright

Use Playwright as the final reality check.

Rendered behavior wins over assumptions made from source code.

---

# 10. Hooks

Hooks are one of the most important reliability layers because they are deterministic.

Current project hooks:

```text
.claude/hooks/
├── posttool-state.sh
├── precompact-state.sh
├── pretool-free-guard.sh
└── session-bootstrap.sh
```

## 10.1 `pretool-free-guard.sh`

This is the primary deterministic safety gate.

Its key property is that it can reject dangerous tool invocations without asking the model to "remember" the policy.

The environment was specifically corrected to use the current `PreToolUse` JSON output shape:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "..."
  }
}
```

Normal allowed operations return with no blocking output.

A force-push attempt was explicitly tested during setup and correctly denied.

### Why this matters

Model reasoning is probabilistic. A hook is deterministic.

Use hooks for:

- destructive Git operations;
- known-prohibited commands;
- policy enforcement that must not depend on model compliance.

## 10.2 `posttool-state.sh`

Intended role:

- preserve execution state after tools run;
- keep task progress synchronized with the agent's actions;
- make future sessions/recovery more intelligible.

This should be treated as an execution-state mechanism, not a permanent project specification store.

## 10.3 `precompact-state.sh`

Runs around context compaction boundaries.

Its purpose is to reduce state loss when context is compressed.

The principle is:

```text
large context
    ↓
extract durable/current state
    ↓
compact
    ↓
continue with explicit state
```

This is particularly valuable when a task spans many tool calls.

## 10.4 `session-bootstrap.sh`

Used to establish session context from the project's state layer.

This makes the initial session orientation less dependent on the model remembering what happened previously.

---

# 11. Memory Architecture

This environment deliberately uses more than one memory mechanism because the mechanisms solve different problems.

## 11.1 The four-state model

```text
                ┌───────────────────────────────┐
                │         CLAUDE.md              │
                │ stable project instructions    │
                └───────────────┬───────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │       .claude/rules/            │
                │ policy + routing + constraints │
                └───────────────┬───────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
    ┌─────────────────────┐             ┌─────────────────────┐
    │    agent-state/      │             │    Claude-Mem        │
    │ current execution    │             │ cross-session       │
    │ truth                 │             │ observations         │
    └─────────────────────┘             └─────────────────────┘
```

## 11.2 `CLAUDE.md`

Use for facts that should be true across sessions.

Good examples:

- project purpose;
- architecture principles;
- important commands;
- coding conventions;
- security constraints;
- tool-routing rules;
- non-negotiable product constraints.

Bad examples:

- transient TODOs;
- current debugging hypotheses;
- a single failed command;
- a temporary implementation detail.

## 11.3 `.claude/rules/`

Use for explicit policy.

Rules should answer:

> "What should Claude consistently do or avoid?"

## 11.4 `agent-state/`

This is the canonical **current execution layer**.

Suggested semantics:

| File | Purpose |
|---|---|
| `GOAL.md` | current goal and success criteria |
| `PLAN.md` | current plan / decomposition |
| `TASKS.md` | actionable work items |
| `PROGRESS.md` | what is already completed |
| `BLOCKERS.md` | active blockers / unresolved issues |
| `DECISIONS.md` | important architectural/product decisions |
| `SESSION.md` | current-session handoff information |

When a session is long, these files are more dependable than conversational memory.

## 11.5 Claude-Mem

Claude-Mem is useful for cross-session observations and retrieval.

It can reduce the cost of repeatedly rediscovering the same project context.

However:

```text
Memory ≠ source of truth
```

If something is critical, put it in:

- code;
- configuration;
- `CLAUDE.md`;
- a rule;
- `agent-state`;
- Git history.

Do not rely on a memory database as the only copy of a critical requirement.

## 11.6 Native Claude memory

Native memory is platform-managed and useful for long-term agent behavior/context where supported.

It should not replace repository state.

---

# 12. Planning with Files

For anything larger than a small patch, planning with files is preferred.

A useful pattern:

```text
GOAL.md
   ↓
PLAN.md
   ↓
TASKS.md
   ↓
implementation
   ↓
PROGRESS.md
   ↓
DECISIONS.md
   ↓
commit
```

## 12.1 Example plan

```markdown
# Goal
Ship the authentication flow for the hackathon demo.

# Success criteria
- login works
- invalid credentials show useful feedback
- session persists across reload
- protected route cannot be opened unauthenticated
- no secrets are committed

# Out of scope
- enterprise SSO
- production-scale identity infrastructure
```

The key is that the plan contains **boundaries**.

AI agents become much less reliable when scope is left implicit.

---

# 13. Specialist Agent Operating Model

## 13.1 Architecture work

Start with:

```text
architect
```

Ask for:

- system decomposition;
- component boundaries;
- data flow;
- failure modes;
- implementation order;
- trade-offs.

Then implement with the relevant frontend/backend agents.

## 13.2 Backend work

Use:

```text
backend-engineer
```

Then run:

```text
test-qa
security-reviewer
code-reviewer
```

for substantial changes.

## 13.3 Frontend work

Use:

```text
frontend-engineer
```

but feed it actual research/design references first.

Recommended pipeline:

```text
researcher
  ↓
Refero / Mobbin
  ↓
Figma / design decision
  ↓
frontend-engineer
  ↓
Impeccable
  ↓
Taste
  ↓
Playwright
```

## 13.4 Security work

Use the security reviewer for:

- auth;
- permissions;
- exposed APIs;
- file uploads;
- database queries;
- secrets;
- external service integrations;
- dangerous shell tooling.

Security should happen before the final commit, not after the hackathon is over.

## 13.5 QA

Use `test-qa` when:

- a feature crosses multiple modules;
- regressions are plausible;
- the change affects user-visible behavior;
- the demo depends on a complex flow.

---

# 14. The Recommended Engineering Loop

For a substantial feature, use this loop.

## Phase A — Understand

```text
1. Read CLAUDE.md
2. Read relevant .claude/rules/
3. Inspect agent-state/
4. Inspect the existing implementation
5. Establish acceptance criteria
```

Do not immediately edit code because the user said "build X."

## Phase B — Research

Use the minimum relevant external systems.

Examples:

```text
library/API question      → Context7
UX/design discovery       → Refero + Mobbin
Figma implementation      → Figma
browser behavior          → Playwright
security concern          → security-guidance + security-reviewer
```

## Phase C — Plan

Update:

```text
agent-state/PLAN.md
agent-state/TASKS.md
```

Break work into independently verifiable units.

## Phase D — Implement

Use the specialist agent that matches the actual work.

Keep commits small enough to recover.

## Phase E — Verify

At minimum:

```text
unit/integration tests
browser verification if UI
security review if sensitive
code review for substantial code
```

## Phase F — Polish

For UI:

```text
Impeccable → Taste → Emil → Playwright
```

## Phase G — Commit

```bash
git status
git diff
git add -A
git commit -m "feat: ..."
```

## Phase H — Handoff

Update:

```text
agent-state/PROGRESS.md
agent-state/SESSION.md
agent-state/BLOCKERS.md
```

This is what makes another session cheap to resume.

---

# 15. How to Prompt This Harness Effectively

A strong prompt gives the agent:

1. goal;
2. context;
3. constraints;
4. acceptance criteria;
5. required verification;
6. expected checkpoint.

## 15.1 Weak prompt

```text
make the dashboard better
```

This leaves too many architectural decisions implicit.

## 15.2 Strong prompt

```text
Implement the dashboard filter flow.

Goal:
Allow users to filter incidents by date, category and status.

Constraints:
- preserve the existing component architecture
- do not add a global state library
- keep API calls cancellable
- do not change the visual language without checking the existing design rules

Research:
Use Context7 if an unfamiliar library API is required.
Use the existing Figma source of truth for UI decisions.

Acceptance criteria:
- filters persist during navigation
- reset returns to defaults
- loading and empty states are explicit
- invalid combinations are handled

Verification:
- run the existing test suite
- use Playwright for the complete browser flow
- run code review
- run security review if the API boundary changes

Checkpoint:
Update agent-state/PROGRESS.md and commit the completed feature.
```

This style gives the harness a clear execution contract.

---

# 16. Free-Only OpenRouter Configuration

## 16.1 Local configuration file — Linux

```text
~/.config/claude-code/openrouter.sh
```

Permissions:

```text
600
```

The file contains the secret API key and environment settings.

It must never be committed.

## 16.2 Local configuration file — Windows

```text
%USERPROFILE%\.config\claude-code\openrouter.ps1
```

The installer also loads this from the PowerShell profile.

## 16.3 Configured variables

The harness configures:

```text
OPENROUTER_API_KEY
ANTHROPIC_BASE_URL
ANTHROPIC_AUTH_TOKEN
ANTHROPIC_API_KEY
ANTHROPIC_MODEL
ANTHROPIC_DEFAULT_OPUS_MODEL
ANTHROPIC_DEFAULT_SONNET_MODEL
ANTHROPIC_DEFAULT_HAIKU_MODEL
CLAUDE_CODE_SUBAGENT_MODEL
CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT
CLAUDE_CODE_MAX_CONTEXT_TOKENS
CLAUDE_CODE_MAX_RETRIES
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE
```

The effective model route is:

```text
ANTHROPIC_BASE_URL = https://openrouter.ai/api
ANTHROPIC_MODEL = openrouter/free
CLAUDE_CODE_SUBAGENT_MODEL = openrouter/free
```

Default Opus/Sonnet/Haiku aliases are also explicitly mapped to `openrouter/free` in the installer.

## 16.4 Why unknown-model window enforcement is disabled

`openrouter/free` is a router identifier rather than a single fixed upstream Claude model ID.

Claude Code may not recognize it in its local model catalog.

The harness therefore explicitly disables unknown-model window enforcement:

```text
CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1
```

This is a compatibility measure for the router path, not a request to use paid models.

## 16.5 Context and compaction settings

Configured defaults include:

```text
CLAUDE_CODE_MAX_CONTEXT_TOKENS=200000
CLAUDE_CODE_MAX_RETRIES=2
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=75
```

Interpretation:

- large context ceiling is allowed;
- failed calls can retry a small number of times;
- compaction is triggered before the session becomes completely saturated.

## 16.6 Free quota strategy

Free availability is not infinite.

When quota is exhausted:

```text
STOP
 ↓
write progress/state
 ↓
commit the current work
 ↓
resume later
```

Do not respond to quota exhaustion by:

- leaking keys;
- rotating accounts to defeat limits;
- removing the free-only policy;
- wiring in an untested proxy during a critical demo.

The goal is graceful degradation, not quota evasion.

---

# 17. Bootstrap Installer: Linux

File:

```text
scripts/setup.sh
```

## 17.1 Command

From repository root:

```bash
bash scripts/setup.sh
```

Optional minimal installation:

```bash
bash scripts/setup.sh --no-optional
```

## 17.2 Required prerequisites

The installer expects:

- Git
- curl
- Node.js 20+
- npm
- npx

Claude Code itself is installed by the script if it is not already present.

## 17.3 What it does

The Linux installer:

1. locates the repository root;
2. checks prerequisites;
3. verifies the project harness exists;
4. installs/updates Claude Code;
5. creates machine-local OpenRouter configuration;
6. loads that configuration into the shell;
7. adds it idempotently to shell profiles;
8. installs shared Agent Skills;
9. registers Claude Code plugin marketplaces;
10. installs the configured official plugins;
11. installs Claude-Mem;
12. installs Refero integration;
13. installs Impeccable for Claude;
14. registers Figma/Mobbin/Context7/Refero/Playwright MCPs;
15. optionally installs Headroom and OmniRoute;
16. validates project JSON;
17. reports Claude and MCP status.

## 17.4 What it does NOT do

It does not:

- commit Git changes;
- push Git changes;
- store the OpenRouter key in the repository;
- remove project files;
- delete hooks;
- run `/learn-codebase`;
- place OmniRoute in the live model path;
- place Headroom in the live model path.

---

# 18. Bootstrap Installer: Windows

File:

```text
scripts/setup.ps1
```

## 18.1 Command

Run from PowerShell at the repository root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup.ps1
```

Minimal optional-tool installation:

```powershell
.\scripts\setup.ps1 -NoOptional
```

## 18.2 Windows prerequisite: Git for Windows

The repository contains POSIX shell hooks:

```text
.claude/hooks/*.sh
```

Therefore Windows requires a POSIX-compatible shell environment such as Git Bash.

The Windows installer checks for `bash.exe` and warns when it is missing.

## 18.3 Windows secret handling

The PowerShell installer accepts:

```text
$env:OPENROUTER_API_KEY
```

when already defined.

Otherwise it prompts securely using `Read-Host -AsSecureString`.

It writes the resulting machine-local configuration to:

```text
%USERPROFILE%\.config\claude-code\openrouter.ps1
```

and loads that script from the PowerShell profile.

## 18.4 Windows portability model

The product repository is portable.

The exact machine-level runtime is not identical across OSes.

Examples:

- shell paths differ;
- Claude Code installation paths differ;
- executable resolution differs;
- browser/runtime dependencies can differ;
- OAuth storage is OS-managed;
- global skill caches differ.

The setup script is the compatibility boundary.

---

# 19. Installer Idempotency

The installers are intended to be safe to rerun.

Examples:

- existing MCPs are detected before registration;
- shell profile snippets are not duplicated;
- skill repositories can be refreshed;
- existing Claude Code installations are reused;
- existing repository harness files are not deleted.

This is important because a teammate may need to run setup more than once after:

- installing Node;
- fixing PATH;
- authenticating a service;
- updating Claude Code;
- recovering from a partial failure.

---

# 20. Optional Headroom and OmniRoute Layer

Two previously evaluated tools exist outside the live model path.

## 20.1 Headroom

Intended role:

- context/compression experimentation;
- reducing unnecessary prompt/context overhead.

It is **not** required for the primary environment.

Do not add it into the live path during a critical hackathon run without benchmarking it first.

## 20.2 OmniRoute

Intended role:

- model/provider routing experimentation;
- gateway experimentation.

It is deliberately not configured as:

```text
ANTHROPIC_BASE_URL
```

and does not proxy the default request path.

The live path stays:

```text
Claude Code → OpenRouter → openrouter/free
```

## 20.3 Why not stack every proxy?

Every additional runtime layer adds failure modes:

```text
Claude
 ↓
proxy
 ↓
router
 ↓
provider
```

More layers mean:

- more logs;
- more versions;
- more auth state;
- more breakpoints;
- harder debugging;
- harder teammate reproduction.

During a hackathon, use optional layers experimentally and only promote them into the live path after validation.

---

# 21. Project State and Memory Workflow

## 21.1 Start of session

Recommended first actions:

```bash
git status
cat agent-state/GOAL.md
cat agent-state/TASKS.md
cat agent-state/BLOCKERS.md
```

Then inspect only the relevant code.

The goal is to load **enough context to act**, not to dump the entire repository into the model.

## 21.2 During work

Update state when something changes materially:

- implementation progress;
- blockers;
- architecture decisions;
- new acceptance criteria.

## 21.3 Before context compaction

Ensure important state is written down.

Do not trust the next compressed context to reconstruct an intricate debugging history perfectly.

## 21.4 End of session

Update:

```text
PROGRESS.md
SESSION.md
BLOCKERS.md
DECISIONS.md
```

Then commit important work.

---

# 22. Context Engineering Rules

A powerful agent is not simply one with a huge context window.

A useful heuristic is:

```text
signal / context-noise
```

The harness therefore encourages:

- small rules;
- task-specific skills;
- specialist agents;
- file-backed state;
- retrieval instead of dumping docs;
- selective MCP use;
- explicit acceptance criteria;
- periodic Git checkpoints.

## 22.1 Do not dump everything into `CLAUDE.md`

Large permanent instructions become noise.

Move long procedural material into:

- skills;
- reference files;
- documentation;
- project state.

Keep `CLAUDE.md` focused on durable project truths.

## 22.2 Use Context7 instead of remembering library APIs

For version-sensitive libraries:

```text
question
 ↓
Context7
 ↓
actual docs
 ↓
implementation
```

This is much safer than relying on model recall.

## 22.3 Use Playwright instead of guessing UI behavior

If a UI bug is visible in a browser, inspect it in a browser.

Do not spend a long reasoning chain trying to infer what CSS must be doing from source alone.

---

# 23. MCP Routing Matrix

| Need | Preferred tool |
|---|---|
| official package/API documentation | Context7 |
| real product UI reference | Mobbin |
| broad visual design research | Refero |
| project design source | Figma |
| rendered browser behavior | Playwright |
| Git/repository operations | Git + Claude Code native tools |
| persistent project rules | CLAUDE.md / `.claude/rules` |
| execution state | `agent-state/` |
| cross-session observations | Claude-Mem |

Avoid using multiple MCPs when one will answer the question.

---

# 24. Example: Building a High-Quality Frontend Feature

Suppose the task is:

> Build a polished analytics dashboard.

Do not start with:

```text
frontend-engineer → generate dashboard
```

Use:

### Step 1 — Research

```text
researcher
 +
Refero
 +
Mobbin
```

Extract:

- information hierarchy;
- navigation patterns;
- filter placement;
- table patterns;
- chart density;
- responsive behavior.

### Step 2 — Source of truth

Create/confirm Figma structure.

### Step 3 — Implement

Use `frontend-engineer`.

### Step 4 — Visual critique

Use Impeccable.

### Step 5 — Visual direction check

Use Taste.

### Step 6 — Motion

Use Emil skills only for meaningful transitions.

### Step 7 — Browser verification

Use Playwright.

### Step 8 — Review

Use `code-reviewer` and, when appropriate, `security-reviewer`.

### Step 9 — Commit

Create a Git checkpoint.

---

# 25. Example: Building an API Feature

Task:

> Add a new endpoint for project summaries.

Recommended:

```text
architect
   ↓
backend-engineer
   ↓
Context7 (if framework/API details are uncertain)
   ↓
test-qa
   ↓
security-reviewer
   ↓
code-reviewer
   ↓
Git commit
```

Acceptance criteria should explicitly define:

- request schema;
- response schema;
- error cases;
- authorization;
- validation;
- test coverage;
- compatibility with current clients.

---

# 26. Example: Research-Heavy Task

Task:

> Determine which library should be used for X.

Recommended process:

```text
researcher
   ↓
Context7 + direct docs
   ↓
compare documented capabilities
   ↓
identify compatibility constraints
   ↓
architect
   ↓
decision written to DECISIONS.md
```

Avoid:

```text
ask the model which library it likes
```

The environment is designed to retrieve evidence where evidence matters.

---

# 27. Security Operating Model

## 27.1 Secrets

Never commit:

```text
OPENROUTER_API_KEY
OAuth tokens
API tokens
private keys
credential exports
local auth state
```

Machine-local files include:

```text
~/.config/claude-code/openrouter.sh
%USERPROFILE%\.config\claude-code\openrouter.ps1
```

## 27.2 Repository security

Before a commit containing configuration changes:

```bash
git diff --cached --name-only
```

Then inspect suspicious files for:

```text
.env
secret
api_key
apikey
token
password
private key
certificate
credential
```

The repository `.gitignore` already ignores common credential and environment-file patterns.

## 27.3 Git safety

Never run destructive Git operations casually.

The pre-tool safety hook exists precisely because model intent is not a sufficient safeguard.

## 27.4 External side effects

Treat the following as high-risk:

- sending messages;
- pushing code;
- modifying production systems;
- changing access controls;
- deleting data;
- rotating credentials;
- publishing secrets.

The harness should ask for human confirmation before irreversible external actions unless an explicit workflow has already authorized them.

---

# 28. Common Failure Modes and Correct Responses

## 28.1 OpenRouter request fails

Check:

```bash
printf '%s\n' "$ANTHROPIC_BASE_URL"
printf '%s\n' "$ANTHROPIC_MODEL"
printf '%s\n' "$CLAUDE_CODE_SUBAGENT_MODEL"
```

Expected:

```text
https://openrouter.ai/api
openrouter/free
openrouter/free
```

Then check the local secret exists without printing it.

Do not paste the key into chat.

## 28.2 `openrouter/free` appears as an unknown model

This is expected with tools that maintain their own model catalog when the router identifier is not part of that catalog.

The environment intentionally sets:

```text
CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1
```

Do not change the live route to a paid model merely to remove the warning.

## 28.3 MCP server disconnected

Run:

```bash
claude mcp list
```

Then:

```text
/mcp
```

inside a fresh Claude Code session.

OAuth-backed services may require re-authentication.

## 28.4 Context7 does not answer

Check both layers:

```text
Context7 skill
Context7 MCP
```

The skill teaches the agent how to use documentation retrieval.

The MCP provides the actual external retrieval capability.

## 28.5 Figma/Mobbin/Refero authentication expired

Re-authenticate in a new Claude Code session.

Do not manually commit OAuth state.

## 28.6 Playwright fails on Windows

Check:

- Node.js;
- `npx`;
- Git for Windows / `bash.exe`;
- browser dependencies;
- the MCP entry in `claude mcp list`.

## 28.7 Hook JSON validation fails

Do not revert to the legacy top-level `decision` shape.

Use the modern `hookSpecificOutput` structure shown in the hook implementation.

If the issue recurs, inspect:

```text
.claude/hooks/pretool-free-guard.sh
.claude/settings.json
```

## 28.8 Impeccable install reports provider problems

Do not invent provider identifiers.

The Impeccable CLI's supported provider list can change.

Use:

```bash
npx impeccable install --help
```

and follow the installed CLI's provider names.

The portable project skill remains useful even if a particular external provider integration is unavailable.

## 28.9 Claude-Mem has no history

This is normal for a new machine/project.

The memory layer needs actual sessions and observations before it becomes useful.

Do not treat the absence of memory as a setup failure.

## 28.10 The agent is using too much context

Reduce the scope.

Use:

```text
agent-state
relevant skill
Context7
small file reads
specialist agent
```

instead of dumping the repository into one prompt.

## 28.11 Free quota is exhausted

Do not start rebuilding the infrastructure.

Do:

```text
write state
commit
stop / resume later
```

This is what the Git + state architecture is for.

---

# 29. Fresh-Machine Linux Checklist

A teammate cloning the repository should do:

```bash
git clone <repository-url>
cd <repository>
git switch setup
bash scripts/setup.sh
```

Then:

```bash
claude --version
claude mcp list
```

Open Claude Code in the repository:

```bash
claude
```

Then authenticate where needed:

```text
/mcp
```

Do not run `/learn-codebase` as part of infrastructure setup.

Once actual project implementation begins, the project memory layer can be seeded through the normal work process.

---

# 30. Fresh-Machine Windows Checklist

Install:

- Git for Windows;
- Node.js 20+;
- Python if optional Headroom tooling is desired.

Clone the repository and open PowerShell at its root.

Run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup.ps1
```

Then:

```powershell
claude --version
claude mcp list
```

Start a new Claude Code session and run:

```text
/mcp
```

Authenticate the OAuth-backed services.

---

# 31. Portability Boundaries

## 31.1 Truly portable

These are repository artifacts:

```text
CLAUDE.md
.claude/agents/
.claude/hooks/
.claude/rules/
.claude/settings.json
.claude/skills/
agent-state/
.gitignore
scripts/setup.sh
scripts/setup.ps1
SETUP.md
```

## 31.2 Not portable by copying bytes

These must be regenerated/installed per machine:

```text
OpenRouter credentials
OAuth state
Claude-Mem database/cache
plugin caches
global skill caches
OS-specific binaries
shell profile configuration
browser binaries/dependencies
```

## 31.3 Why this distinction matters

Trying to copy an entire `~/.claude` directory between machines is fragile.

The proper model is:

```text
Git repository = source of truth
      +
setup script = machine provisioning
      +
OAuth/auth = user interaction
      +
local caches = regenerated
```

---

# 32. Cross-Agent Portability

Agent Skills are broadly more portable than Claude Code plugins and hooks.

## 32.1 Skills

A standard `SKILL.md`-based skill can often be reused by compatible agent harnesses.

This is why the global skill installation strategy is useful beyond Claude Code.

## 32.2 MCP

MCP servers themselves are generally reusable, but the configuration mechanism varies by agent.

The same:

```text
Figma
Mobbin
Context7
Refero
Playwright
```

servers can potentially be reused by another agent that supports MCP, but its config format and authentication lifecycle may differ.

## 32.3 Hooks

Hooks are agent-specific.

The `.claude/hooks/` directory is specifically wired for Claude Code.

Do not assume another IDE will execute these hooks automatically.

## 32.4 Plugins

Claude Code plugins are Claude Code-specific.

Other agents may provide equivalent capabilities through:

- skills;
- MCP;
- native extensions;
- agent-specific plugins.

## 32.5 Impeccable

Impeccable itself has multiple integration targets, but provider support depends on the version of the installed CLI.

Do not hard-code provider names beyond what the installed Impeccable CLI exposes.

---

# 33. Maintenance Strategy

## Weekly / before major work

Check:

```bash
claude --version
claude mcp list
```

Optionally update shared skill sources through the setup script.

## Before a hackathon demo

Run:

```text
code review
security review
Playwright flows
demo-hardening
visual review
```

## After a major environment change

Create a Git checkpoint describing the harness change.

Do not mix a toolchain refactor with a major product feature in the same commit unless there is a compelling reason.

---

# 34. What Not to Change During a Critical Demo

Avoid changing these right before judging unless absolutely necessary:

- model gateway;
- OpenRouter routing;
- MCP transports;
- hook logic;
- plugin marketplaces;
- major Agent Skill sources;
- browser automation versions;
- proxy/router layers.

The day of a demo is for reducing uncertainty, not increasing infrastructure complexity.

---

# 35. Recommended Day-to-Day Workflow

## Start

```bash
git status
```

Read:

```text
CLAUDE.md
agent-state/GOAL.md
agent-state/TASKS.md
agent-state/BLOCKERS.md
```

## Plan

For large work:

```text
planning-with-files
```

Update `PLAN.md` and `TASKS.md`.

## Research

Use:

```text
Context7 → technical documentation
Refero/Mobbin → design research
Figma → source of truth
```

## Build

Use:

```text
frontend-engineer
backend-engineer
architect
```

as appropriate.

## Verify

Use:

```text
test-qa
Playwright
code-reviewer
security-reviewer
```

as appropriate.

## Polish

For UI:

```text
Impeccable
Taste
Emil
```

## Checkpoint

```bash
git add -A
git commit -m "feat: ..."
```

## Handoff

Update state files.

---

# 36. High-Leverage Prompt Patterns

## 36.1 "Research before implementation"

```text
Before modifying code:
1. inspect the relevant implementation;
2. retrieve current library documentation through Context7 if needed;
3. identify the existing architecture and constraints;
4. propose the smallest viable implementation;
5. only then edit files.
```

## 36.2 "Design before code"

```text
Do not generate the interface from memory.
Research the relevant interaction pattern through Refero/Mobbin,
use Figma as the design source of truth when available,
then implement.
```

## 36.3 "Implement + verify"

```text
Implement the feature, then verify it.
Do not stop at source-code completion.
For UI, run the browser flow with Playwright.
For security-sensitive changes, perform the security review.
```

## 36.4 "Use specialists"

```text
Have the architect first define the boundary.
Then have the backend/frontend specialist implement it.
Then use QA and review agents for verification.
```

## 36.5 "Checkpoint"

```text
When this feature is complete and tests pass:
update agent-state/PROGRESS.md and commit the feature.
Do not leave the repository in a half-finished undocumented state.
```

---

# 37. Anti-Patterns

## 37.1 Tool tourism

Bad:

```text
Use every MCP because it exists.
```

Good:

```text
Use the smallest set of tools that materially improves the answer.
```

## 37.2 Skill dumping

Bad:

```text
Read all 226 skills before coding.
```

Good:

```text
Select the relevant skill for the current task.
```

## 37.3 Memory as authority

Bad:

```text
Claude-Mem probably remembers the architecture.
```

Good:

```text
Check CLAUDE.md / agent-state / source code.
Use memory to accelerate retrieval.
```

## 37.4 Generic UI generation

Bad:

```text
make it modern
```

Good:

```text
research the target interaction pattern, establish visual language,
implement against the source of truth, then review the rendered result.
```

## 37.5 Infrastructure during feature work

Bad:

```text
The agent is stuck, so install another router, memory system and proxy.
```

Good:

```text
isolate the failure, use the existing diagnostic surface, fix or checkpoint.
```

## 37.6 Giant commits

Bad:

```text
200 files changed: feature + refactor + tooling + design overhaul
```

Good:

```text
feature checkpoint
refactor checkpoint
harness checkpoint
```

---

# 38. Verification Command Reference

## Claude

```bash
claude --version
```

## MCP

```bash
claude mcp list
```

## Plugins

```bash
claude plugin list
```

## Local skills

```bash
find ~/.claude/skills -mindepth 1 -maxdepth 1 -type d | sort
```

## Shared skills

```bash
find ~/.agents/skills -mindepth 1 -maxdepth 1 -type d | wc -l
```

## Git state

```bash
git status
```

## Project config validity

```bash
python3 -m json.tool .claude/settings.json >/dev/null && echo "settings.json OK"
```

## Model route

```bash
printf '%s\n' "$ANTHROPIC_BASE_URL"
printf '%s\n' "$ANTHROPIC_MODEL"
printf '%s\n' "$CLAUDE_CODE_SUBAGENT_MODEL"
```

Expected live route:

```text
https://openrouter.ai/api
openrouter/free
openrouter/free
```

Do not print:

```text
$OPENROUTER_API_KEY
```

---

# 39. Installer Verification Checklist

After running `scripts/setup.sh` or `scripts/setup.ps1`, verify:

### Base runtime

```text
[ ] Claude Code is installed
[ ] Node.js 20+ is available
[ ] npm/npx work
[ ] Git works
```

### Model route

```text
[ ] OpenRouter base URL is correct
[ ] primary model is openrouter/free
[ ] subagent model is openrouter/free
[ ] no paid fallback is configured
```

### Skills

```text
[ ] Anthropic skills installed
[ ] wshobson agents installed
[ ] Vercel skills installed
[ ] Mobbin skills installed
[ ] Refero skill installed
[ ] Taste installed
[ ] Emil skills installed
[ ] Task Observer skill installed
[ ] Playwright skill installed
[ ] Context7 find-docs installed
```

### Plugins

```text
[ ] official plugin marketplace registered
[ ] code-review installed
[ ] frontend-design installed
[ ] planning-with-files installed
[ ] security-guidance installed
[ ] Claude-Mem installed
[ ] Refero integration installed
[ ] Impeccable available
```

### MCP

```text
[ ] Figma connected
[ ] Mobbin connected
[ ] Context7 connected
[ ] Refero connected
[ ] Playwright connected
```

### Runtime guardrails

```text
[ ] hooks exist
[ ] settings JSON validates
[ ] force-push safety is intact
[ ] agent-state exists
```

---

# 40. Current Environment Snapshot

This section records the environment that was assembled before this manual was written.

## Claude Code

The configured Claude Code environment was on the 2.1.284 line at the time of the final verification.

## Model routing

```text
Base URL: https://openrouter.ai/api
Model: openrouter/free
Subagent model: openrouter/free
Unknown-model window enforcement: disabled
Max context assumption: 200000
```

## Skills

The environment reported approximately:

```text
~/.agents/skills → 226 shared skills
```

The local project skill tree contained six project-specific skills.

## MCP

The final connected MCP set observed during setup was:

```text
claude-mem
figma
mobbin
context7
playwright
refero
```

Important distinction:

- Claude-Mem MCP is part of the memory/plugin stack;
- the five explicitly registered external project MCPs are Figma, Mobbin, Context7, Playwright and Refero.

## Plugins

The environment observed the official plugins plus Claude-Mem, Refero and Impeccable integrations, along with Task Observer-related plugin/skill infrastructure.

## Design stack

```text
Refero
Mobbin
Figma
Impeccable
Taste
Emil
Playwright
```

## Experimental tools

```text
Headroom  → available for experimentation, not live request path
OmniRoute → available for experimentation, not live request path
```

---

# 41. Important Installer / Environment Caveats

## 41.1 The installer installs capabilities, not OAuth identity

A fresh teammate still has to authenticate:

- Figma;
- Mobbin;
- Refero;
- any other provider requiring a user account.

The Git repository cannot safely contain these credentials.

## 41.2 Skill counts change

The installed skill count is expected to drift as upstream repositories change.

Do not build product logic around an exact number such as 226.

The number is a diagnostic snapshot.

## 41.3 Plugin versions change

The installer uses plugin marketplace names rather than committing plugin caches.

Plugin versions can move over time.

If reproducibility becomes critical enough to require exact versions, create a separate version-locking policy rather than copying home-directory caches into Git.

## 41.4 MCP services can change independently

A connected MCP endpoint can change behavior or authentication requirements without a Git change in this repository.

The correct response is:

1. inspect `claude mcp list`;
2. re-authenticate;
3. inspect the relevant provider docs;
4. avoid changing unrelated infrastructure.

---

# 42. How to Leverage the Harness at Maximum Effect

The environment becomes powerful when each layer is used for the problem it solves.

## For architecture

Use:

```text
CLAUDE.md
+ architect
+ Context7
+ agent-state/DECISIONS.md
```

## For backend implementation

Use:

```text
backend-engineer
+ Context7
+ test-qa
+ security-reviewer
+ code-reviewer
```

## For frontend implementation

Use:

```text
Refero
+ Mobbin
+ Figma
+ frontend-engineer
+ Impeccable
+ Taste
+ Emil
+ Playwright
```

## For debugging

Use:

```text
reproduce
→ inspect actual behavior
→ retrieve docs if needed
→ isolate smallest failure
→ fix
→ verify
→ commit
```

## For long autonomous work

Use:

```text
agent-state
+ planning-with-files
+ specialist agents
+ hooks
+ Git checkpoints
+ memory
```

## For final hackathon quality

Use:

```text
demo-hardening
+ Playwright
+ code-review
+ security-guidance
+ visual review
+ Git checkpoint
```

---

# 43. The Correct Mental Model

Do not think:

> "I installed 226 skills and six MCPs, so Claude is automatically better."

Think:

> "I built a routing layer that gives Claude the right information, capability and guardrail at the right time."

The difference is important.

The value of this environment comes from **coordination**:

```text
CLAUDE.md
    ↓
project constraints
    ↓
skill selection
    ↓
specialist role
    ↓
MCP evidence/tool
    ↓
implementation
    ↓
hook enforcement
    ↓
state update
    ↓
verification
    ↓
Git checkpoint
```

The system is intentionally designed so that no single component has to do everything.

---

# 44. Golden Rules

1. **Git is the recovery mechanism.** Commit real progress.
2. **`agent-state/` is current execution truth.** Keep it current.
3. **`CLAUDE.md` is durable instruction, not a diary.**
4. **Skills are for procedures and expertise.** Do not preload everything.
5. **Agents are for specialization.** Choose the smallest useful role set.
6. **MCP is for external capability/evidence.** Do not invoke it without a reason.
7. **Hooks are for deterministic policy.** Do not ask the model to enforce what the hook can enforce.
8. **Plugins package capability.** They do not replace architecture.
9. **Claude-Mem accelerates rediscovery.** It is not the canonical source of project truth.
10. **Figma is the design source of truth once design is established.**
11. **Playwright verifies reality.** Rendered behavior matters more than source-code assumptions.
12. **OpenRouter/free is the live model route.** Keep the free-only constraint explicit.
13. **Never commit credentials.**
14. **Do not change infrastructure in the middle of a critical feature unless necessary.**
15. **Use the smallest effective toolchain for each task.**
16. **Research before guessing.**
17. **Verify before claiming completion.**
18. **Commit before handing work to another session.**

---

# 45. Final Operator Checklist

Before saying "the feature is done":

```text
[ ] Goal is explicit
[ ] Acceptance criteria are explicit
[ ] Relevant rules were followed
[ ] Relevant skill was selected
[ ] External facts were retrieved where necessary
[ ] Implementation is complete
[ ] Tests pass
[ ] Browser behavior verified where relevant
[ ] Security reviewed where relevant
[ ] Visual quality reviewed where relevant
[ ] agent-state updated
[ ] no secrets were introduced
[ ] git diff inspected
[ ] commit created
```

Before saying "the environment is healthy":

```text
[ ] Claude Code starts
[ ] OpenRouter base URL is correct
[ ] primary model is openrouter/free
[ ] subagent model is openrouter/free
[ ] MCPs are connected/authenticated
[ ] plugins are available
[ ] skills are discoverable
[ ] hooks validate
[ ] settings JSON validates
[ ] Git tree is clean
```

---

# 46. Minimal Command Card

### Linux setup

```bash
bash scripts/setup.sh
```

### Linux setup without optional experiments

```bash
bash scripts/setup.sh --no-optional
```

### Windows setup

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup.ps1
```

### Windows without optional experiments

```powershell
.\scripts\setup.ps1 -NoOptional
```

### Verify Claude

```bash
claude --version
```

### Verify MCP

```bash
claude mcp list
```

### Verify plugins

```bash
claude plugin list
```

### Verify project config

```bash
python3 -m json.tool .claude/settings.json >/dev/null && echo OK
```

### Verify Git

```bash
git status
```

### Launch

```bash
claude
```

### Authenticate interactive MCP providers

```text
/mcp
```

---

# 47. Closing Architecture Summary

The finished environment is a **portable engineering harness**, not just a Claude Code installation.

Its major layers are:

```text
┌───────────────────────────────────────────────────────────┐
│                         HUMAN                             │
│ goals / product decisions / approvals / Git checkpoints   │
├───────────────────────────────────────────────────────────┤
│                       CLAUDE CODE                         │
├───────────────────────────────────────────────────────────┤
│ CLAUDE.md + rules                                         │
│ persistent project instructions                           │
├───────────────────────────────────────────────────────────┤
│ Agent Skills                                               │
│ Anthropic / wshobson / Vercel / Mobbin / Refero / Taste   │
│ Emil / Task Observer / Playwright / Context7              │
├───────────────────────────────────────────────────────────┤
│ Specialist agents                                          │
│ architect / frontend / backend / research / QA / security │
├───────────────────────────────────────────────────────────┤
│ Plugins                                                     │
│ review / feature dev / planning / security / memory / etc │
├───────────────────────────────────────────────────────────┤
│ MCP                                                          │
│ Figma / Mobbin / Refero / Context7 / Playwright           │
├───────────────────────────────────────────────────────────┤
│ Hooks                                                        │
│ state / compaction / session / free-model safety          │
├───────────────────────────────────────────────────────────┤
│ Memory + execution state                                     │
│ agent-state / Claude-Mem / native memory                  │
├───────────────────────────────────────────────────────────┤
│ Model gateway                                                │
│ OpenRouter → openrouter/free                               │
├───────────────────────────────────────────────────────────┤
│ Git                                                          │
│ checkpoints / recovery / portability                       │
└───────────────────────────────────────────────────────────┘
```

The strongest way to use this system is **not** to activate everything simultaneously.

The strongest way to use it is to route each problem through the narrowest combination of:

```text
instruction
+ skill
+ specialist
+ evidence/tool
+ guardrail
+ state
+ verification
```

That gives the agent a structured engineering environment while keeping the final project, credentials and external side effects under human control.
