terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.20.0"
    }
  }

  backend "gcs" {
    bucket = "google-photos-memory-mvp-tfstate"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Enable Essential Google Cloud APIs
resource "google_project_service" "enabled_apis" {
  for_each = toset([
    "spanner.googleapis.com",
    "redis.googleapis.com",
    "aiplatform.googleapis.com",
    "run.googleapis.com",
    "cloudtasks.googleapis.com",
    "vision.googleapis.com",
    "speech.googleapis.com",
    "dlp.googleapis.com",
    "monitoring.googleapis.com",
    "cloudtrace.googleapis.com",
    "secretmanager.googleapis.com"
  ])

  service            = each.key
  disable_on_destroy = false
}
