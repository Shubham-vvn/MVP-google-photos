-- ==============================================================================
-- Cloud Spanner Schema Definition (Google Standard SQL)
-- Google Photos — AI Memory Context MVP
-- Document Reference: architecture.md §4.1 - §4.4
-- ==============================================================================

-- 1. Memory Context Table
-- Stores user memories, NLU extractions, summaries, and media associations
CREATE TABLE MemoryContext (
    user_id STRING(64) NOT NULL,
    memory_id STRING(64) NOT NULL,
    cluster_id STRING(64) NOT NULL,
    status STRING(32) NOT NULL, -- 'processing', 'active', 'archived', 'tombstone'
    created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    
    -- JSON Data Columns
    user_input JSON NOT NULL,            -- { raw_text, input_method, language, text_from_stt }
    extracted_context JSON NOT NULL,     -- { people, places, activities, objects, emotions, etc. }
    summary JSON NOT NULL,               -- { short, keywords }
    media_associations JSON NOT NULL,    -- Array of { media_id, relevance, specific_concepts }
    privacy JSON NOT NULL,               -- { user_consented, ai_context_stored, source_labels_preserved }
    
    -- Embeddings binary backup (768 float32 values = 3072 bytes)
    embedding_bytes BYTES(3072),
    embedding_model STRING(64)
) PRIMARY KEY (user_id, memory_id);

-- Secondary Index: Fast cluster-to-memory lookup
CREATE INDEX Idx_MemoryContext_Cluster 
ON MemoryContext (user_id, cluster_id, status);

-- Secondary Index: Fast recency sorting for user timeline
CREATE INDEX Idx_MemoryContext_Created 
ON MemoryContext (user_id, created_at DESC)
STORING (summary, status);


-- 2. Memory Cluster Table
-- Stores photo/video clusters detected by edge/cloud clustering engine
CREATE TABLE MemoryCluster (
    user_id STRING(64) NOT NULL,
    cluster_id STRING(64) NOT NULL,
    status STRING(32) NOT NULL, -- 'pending_prompt', 'prompted', 'dismissed', 'completed'
    created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    
    media_items JSON NOT NULL,           -- Array of { media_id, type, captured_at, ... }
    clustering_metadata JSON NOT NULL,   -- { time_span, location, media_count, quality_score }
    prompt_history JSON NOT NULL         -- Array of { prompted_at, action, memory_id }
) PRIMARY KEY (user_id, cluster_id);

-- Secondary Index: Find eligible pending clusters for prompting
CREATE INDEX Idx_MemoryCluster_PromptEligibility 
ON MemoryCluster (user_id, status, created_at DESC);


-- 3. Semantic Inverted Keyword Index Table
-- Fast keyword and entity matching for hybrid RRF search
CREATE TABLE SemanticIndex (
    user_id STRING(64) NOT NULL,
    index_id STRING(64) NOT NULL,
    memory_id STRING(64) NOT NULL,
    created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    
    keyword_tokens ARRAY<STRING(128)> NOT NULL, -- Lowercase normalized tokens
    entity_index JSON NOT NULL,                 -- { people, places, activities }
    metadata_index JSON NOT NULL,               -- { date_range, location_geo, media_count }
    media_ids ARRAY<STRING(64)> NOT NULL        -- Associated media IDs
) PRIMARY KEY (user_id, index_id);

-- Secondary Index: Link index entry back to memory
CREATE INDEX Idx_SemanticIndex_Memory 
ON SemanticIndex (user_id, memory_id);


-- 4. User Preferences & Settings Table
-- User-level toggles, cooldowns, and privacy filters
CREATE TABLE UserPreferences (
    user_id STRING(64) NOT NULL,
    updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    
    memory_prompts_enabled BOOL NOT NULL,
    voice_transcription_enabled BOOL NOT NULL,
    sensitive_detection_enabled BOOL NOT NULL,
    max_prompts_per_week INT64 NOT NULL,
    cooldown_days INT64 NOT NULL,
    custom_rules JSON NOT NULL -- { muted_locations, excluded_people_ids, etc. }
) PRIMARY KEY (user_id);
