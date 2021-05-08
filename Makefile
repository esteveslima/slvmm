# Command aliases to setup development environment

up:
	npm run docker:up
clean-up:
	npm run docker:up:clean

down:
	npm run docker:down
clean-down:
	npm run docker:down:clean
clear:
	npm run clear

rebuild:
	npm run docker:down && npm run docker:up

# Commands to attach shell(In vscode can be attached by rigt-clicking the container in the docker extension section)
sh:
	npm run docker:sh
bash:
	npm run docker:bash



# DEPRECATED: now referencing package.json scripts

# COMPOSE_PATH=./docker-compose.yml
# SERVERLESS_SERVICE_NAME=serverless-container

# up:
# 	docker-compose --file $(COMPOSE_PATH) up --detach
# clean-up:
# 	docker-compose --file $(COMPOSE_PATH) up --detach --build --force-recreate --always-recreate-deps

# down:
# 	docker-compose --file $(COMPOSE_PATH) down && make wipe
# clean-down:
# 	docker-compose --file $(COMPOSE_PATH) down --rmi all --volumes --remove-orphans && make wipe
# wipe:
# 	sudo rm -rf .volumes/

# rebuild:
# 	make down && make up

# # Commands to attach shell(In vscode can be attached by rigt-clicking the container in the docker extension section)
# sh:
# 	docker-compose --file $(COMPOSE_PATH) exec --privileged $(SERVERLESS_SERVICE_NAME) bash
# bash:
# 	docker-compose --file $(COMPOSE_PATH) exec --privileged $(SERVERLESS_SERVICE_NAME) bash
