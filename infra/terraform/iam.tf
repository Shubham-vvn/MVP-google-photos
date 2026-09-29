# Service Account for API Gateway & Public Serving
resource "google_service_account" "api_service_account" {
  account_id   = "sa-memory-api-${var.environment}"
  display_name = "Memory Context API Service Account (${var.environment})"
}

# Service Account for Background Worker (NLU, Vision, Embeddings)
resource "google_service_account" "worker_service_account" {
  account_id   = "sa-memory-worker-${var.environment}"
  display_name = "Memory Context Async Worker Service Account (${var.environment})"
}

# API Service Account IAM Roles
resource "google_project_iam_member" "api_spanner_user" {
  project = var.project_id
  role    = "roles/spanner.databaseUser"
  member  = "serviceAccount:${google_service_account.api_service_account.email}"
}

resource "google_project_iam_member" "api_tasks_enqueuer" {
  project = var.project_id
  role    = "roles/cloudtasks.enqueuer"
  member  = "serviceAccount:${google_service_account.api_service_account.email}"
}

resource "google_project_iam_member" "api_trace_agent" {
  project = var.project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.api_service_account.email}"
}

# Worker Service Account IAM Roles (ML & Backend Access)
resource "google_project_iam_member" "worker_spanner_user" {
  project = var.project_id
  role    = "roles/spanner.databaseUser"
  member  = "serviceAccount:${google_service_account.worker_service_account.email}"
}

resource "google_project_iam_member" "worker_vertex_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.worker_service_account.email}"
}

resource "google_project_iam_member" "worker_vision_user" {
  project = var.project_id
  role    = "roles/serviceusage.serviceUsageConsumer"
  member  = "serviceAccount:${google_service_account.worker_service_account.email}"
}

resource "google_project_iam_member" "worker_dlp_user" {
  project = var.project_id
  role    = "roles/dlp.user"
  member  = "serviceAccount:${google_service_account.worker_service_account.email}"
}

resource "google_project_iam_member" "worker_metrics_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.worker_service_account.email}"
}
