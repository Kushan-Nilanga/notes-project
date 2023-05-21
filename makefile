
graph:
	@terraform graph | dot -Tpng > graph.png

plan:
	@terraform plan

apply:
	@terraform apply --auto-approve

run:
	@docker-compose up -d --build

stop:
	@docker-compose down
