# Cloud Spanner Instance
resource "google_spanner_instance" "memory_spanner" {
  name             = "memory-spanner-${var.environment}"
  config           = "regional-${var.region}"
  display_name     = "Google Photos Memory Store (${var.environment})"
  processing_units = var.spanner_processing_units

  labels = {
    env     = var.environment
    service = "ai-memory-context"
  }

  depends_on = [google_project_service.enabled_apis]
}

# Cloud Spanner Database with Table DDL
resource "google_spanner_database" "memory_db" {
  instance = google_spanner_instance.memory_spanner.name
  name     = "memory_db"

  ddl = [
    <<-EOT
    CREATE TABLE MemoryContext (
        user_id STRING(64) NOT NULL,
        memory_id STRING(64) NOT NULL,
        cluster_id STRING(64) NOT NULL,
        status STRING(32) NOT NULL,
        created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
        updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
        user_input JSON NOT NULL,
        extracted_context JSON NOT NULL,
        summary JSON NOT NULL,
        media_associations JSON NOT NULL,
        privacy JSON NOT NULL,
        embedding_bytes BYTES(3072),
        embedding_model STRING(64)
    ) PRIMARY KEY (user_id, memory_id)
    EOT
    ,
    "CREATE INDEX Idx_MemoryContext_Cluster ON MemoryContext (user_id, cluster_id, status)",
    "CREATE INDEX Idx_MemoryContext_Created ON MemoryContext (user_id, created_at DESC) STORING (summary, status)",
    <<-EOT
    CREATE TABLE MemoryCluster (
        user_id STRING(64) NOT NULL,
        cluster_id STRING(64) NOT NULL,
        status STRING(32) NOT NULL,
        created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
        updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
        media_items JSON NOT NULL,
        clustering_metadata JSON NOT NULL,
        prompt_history JSON NOT NULL
    ) PRIMARY KEY (user_id, cluster_id)
    EOT
    ,
    "CREATE INDEX Idx_MemoryCluster_PromptEligibility ON MemoryCluster (user_id, status, created_at DESC)",
    <<-EOT
    CREATE TABLE SemanticIndex (
        user_id STRING(64) NOT NULL,
        index_id STRING(64) NOT NULL,
        memory_id STRING(64) NOT NULL,
        created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
        keyword_tokens ARRAY<STRING(128)> NOT NULL,
        entity_index JSON NOT NULL,
        metadata_index JSON NOT NULL,
        media_ids ARRAY<STRING(64)> NOT NULL
    ) PRIMARY KEY (user_id, index_id)
    EOT
    ,
    "CREATE INDEX Idx_SemanticIndex_Memory ON SemanticIndex (user_id, memory_id)",
    <<-EOT
    CREATE TABLE UserPreferences (
        user_id STRING(64) NOT NULL,
        updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
        memory_prompts_enabled BOOL NOT NULL,
        voice_transcription_enabled BOOL NOT NULL,
        sensitive_detection_enabled BOOL NOT NULL,
        max_prompts_per_week INT64 NOT NULL,
        cooldown_days INT64 NOT NULL,
        custom_rules JSON NOT NULL
    ) PRIMARY KEY (user_id)
    EOT
  ]

  deletion_protection = var.environment == "prod" ? true : false
}
