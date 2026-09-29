# Vertex AI Vector Search (Matching Engine) Index
resource "google_vertex_ai_index" "memory_vector_index" {
  region       = var.region
  display_name = "memory-vector-index-${var.environment}"
  description  = "ScaNN Vector index for multimodal photo memories (768 dimensions)"

  metadata {
    contents_delta_uri = ""
    config {
      dimensions                  = var.vector_embedding_dimension
      approximate_neighbors_count = 100
      distance_measure_type       = "DOT_PRODUCT_DISTANCE"
      algorithm_config {
        tree_ah_config {
          leaf_node_embedding_count    = 1000
          leaf_nodes_to_search_percent = 10
        }
      }
    }
  }

  index_update_method = "STREAM_UPDATE"

  labels = {
    env     = var.environment
    service = "ai-memory-context"
  }

  depends_on = [google_project_service.enabled_apis]
}

# Vertex AI Matching Engine Endpoint
resource "google_vertex_ai_index_endpoint" "memory_index_endpoint" {
  region       = var.region
  display_name = "memory-index-endpoint-${var.environment}"
  description  = "Endpoint for querying memory and photo vector embeddings"

  public_endpoint_enabled = false

  labels = {
    env     = var.environment
    service = "ai-memory-context"
  }

  depends_on = [google_project_service.enabled_apis]
}

output "vertex_index_id" {
  value       = google_vertex_ai_index.memory_vector_index.id
  description = "Vertex AI Vector Index ID"
}

output "vertex_endpoint_id" {
  value       = google_vertex_ai_index_endpoint.memory_index_endpoint.id
  description = "Vertex AI Vector Index Endpoint ID"
}
