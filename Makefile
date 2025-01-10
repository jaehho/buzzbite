SHELL := /bin/bash

# Common variables
DOCKER_COMPOSE := docker-compose
FRONTEND_DIR := frontend
BACKEND_DIR := backend

.PHONY: backend

help: ## Show available commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

expo_go_local: ## Run frontend locally with Expo
	@$(DOCKER_COMPOSE) up -d --scale frontend=0
	@cd $(FRONTEND_DIR) && \
	npm install && \
	npx expo start
	@$(MAKE) teardown

expo_go_docker: ## Run frontend in Docker with Expo tunnel
	@$(DOCKER_COMPOSE) up -d
	@$(DOCKER_COMPOSE) exec -it frontend npx expo start --tunnel
	@$(MAKE) teardown

eas_build: ## Build mobile app using EAS for android
	@cd $(FRONTEND_DIR) && \
	npm install && \
	npm install -g eas-cli && \
	eas build -p android -e development
	@$(MAKE) teardown

backend: ## Start backend with shell access
	@$(DOCKER_COMPOSE) up -d --scale frontend=0
	- @$(DOCKER_COMPOSE) exec -it backend bash
	@$(MAKE) teardown

follow_backend: ## Tail backend logs
	@$(DOCKER_COMPOSE) logs -f backend

resetdb: ## Reset the database to initial test data
	@$(DOCKER_COMPOSE) up -d --scale frontend=0
	@$(DOCKER_COMPOSE) exec backend python manage.py resetdb
	@$(MAKE) teardown

docker_build: ## Build Docker images
	@$(DOCKER_COMPOSE) build

clean: ## Remove Python cache files
	@find . -name "*.pyc" -exec rm -rf {} \;
	@find . -name "__pycache__" -delete

chownme: ## Change ownership of files to current user
	@sudo chown -R $(shell whoami) ./

teardown: ## Stop Docker containers and clean up
	@$(DOCKER_COMPOSE) down -t 1
