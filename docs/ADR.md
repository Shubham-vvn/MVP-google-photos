# Architecture Decision Records (ADRs)
## Google Photos — AI Memory Context MVP

This document records the foundational architectural decisions for the Google Photos AI Memory Context MVP. Each ADR captures the context, decision, consequences, and alternatives considered.

---

### Table of Contents
1. [ADR-001: Cloud Spanner for Memory Context Storage](#adr-001-cloud-spanner-for-memory-context-storage)
2. [ADR-002: Dual-Model Gemini Strategy (Flash for NLU, Pro for Disambiguation)](#adr-002-dual-model-gemini-strategy)
3. [ADR-003: Vertex AI Vector Search (Matching Engine / ScaNN) for Embeddings](#adr-003-vertex-ai-vector-search)
4. [ADR-004: Hybrid Keyword + Vector Retrieval (Reciprocal Rank Fusion)](#adr-004-hybrid-keyword--vector-retrieval)
5. [ADR-005: On-Device Candidate Filtering vs Cloud Clustering](#adr-005-on-device-candidate-filtering-vs-cloud-clustering)
6. [ADR-006: Privacy Architecture — Encryption, Zero-Day Retention, and Ephemeral PII](#adr-006-privacy-architecture)
7. [ADR-007: Event-Driven Async Task Orchestration (Cloud Tasks & Pub/Sub)](#adr-007-event-driven-async-task-orchestration)

---

### ADR-001: Cloud Spanner for Memory Context Storage

* **Status:** Accepted
* **Deciders:** Principal Architect, Tech Lead, Data Platform Lead
* **Date:** 2026-09-26

#### Context
The AI Memory Context service requires storing rich, structured user memory context, clustering associations, and photo relations. The system must support:
- Strong consistency for user updates (edits, deletions must reflect immediately).
- High transactional reliability when linking memory context to multiple media IDs.
- Sub-15ms p95 read latency for user queries.
- Strict data residency and global scaling to hundreds of millions of users without manual sharding.

#### Alternatives Considered
1. **Cloud Firestore:** Excellent document model and low latency, but lacks rich SQL relational joins across photos, clusters, and memories; multi-document transactions have higher contention risk.
2. **Cloud SQL (PostgreSQL):** Familiar relational model, but requires complex sharding and failover management at Google Photos scale.
3. **Bigtable:** Ultra-high throughput, but lacks secondary indexing and ACID transactional guarantees required for memory updates and privacy compliance.

#### Decision
Use **Google Cloud Spanner** as the primary source of truth for `MemoryContext`, `MemoryCluster`, and `SemanticIndex` tables.
- Use `user_id` as the leading key for sharding and data co-location.
- Store structured JSON columns (`user_input`, `extracted_context`, `media_associations`) alongside strongly typed relational keys.
- Store embeddings in Cloud Spanner as `BYTES` for fallback and point queries, while indexing vectors in Vertex AI Matching Engine.

#### Consequences
* **Positive:** High availability (99.999%), horizontal scale without sharding, strong transactional consistency, built-in regional replication.
* **Negative:** Higher baseline cost compared to Firestore; schema changes require structured DDL migrations.

---

### ADR-002: Dual-Model Gemini Strategy

* **Status:** Accepted
* **Deciders:** ML Lead, Tech Lead, Product Manager
* **Date:** 2026-09-26

#### Context
Processing free-form user memory inputs (voice transcripts and text) requires extracting structured entities (who, what, where, when, emotional valence, significance) in <1000ms. In complex multi-entity or contradictory scenarios, deeper reasoning is needed.

#### Alternatives Considered
1. **Gemini 1.5 Pro for All Tasks:** Best accuracy, but p95 latency is 1.8s–2.5s and token cost is 10x higher.
2. **Fine-Tuned Smaller Model (e.g., Gemma 2B):** Low cost and fast, but poor zero-shot entity extraction and high maintenance overhead.
3. **Gemini 1.5 Flash for All Tasks:** Fast (<500ms) and cost-effective, but occasionally misses ambiguous or nested relational contexts.

#### Decision
Adopt a **Dual-Model Tiered Execution Pattern**:
- **Primary Tier (Gemini 1.5 Flash):** Handles 92%+ of inputs (fast entity extraction, token extraction, sentiment, keyword generation, and user summary generation).
- **Secondary Tier (Gemini 1.5 Pro):** Triggered asynchronously or on fallback only when Flash returns confidence score $< 0.70$ or detects contradictory date/location metadata.

#### Consequences
* **Positive:** Achieves p95 extraction latency $< 600\text{ms}$ while keeping API costs low and maintaining high precision on ambiguous edge cases.
* **Negative:** Requires dual prompt maintenance and a routing logic layer.

---

### ADR-003: Vertex AI Vector Search (Matching Engine / ScaNN)

* **Status:** Accepted
* **Deciders:** Search Engineer, ML Engineer, Tech Lead
* **Date:** 2026-09-26

#### Context
Natural language photo search queries (e.g., *"that cozy mountain retreat where we celebrated Sarah's birthday"*) must match vector embeddings of memory contexts, visual features, and audio notes within $\le 50\text{ms}$.

#### Alternatives Considered
1. **pgvector on Cloud SQL:** Inadequate performance for vector libraries exceeding 10M embeddings; lacks native Google infrastructure integration.
2. **Pinecone / Weaviate:** Managed SaaS solutions, but introduce external VPC peering, vendor lock-in, and compliance complexities.
3. **Vertex AI Vector Search (ScaNN):** Google's state-of-the-art vector search engine utilizing anisotropic vector quantization (ScaNN algorithm).

#### Decision
Deploy **Vertex AI Vector Search** with:
- Model: `text-embedding-005` (768 dimensions).
- Distance Measure: `DOT_PRODUCT_DISTANCE` (normalized cosine).
- Deployment: Stream update enabled index with regional endpoint co-located with Cloud Run API gateway.
- Metadata filtering: Partitioned by `user_id` namespace to enforce strict tenant isolation.

#### Consequences
* **Positive:** Sub-10ms vector search at 99% recall; native IAM integration; zero multi-tenant leakage risk via partition filtering.
* **Negative:** Minimum cluster pricing applies; streaming index updates have slight eventual consistency delay (~500ms).

---

### ADR-004: Hybrid Keyword + Vector Retrieval (Reciprocal Rank Fusion)

* **Status:** Accepted
* **Deciders:** Search Architect, Backend Lead
* **Date:** 2026-09-26

#### Context
Pure semantic search struggles with exact keyword recall (e.g., specific restaurant name "Trattoria Da Luigi" or flight number "UA249"), while pure keyword search fails on thematic queries ("relaxing weekend").

#### Decision
Implement a **Two-Stage Hybrid Search Pipeline**:
1. **Parallel Retrieval:**
   - Vector Search: Vertex AI Vector Search returns top 100 candidate memory/photo IDs.
   - Keyword Search: Cloud Spanner inverted index / full-text search returns top 100 candidates.
2. **Fusion & Ranking:**
   - Combine scores using **Reciprocal Rank Fusion (RRF)**:
     $$RRF(d) = \sum_{m \in M} \frac{w_m}{k + r_m(d)}$$
     where $k=60$, $w_{vector}=0.6$, $w_{keyword}=0.4$.
   - Boost scores by temporal proximity and user favorite status.

#### Consequences
* **Positive:** High precision on both exact entity searches and fuzzy thematic semantic searches.
* **Negative:** Slightly higher compute per query; requires tuning weighting coefficients.

---

### ADR-005: On-Device Candidate Filtering vs Cloud Clustering

* **Status:** Accepted
* **Deciders:** Mobile Leads (Android & iOS), Tech Lead
* **Date:** 2026-09-26

#### Context
Prompts must be presented to users at the opportune moment without draining battery, consuming mobile data, or introducing privacy leaks.

#### Decision
Adopt a **Hybrid Edge-Cloud Pipeline**:
1. **On-Device (Edge):**
   - Detect raw photo clusters locally using camera timestamp bursts, location geofences, and on-device face clustering.
   - Screen clusters against eligibility rules (e.g., $\ge 5$ photos in $\le 6$ hours, $> 20\text{km}$ from home, positive aesthetic score).
2. **Cloud Sync:**
   - Upload cluster metadata (anonymized photo IDs, timestamps, geo-hash, cluster confidence) to the Memory Gateway when on Wi-Fi and charging.
   - Cloud Prompt Engine computes user prompt cooldowns and selects the single highest-value cluster.

#### Consequences
* **Positive:** Zero unnecessary battery drain; zero cloud compute for trivial photos; preserves user privacy.
* **Negative:** Cluster detection logic must be maintained in both Kotlin (Android) and Swift (iOS).

---

### ADR-006: Privacy Architecture — Encryption, Zero-Day Retention, and Ephemeral PII

* **Status:** Accepted
* **Deciders:** Privacy Counsel, Security Lead, Tech Lead
* **Date:** 2026-09-26

#### Context
User memories contain intimate personal details (health mentions, relationships, private events). Strict privacy guarantees are essential.

#### Decision
1. **Customer-Managed Encryption Keys (CMEK):** All Cloud Spanner tables, GCS buckets, and Vertex AI indexes encrypted with Google Cloud KMS keys.
2. **Zero Model Training:** Explicit contract with Google Cloud AI that customer prompts, memory inputs, and photo embeddings are **never** used to train foundation models.
3. **Sensitive Category Redaction:** Cloud DLP (Data Loss Prevention) inspects raw memory input before persistence to flag/mask credit cards, SSNs, and government IDs.
4. **Instant Cascade Purge:** Deleting a memory or user account executes a synchronous Spanner soft-delete and enqueues an asynchronous hard purge across Spanner, Vertex AI index, Memorystore cache, and Cloud Logging within 24 hours.

#### Consequences
* **Positive:** Complete GDPR, CCPA, and Google internal privacy compliance; high user trust.
* **Negative:** Slight overhead from DLP scanning and crypto key management.

---

### ADR-007: Event-Driven Async Task Orchestration

* **Status:** Accepted
* **Deciders:** Backend Lead, SRE Lead
* **Date:** 2026-09-26

#### Context
When a user submits a memory, the client must receive an immediate acknowledgement ($< 300\text{ms}$), while NLU extraction, embedding generation, visual fusion, and vector index updates take 1.5–3 seconds.

#### Decision
Use **Google Cloud Tasks** for reliable asynchronous background processing:
- Client `POST /api/v1/memories` writes initial record with status `PROCESSING` and returns `202 Accepted` with `memory_id`.
- Gateway enqueues task to `memory-processing-queue` targeting internal Cloud Run worker.
- Worker executes NLU pipeline, generates embeddings, updates Spanner to `ACTIVE`, and pushes to Vertex AI Vector Search.
- Client receives completion via WebSocket/SSE or checks status via `GET /api/v1/memories/{id}`.

#### Consequences
* **Positive:** Fast client response, automatic exponential backoff retry for transient Gemini/Vertex AI failures, guaranteed at-least-once delivery.
* **Negative:** Requires handling eventual consistency on client UI.
