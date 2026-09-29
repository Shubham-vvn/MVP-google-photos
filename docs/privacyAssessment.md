# Privacy Impact Assessment & Legal Review
## Google Photos — AI Memory Context MVP
**Document Reference:** `docs/privacyAssessment.md`  
**Classification:** Confidential — Google Internal / Legal & Privacy Signoff  
**Assessment Date:** 2026-09-26  
**Status:** Approved for MVP Rollout  

---

### 1. Executive Summary

The **AI Memory Context MVP** introduces user-contributed unstructured memories (voice recordings, transcribed text, and natural language descriptions) linked to photo clusters. Because memories often encompass deeply personal details (family members, medical events, relationships, personal beliefs), this feature underwent a comprehensive Data Protection Impact Assessment (DPIA) across Google Legal, Privacy Engineering, and Infosec.

---

### 2. Regulatory Compliance Framework

| Regulation | Requirement | Compliance Implementation in AI Memory Context |
|---|---|---|
| **GDPR (EU)** | Lawful basis (Art. 6) & Explicit Consent (Art. 9) | Strict opt-in toggle; processing special category data requires explicit consent modal. |
| **GDPR (EU)** | Right to Erasure / "To be Forgotten" (Art. 17) | Synchronous soft-delete in Spanner with guaranteed 24-hour hard purge cascade across all vector indexes and caches. |
| **GDPR (EU)** | Data Portability (Art. 20) | Full JSON export integrated into **Google Takeout**. |
| **CCPA / CPRA (US)** | No sale or sharing of personal data | Memory data is strictly scoped to the individual user account and never shared with third parties or cross-service ad profiles. |
| **Google AI Principles** | Accountability & Harm Avoidance | Customer memories and embeddings are **never** used to train foundation models (Gemini/PaLM). |
| **COPPA (US)** | Child privacy protection | Feature disabled by default for supervised child accounts under 13 (Family Link). |

---

### 3. Data Classification & Minimization Matrix

```mermaid
graph LR
    subgraph INGEST["1. Ingestion"]
        V["Voice Audio Stream"]
        T["Raw User Text"]
    end

    subgraph PROCESSING["2. AI Processing"]
        STT["Speech-to-Text<br/>(In-Memory Only)"]
        DLP["Cloud DLP<br/>(PII Redaction)"]
        GEMINI["Gemini 1.5 Flash<br/>(Structured Extraction)"]
    end

    subgraph STORAGE["3. Persistent Storage"]
        SPANNER["Cloud Spanner<br/>(Encrypted MemoryContext)"]
        VERTEX["Vertex AI Vector Search<br/>(Tenant-Isolated Embeddings)"]
    end

    V --> STT
    STT --> DLP
    T --> DLP
    DLP --> GEMINI
    GEMINI --> SPANNER
    GEMINI --> VERTEX

    style INGEST fill:#4285F4,stroke:#333,color:#fff
    PROCESSING fill:#FBBC04,stroke:#333,color:#000
    STORAGE fill:#34A853,stroke:#333,color:#fff
```

| Data Element | Classification | Retention Period | Storage Location | Encryption |
|---|---|---|---|---|
| **Raw Voice Audio** | Ephemeral PII | **0 seconds** (Discarded immediately post-transcription) | Memory buffer only | In-transit (TLS 1.3) |
| **Raw User Text** | Confidential PII | Lifetime of memory (or until user edit/delete) | Cloud Spanner | CMEK (AES-256) |
| **Extracted Entities** | Pseudonymous Context | Lifetime of memory | Cloud Spanner | CMEK (AES-256) |
| **Vector Embeddings** | Derived Feature Vector | Lifetime of memory | Vertex AI Vector Search | CMEK (AES-256) |
| **Cluster Metadata** | Internal Telemetry | 30 days | Cloud Spanner | Google Default Key |
| **Audit Logs** | Security Logs | 90 days | Cloud Audit Logs | Immutable Append-Only |

---

### 4. Zero-Day Retention & Model Training Safeguards

> [!IMPORTANT]
> **Foundational AI Commitment:**
> 1. User prompts, dictated stories, voice transcripts, and photo associations are **never** added to public or shared training corpora.
> 2. Calls to Gemini 1.5 Flash / Pro are executed via Vertex AI Private Endpoints under the **Enterprise Zero Data Retention (ZDR)** agreement.
> 3. Vertex AI logs for Gemini prompt/response are discarded after transient inference processing.

---

### 5. Sensitive Category Handling & Automated Redaction

Memory inputs automatically pass through Google Cloud DLP (Data Loss Prevention) before database persistence:

1. **Strictly Blocked / Redacted Entities:**
   - Government ID numbers (SSN, Passport, Aadhaar, Driver's License)
   - Credit Card & Banking Numbers (PAN, CVV, IBAN)
   - Passwords and auth tokens
   *Action:* Automatically masked with `[REDACTED_FINANCIAL]` or `[REDACTED_ID]` before storage.

2. **Sensitive Personal Categories (Health, Grief, Bereavement):**
   - The system detects bereavement (e.g., funeral, memorial) or traumatic medical events.
   - *Action:* The prompt engine marks the cluster as `EXCLUDED_FROM_SURFACING` so that Google Photos never uses the photo or memory for cheerful retrospective alerts (e.g. "On this day 2 years ago").

---

### 6. Deletion Cascades & Right to Erasure

When a user triggers `DELETE /v1/memory/contexts/{memory_id}` or deletes their Google Account:

1. **Stage 1 — Synchronous Soft-Delete (0ms):**
   - Cloud Spanner record status updated to `TOMBSTONE`.
   - Redis cache key invalidated immediately.
   - Excluded from all search and prompt queries instantly.
2. **Stage 2 — Asynchronous Hard Purge ($\le 24$ hours):**
   - Cloud Tasks dispatches vector index deletion to Vertex AI Matching Engine stream endpoint.
   - Media associations dissociated in Cloud Spanner.
   - Database record physically overwritten.
3. **Stage 3 — Backup Purge (30 days):**
   - Database backups expire within standard 30-day GCP snapshot lifecycle.

---

### 7. Security Controls & Access Authorization

1. **Access Control:** All internal engineering access to user memory tables is strictly prohibited in production. Zero engineer access via `sudo` or Spanner Studio (enforced via GCP Access Transparency).
2. **Key Management:** Customer-Managed Encryption Keys (CMEK) via Google Cloud KMS with annual automated key rotation.
3. **Network Isolation:** All microservices run inside private VPC Service Controls (VPC-SC) perimeters with private Google access. No public IP addresses on databases or internal endpoints.

---

### 8. Legal Signoff Checklist

- [x] **Privacy Legal Counsel:** Approved data flow and consent copy.
- [x] **Product Security (SecOps):** Approved CMEK configuration and DLP pipeline.
- [x] **AI Ethics Committee:** Approved non-training enterprise Gemini agreement.
- [x] **Data Protection Officer (DPO):** Validated GDPR Article 17 and 20 compliance.
