locals {
  region = "europe-north1"
  project = "turbothrift"
}

terraform {
  backend "gcs" {
    bucket  = "turbothrift-state-dev"
  }
}

provider "google" {
  project = local.project
  region  = local.region
}

resource "google_cloud_run_service" "frontendservice" {
  name     = "Turbothrift frontend service"
  location = local.region

  template {
    spec {
      containers {
        image = "gcr.io/${local.project}/turbothrift_client_release:latest"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.frontendservice.location
  project     = google_cloud_run_service.frontendservice.project
  service     = google_cloud_run_service.frontendservice.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
