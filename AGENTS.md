# AGENTS.md

## Project Overview

This repository contains a small AI-powered DevOps assistant built with Next.js and TypeScript.

The assistant is intended to evolve into a production-oriented system that can investigate backend services, understand their configuration and runtime behavior, identify potential DevOps issues, and present useful findings to the user.

The repository currently contains one service used as the investigation target:

```text
backend/
└── demo-service/
```

Treat `backend/demo-service` as the reference/demo service for the assistant's investigation workflow.

---

## Repository Structure

```text
DevOps-agent-AI/
├── app/                    # Next.js application and UI
│   ├── page.tsx            # Main application page
│   ├── layout.tsx          # Root application layout
│   └── globals.css         # Global styles
│
├── backend/                # Backend services
│   ├── package.json        # Backend-level configuration
│   └── demo-service/
│       └── package.json    # Demo service configuration
│
├── types/                  # Shared TypeScript declarations/validation
│   ├── cache-life.d.ts
│   ├── root-params.d.ts
│   ├── routes.d.ts
│   └── validator.ts
│
├── public/                 # Static frontend assets
│
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── package.json            # Root project configuration
├── README.md               # Project documentation
└── CLAUDE.md               # Additional project/agent instructions
```

---

# Core Concept

The application is a **DevOps investigation assistant**.

The important distinction is:

* The Next.js application is the **assistant interface**.
* `backend/demo-service` is the **service being investigated**.
* The assistant should inspect the service before making conclusions about it.

Do not assume that a service is healthy, unhealthy, correctly configured, or production-ready without inspecting the available evidence.

---

# Investigation Flow

When asked to investigate a service, follow this general sequence:

```text
User request
    ↓
Understand the investigation goal
    ↓
Locate the target service
    ↓
Inspect service structure and configuration
    ↓
Inspect package/dependency information
    ↓
Inspect application/runtime configuration
    ↓
Identify available scripts and entry points
    ↓
Inspect relevant source/configuration files
    ↓
Run safe validation checks when appropriate
    ↓
Collect evidence
    ↓
Analyze findings
    ↓
Report issues, risks, and recommendations
```

The investigation should be evidence-driven.

Do not jump directly to recommendations before understanding how the service is structured.

---

# Target Service Investigation

For the current repository, start with:

```text
backend/demo-service/
```

At minimum, inspect:

1. `backend/demo-service/package.json`
2. The service entry point, if present
3. Configuration files
4. Environment/configuration references
5. Dependency definitions
6. Build and start scripts
7. Tests, if present
8. Docker/container configuration, if present
9. CI/CD configuration, if present
10. Infrastructure/deployment configuration, if present

The exact files may change as the repository evolves.

Do not assume that only the currently visible files exist. Always inspect the actual directory when performing an investigation.

---

# What to Look For

During an investigation, consider the following areas.

## 1. Runtime

Determine:

* Runtime/platform
* Application entry point
* Start command
* Build command
* Development command
* Required runtime version
* Required environment variables
* Listening port
* Host binding
* Process model

## 2. Dependencies

Inspect:

* Production dependencies
* Development dependencies
* Dependency versions
* Potentially outdated or suspicious dependencies
* Missing dependencies
* Unnecessary production dependencies
* Lockfile consistency

Do not report a dependency as vulnerable solely because its version looks old. Verify vulnerability information when vulnerability analysis is explicitly requested.

## 3. Configuration

Look for:

* Environment variables
* Configuration files
* Hard-coded credentials or secrets
* Hard-coded URLs
* Hard-coded ports
* Environment-specific behavior
* Missing production configuration
* Unsafe defaults

Never expose secrets in the response.

If credentials, tokens, API keys, or other sensitive values are discovered, report the existence and location of the secret without reproducing the secret value.

## 4. Reliability

Look for evidence related to:

* Error handling
* Retry behavior
* Timeouts
* Graceful shutdown
* Health checks
* Dependency failures
* Logging
* Process crashes
* Unhandled exceptions
* Resource handling

Separate confirmed problems from potential risks.

## 5. Production Readiness

Evaluate evidence related to:

* Build reproducibility
* Environment configuration
* Logging
* Observability
* Health/readiness endpoints
* Graceful shutdown
* Security configuration
* Dependency management
* Containerization
* CI/CD
* Testing
* Configuration management
* Failure handling

Do not claim that the service is production-ready or not production-ready based on a single missing file or convention.

Explain the concrete evidence behind each finding.

---

# Evidence and Findings

Every important finding should distinguish between:

### Confirmed

There is direct evidence in the repository.

Example:

> `package.json` defines a production start command that references a file that does not exist.

### Likely

The available evidence strongly suggests a problem, but it has not been fully verified.

Example:

> The service appears to depend on an environment variable that is not documented in the repository.

### Possible

There is a potential risk that requires runtime or external verification.

Example:

> The application may become unavailable if its downstream dependency is slow because no timeout configuration was found.

Avoid presenting assumptions as facts.

---

# Safe Investigation

Prefer read-only investigation.

Safe actions include:

* Listing files
* Reading source/configuration files
* Inspecting package metadata
* Inspecting lockfiles
* Running type checks
* Running linting
* Running tests
* Running builds
* Inspecting Git metadata when relevant

Avoid destructive operations unless the user explicitly requests them.

Do not:

* Delete files
* Reset repository state
* Remove dependencies
* Modify production configuration
* Rotate credentials
* Deploy services
* Restart production infrastructure
* Change cloud resources

unless explicitly authorized and the required tooling is available.

---

# Commands

Before running commands, inspect the relevant `package.json` files and repository instructions.

Prefer existing project scripts over inventing commands.

Typical checks may include:

```bash
npm install
npm run lint
npm run build
npm test
```

Only run a command when it is supported by the repository's actual configuration.

Do not assume that every project uses npm, even though this repository currently contains `package-lock.json`. Verify the available scripts first.

---

# Changes to the Codebase

When implementing a fix:

1. Understand the existing architecture.
2. Identify the smallest appropriate change.
3. Preserve existing behavior unless the requested change requires otherwise.
4. Avoid unnecessary dependencies.
5. Follow the project's existing TypeScript and Next.js conventions.
6. Update related configuration when required.
7. Run relevant validation after the change.
8. Clearly report what changed and what was verified.

Do not rewrite large portions of the application when a focused change is sufficient.

---

# Frontend vs Backend Responsibilities

The `app/` directory contains the assistant UI.

The `backend/` directory contains services that the assistant may investigate.

Do not confuse the assistant's own application with the service being investigated.

When a request concerns:

* Assistant UI → inspect `app/`
* Assistant behavior → inspect application code and relevant backend integration
* Demo service behavior → inspect `backend/demo-service/`
* Service configuration → inspect the target service configuration
* Production readiness → inspect the complete service and deployment-related evidence

---

# Agent Response Format

For investigation tasks, prefer a concise structure such as:

## Summary

One or two sentences describing what was investigated.

## Findings

For each finding:

* **Severity:** Informational / Low / Medium / High / Critical
* **Status:** Confirmed / Likely / Possible
* **Area:** Runtime / Security / Reliability / Dependencies / Configuration / Deployment / Observability
* **Evidence:** Specific file, configuration, command output, or behavior
* **Impact:** What could happen
* **Recommendation:** What should be considered or changed

Severity is a description of potential impact, not a measure of certainty.

## Verification

List commands or checks that were actually performed.

## Remaining Unknowns

Explicitly identify information that could not be verified from the repository.

Never claim that a command was executed if it was not executed.

---

# Production Mindset

This project is intended for eventual production use.

Therefore:

* Prefer deterministic behavior.
* Favor explicit configuration.
* Avoid hidden assumptions.
* Keep security-sensitive information out of logs and responses.
* Treat external systems as potentially unreliable.
* Make failures observable.
* Preserve auditability of important actions.
* Validate before making changes.
* Keep investigation results reproducible where possible.
* Distinguish repository evidence from runtime evidence.
* Never represent simulated/demo behavior as real infrastructure state.

The assistant should be useful to an engineer who needs to understand **what is happening, why it is happening, what evidence supports that conclusion, and what remains unknown**.

---

# Important Rules

1. Read repository instructions before modifying code.
2. Inspect the target service before diagnosing it.
3. Use evidence rather than assumptions.
4. Do not expose secrets.
5. Do not invent runtime state.
6. Do not claim commands were executed when they were not.
7. Do not silently make destructive changes.
8. Prefer minimal, reviewable changes.
9. Validate changes when possible.
10. Clearly distinguish confirmed facts from hypotheses.
11. When external information is required, identify that dependency explicitly.
12. Keep investigation results understandable to a human engineer.

---

# Current Development Target

The current repository is small and the primary service under investigation is:

```text
backend/demo-service/
```

Use the actual contents of this directory as the source of truth for understanding the demo service.

As the project grows, update this document when the investigation architecture, service discovery mechanism, supported runtimes, execution model, or safety boundaries materially change.
