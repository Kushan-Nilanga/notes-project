resource "google_secret_manager_secret" "webhook_trigger_secret_key" {
  secret_id = "${local.github.project_name}-webhook-trigger-secret-key"

  replication {
    user_managed {
      replicas {
        location = local.google.region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "webhook_trigger_secret_key_data" {
  secret      = google_secret_manager_secret.webhook_trigger_secret_key.id
  secret_data = "secretkeygoeshere"
}

data "google_iam_policy" "secret_accessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    members = [
      "serviceAccount:${var.service_account}"
    ]
  }
}

resource "google_secret_manager_secret_iam_policy" "policy" {
  project     = google_secret_manager_secret.webhook_trigger_secret_key.project
  secret_id   = google_secret_manager_secret.webhook_trigger_secret_key.secret_id
  policy_data = data.google_iam_policy.secret_accessor.policy_data
}

resource "google_cloudbuild_trigger" "webhook-config-trigger" {
  name        = "${local.github.project_name}-webhook-config-trigger"
  description = "acceptance test example webhook build trigger"

  github {
    owner = "Kushan-Nilanga"
    name  = github_repository.git_repo.name
    push {
      branch = "^master$"
    }
  }
  filename        = "cloudbuild.yaml"
}

output "console_url" {
  value = "https://console.cloud.google.com/cloud-build/triggers?project=${local.google.project_id}"
}
