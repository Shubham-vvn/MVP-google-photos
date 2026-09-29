# Cloud Monitoring Alert: High API Latency (p95 > 500ms)
resource "google_monitoring_alert_policy" "high_api_latency" {
  display_name = "High API Gateway Latency (p95 > 500ms) - ${var.environment}"
  combiner     = "OR"

  conditions {
    display_name = "Cloud Run Request Latency 95th Percentile"
    condition_threshold {
      filter          = "metric.type=\"run.googleapis.com/request_latencies\" AND resource.type=\"cloud_run_revision\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 500

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_PERCENTILE_95"
        cross_series_reducer = "REDUCE_MEAN"
      }
    }
  }

  notification_channels = []
}

# Cloud Monitoring Alert: High Error Rate (> 2%)
resource "google_monitoring_alert_policy" "high_error_rate" {
  display_name = "High API Error Rate (> 2%) - ${var.environment}"
  combiner     = "OR"

  conditions {
    display_name = "5xx HTTP Error Rate"
    condition_threshold {
      filter          = "metric.type=\"run.googleapis.com/request_count\" AND resource.type=\"cloud_run_revision\" AND metric.labels.response_code_class=\"5xx\""
      duration        = "180s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0.02

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_SUM"
      }
    }
  }

  notification_channels = []
}

# Cloud Monitoring Dashboard for Memory Context MVP
resource "google_monitoring_dashboard" "service_dashboard" {
  dashboard_json = jsonencode({
    displayName = "AI Memory Context Service Health (${var.environment})"
    gridLayout = {
      columns = 2
      widgets = [
        {
          title = "API Request Latencies (p50, p95, p99)"
          xyChart = {
            dataSets = [
              {
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "metric.type=\"run.googleapis.com/request_latencies\" resource.type=\"cloud_run_revision\""
                    aggregation = {
                      perSeriesAligner = "ALIGN_PERCENTILE_95"
                    }
                  }
                }
              }
            ]
          }
        },
        {
          title = "Spanner CPU Utilization"
          xyChart = {
            dataSets = [
              {
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "metric.type=\"spanner.googleapis.com/instance/cpu/utilization\" resource.type=\"spanner_instance\""
                    aggregation = {
                      perSeriesAligner = "ALIGN_MEAN"
                    }
                  }
                }
              }
            ]
          }
        }
      ]
    }
  })
}
