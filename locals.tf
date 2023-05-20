locals {
  github = {
    project_name        = "notes-project"
    project_description = "This is a project for notes"
  }

  google = {
    project_id  = "loyal-gateway-387301"
    region      = "australia-southeast1"
    zone        = "australia-southeast1-a"
    credentials = file("account.json")
  }
}
