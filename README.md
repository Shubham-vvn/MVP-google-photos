# Google Photos — AI Memory Context MVP
> Bridges the gap between **what photos show** and **what photos mean** through AI-assisted memory capture and natural language multimodal retrieval.

---

## 📑 Project Documentation Index

| Document | Purpose |
|---|---|
| [problemStatement.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/problemStatement.md) | Product vision, user pain points, personas, and MVP success metrics |
| [architecture.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/architecture.md) | 15-section technical architecture, component design, and data flows |
| [implementationPlan.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/implementationPlan.md) | 12-week roadmap, 7 phases, and 129 actionable tasks |
| [edgeCases.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/edgeCases.md) | 152 edge cases classified across 11 technical and user domains |
| [docs/ADR.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/docs/ADR.md) | Architecture Decision Records (Spanner, Gemini Flash/Pro, ScaNN, Hybrid RRF) |
| [docs/uxSpecs.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/docs/uxSpecs.md) | UX Design Specs, Material 3 tokens, wireframes, and micro-interactions |
| [docs/privacyAssessment.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/docs/privacyAssessment.md) | Privacy Impact Assessment, GDPR/CCPA compliance, and zero-day retention |
| [api/openapi.yaml](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/api/openapi.yaml) | Full OpenAPI 3.1.0 specification for all 11 REST API endpoints |
| [infra/spanner/schema.sql](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/infra/spanner/schema.sql) | Cloud Spanner standard SQL DDL schema and secondary indexes |
| [CONTRIBUTING.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/CONTRIBUTING.md) | Branching strategy, Conventional Commits, and code review criteria |

---

## 🏆 Full Implementation Status: All Phases Complete

All deliverables across Phases 0 through 6 outlined in [implementationPlan.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/implementationPlan.md) are fully implemented and verified:

### Phase 0 — Pre-Development & Infrastructure
- [x] UX Design Specs ([docs/uxSpecs.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/docs/uxSpecs.md)) & ADRs ([docs/ADR.md](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/docs/ADR.md))
- [x] OpenAPI 3.1.0 contract ([api/openapi.yaml](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/api/openapi.yaml))
- [x] Terraform IaC ([infra/terraform/](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/infra/terraform/)) and Cloud Spanner DDL ([infra/spanner/schema.sql](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/infra/spanner/schema.sql))

### Phase 1 — Foundation & Data Layer
- [x] Cloud Spanner Data Access Layer (`src/dal/memoryStore.ts`, `src/dal/clusterStore.ts`)
- [x] User Preferences & Settings Store (`src/dal/settingsStore.ts`)
- [x] Vector & Inverted Index Data Store (`src/dal/indexStore.ts`)
- [x] OAuth 2.0 Auth Middleware (`src/middleware/auth.ts`)
- [x] Rate Limiter (`src/middleware/rateLimiter.ts`) & Consent Gate (`src/middleware/consent.ts`)
- [x] Zero-Leak Audit Logging (`src/services/auditLogger.ts`)

### Phase 2 — Clustering & Prompt Engine
- [x] Media Clustering Engine (`src/services/clusteringEngine.ts`) with 2-hour temporal windows and geospatial proximity
- [x] Memory-worthiness Quality Scorer (photos/videos mix, minimum items threshold)
- [x] Prompt Decision Engine (`src/services/promptEngine.ts`) with fatigue prevention, cooldowns, and dynamic copy generation
- [x] Cooldown Dismissal Tracking (`POST /v1/memory/clusters/{id}/dismiss`)

### Phase 3 — AI Pipelines & Orchestrator
- [x] Gemini NLU Extraction Service (`src/services/nluService.ts`) with structured entity, activity, and emotional context extraction
- [x] Visual Analysis Service (`src/services/visualAnalysisService.ts`) with scene classification, object detection, and OCR extraction
- [x] Memory Fusion Engine (`src/services/memoryFusionEngine.ts`) with canonical user priority, visual enrichment, and 768-dim embedding generation
- [x] Memory Saga Orchestrator (`src/services/memoryOrchestrator.ts`) coordinating NLU, visual detection, and indexing

### Phase 4 — Search & Retrieval
- [x] Hybrid Search Engine (`src/services/searchEngine.ts`) with Reciprocal Rank Fusion:
  $$\text{Score} = 0.45 \times \text{Semantic} + 0.25 \times \text{Keyword} + 0.15 \times \text{Metadata} + 0.10 \times \text{Recency} + 0.05 \times \text{Quality}$$
- [x] Natural Memory Retrieval (`POST /v1/memory/search`) matching conversational memories like *"Delhi cafe with Ramesh having cake"*

### Phase 5 — Client Integration & Mobile-First Webpage UI
- [x] Centered smartphone mockup frame on desktop screens (with Dynamic Island, live clock, status bar, and home pill)
- [x] Full-bleed responsive experience on mobile screens (`≤ 520px`)
- [x] In-Timeline Prompt Card with photo stack and dual action triggers (`Speak Memory` / `Write Context`)
- [x] Modal Bottom Sheet with animated 16-bar audio visualizer, real-time NLU concept preview chips, and privacy guarantees
- [x] Transparent AI Review Modal with clear distinction between **User-Provided Meaning** and **AI Inferred Visual Signals**
- [x] High-resolution Lightbox with photo metadata and Linked Memory Context inspector
- [x] Presenter Toolbar with scenario quick-switcher, phone frame toggle, light/dark mode, and data reset

### Phase 6 — Automated Testing & Quality Gates
- [x] 19 automated integration and unit tests passing with 100% success rate:
  - Gateway & health probes (`/healthz`, `/readyz`, `/`)
  - Photo cluster list, details, and dismissal
  - Memory Context creation, listing, patching, and deletion
  - Multimodal natural language search
  - User settings read & update
  - Pipeline engines (Clustering, NLU, Fusion, Audit logging)

---

## 🛠️ Quickstart

### 1. Run Automated Test Suite
```bash
npm test
```

### 2. Start Backend API & Web App Server
```bash
npm run build
npm start
```
- Web Application: `http://localhost:8080/app` or `http://localhost:8080/`
- API Health Check: `http://localhost:8080/healthz`
- OpenAPI Specification: `http://localhost:8080/api/openapi.yaml`

### 3. Open Standalone Mobile-First UI (No Server Required)
You can directly open [public/index.html](file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/public/index.html) in any web browser:
```
file:///Users/shubhamthakur/Downloads/nextleap%20antigravity%20projects/Google%20Photos%20Project%20/MVP%20google%20photos%20/public/index.html
```
