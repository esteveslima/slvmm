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
