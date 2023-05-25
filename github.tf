# provider "github" {
#   token = var.github_token
# }

# # repository resource
# resource "github_repository" "git_repo" {
#   name        = local.github.project_name
#   description = local.github.project_description
#   visibility  = "public"
#   auto_init   = true
# }

# # create branch named master
# resource "github_branch" "master_branch" {
#   repository = github_repository.git_repo.name
#   branch     = "master"
# }

# # create default branch
# resource "github_branch_default" "default_branch" {
#   repository = github_repository.git_repo.name
#   branch     = github_branch.master_branch.branch
# }

# # output
# output "github_repository_url" {
#   value = github_repository.git_repo.html_url
# }
