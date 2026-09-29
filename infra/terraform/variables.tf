variable "project_id" {
  description = "Google Cloud Project ID for AI Memory Context service"
  type        = string
  default     = "google-photos-memory-mvp-dev"
}

variable "region" {
  description = "Default GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "spanner_processing_units" {
  description = "Processing units for Cloud Spanner instance (100 PU = 0.1 node for dev)"
  type        = number
  default     = 100
}

variable "redis_memory_size_gb" {
  description = "Memorystore Redis instance cache capacity in GB"
  type        = number
  default     = 1
}

variable "vector_embedding_dimension" {
  description = "Embedding vector dimension (text-embedding-005)"
  type        = number
  default     = 768
}

variable "gemini_model_tier" {
  description = "Primary Gemini model for extraction"
  type        = string
  default     = "gemini-1.5-flash-001"
}
