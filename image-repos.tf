# notes
resource "google_artifact_registry_repository" "notes" {
  location      = local.google.region
  repository_id = "notes"
  description   = "notes docker image"
  format        = "DOCKER"
}

# auth
resource "google_artifact_registry_repository" "auth" {
  location      = local.google.region
  repository_id = "auth"
  description   = "auth docker image"
  format        = "DOCKER"
}

# audit
resource "google_artifact_registry_repository" "audit" {
  location      = local.google.region
  repository_id = "audit"
  description   = "audit docker image"
  format        = "DOCKER"
}

# bff
resource "google_artifact_registry_repository" "bff" {
  location      = local.google.region
  repository_id = "bff"
  description   = "bff docker image"
  format        = "DOCKER"
}

output "gcr_notes_repository" {
  value = "https://console.cloud.google.com/artifacts/docker/${local.google.project_id}/${local.google.region}/${google_artifact_registry_repository.notes.repository_id}?project=${local.google.project_id}"
}

output "gcr_auth_repository" {
  value = "https://console.cloud.google.com/artifacts/docker/${local.google.project_id}/${local.google.region}/${google_artifact_registry_repository.auth.repository_id}?project=${local.google.project_id}"
}

output "gcr_audit_repository" {
  value = "https://console.cloud.google.com/artifacts/docker/${local.google.project_id}/${local.google.region}/${google_artifact_registry_repository.audit.repository_id}?project=${local.google.project_id}"
}

output "gcr_bff_repository" {
  value = "https://console.cloud.google.com/artifacts/docker/${local.google.project_id}/${local.google.region}/${google_artifact_registry_repository.bff.repository_id}?project=${local.google.project_id}"
}
