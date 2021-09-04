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
  name     = "turbothrift-client"
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

resource "google_cloud_run_service" "backendservice" {
  name     = "turbothrift-server"
  location = local.region

  template {
    spec {
      containers {
        image = "gcr.io/${local.project}/turbothrift_server_release:latest"
        env {
          name = "GOOGLE_CLIENT_ID"

          # berglas will fetch the password from GCP secret manager
          value = "sm://${local.project}/turbothrift_dev_google_client_id"
        }
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

resource "google_cloud_run_service_iam_policy" "noauthclient" {
  location    = google_cloud_run_service.frontendservice.location
  project     = google_cloud_run_service.frontendservice.project
  service     = google_cloud_run_service.frontendservice.name

  policy_data = data.google_iam_policy.noauth.policy_data
}


resource "google_cloud_run_service_iam_policy" "noauthserver" {
  location    = google_cloud_run_service.backendservice.location
  project     = google_cloud_run_service.backendservice.project
  service     = google_cloud_run_service.backendservice.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
