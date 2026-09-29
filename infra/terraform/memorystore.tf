# Cloud Memorystore (Redis) Instance for Caching & Cooldowns
resource "google_redis_instance" "memory_cache" {
  name           = "memory-cache-${var.environment}"
  tier           = var.environment == "prod" ? "STANDARD_HA" : "BASIC"
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region

  display_name = "AI Memory Context Redis Cache (${var.environment})"
  redis_version = "REDIS_7_0"

  labels = {
    env     = var.environment
    service = "ai-memory-context"
  }

  depends_on = [google_project_service.enabled_apis]
}

output "redis_host" {
  value       = google_redis_instance.memory_cache.host
  description = "Memorystore Redis primary host IP"
}

output "redis_port" {
  value       = google_redis_instance.memory_cache.port
  description = "Memorystore Redis port"
}
