provider "google" {
  project     = local.google.project_id
  region      = local.google.region
  zone        = local.google.zone
  credentials = local.google.credentials
}

resource "google_container_cluster" "primary" {
  name     = "${local.github.project_name}-cluster"
  location = local.google.zone

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "${local.github.project_name}-node-pool"
  location   = local.google.zone
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    preemptible = true

    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    service_account = var.service_account
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

output "cluster_console_url" {
  value = "https://console.cloud.google.com/kubernetes/clusters/details/${google_container_cluster.primary.name}?project=${local.google.project_id}"
}
