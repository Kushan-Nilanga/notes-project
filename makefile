
graph:
	@terraform graph | dot -Tpng > graph.png

plan:
	@terraform plan

apply:
	@terraform apply --auto-approve
