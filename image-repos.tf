# notes
resource "google_artifact_registry_repository" "notes" {
  location      = local.google.region
  repository_id = "notes"
  description   = "notes docker image"
  format        = "DOCKER"
}

output "gcr_notes_repository" {
  value = "https://console.cloud.google.com/artifacts/docker/${local.google.project_id}/${local.google.region}/${google_artifact_registry_repository.notes.repository_id}?project=${local.google.project_id}"
}