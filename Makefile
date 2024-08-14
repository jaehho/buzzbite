SHELL := /bin/bash # Use bash syntax
ARG := $(word 2, $(MAKECMDGOALS))

run: 
ifeq ($(ARG),local)
	$(MAKE) run_app_local
else
	$(MAKE) run_app_docker
endif

run_app_local:
	@echo "Starting Docker Compose..."
	@docker-compose up -d
	@echo "Navigating to the React Native project directory..."
	@cd frontend/ && \
	echo "Installing dependencies..." && \
	npm install && \
	echo "Starting the React Native Expo app..." && \
	npm start
	@echo "Stopping Docker Compose..."
	@docker-compose down


run_app_docker:
	@echo "Starting Docker Compose and Expo..."
	@docker-compose up -d
	@echo "Starting the React Native Expo app..."
	@docker-compose exec -it frontend npm start
	@echo "Stopping Docker Compose..."
	@docker-compose down

### From boilerplate
clean:
	@find . -name "*.pyc" -exec rm -rf {} \;
	@find . -name "__pycache__" -delete

test:
	poetry run backend/manage.py test backend/ $(ARG) --parallel --keepdb

test_reset:
	poetry run backend/manage.py test backend/ $(ARG) --parallel

backend_format:
	black backend

# Commands for Docker version
docker_setup:
	docker volume create {{project_name}}_dbdata
	docker compose build --no-cache backend
	docker compose run --rm backend python manage.py spectacular --color --file schema.yml
	docker compose run frontend npm install
	docker compose run --rm frontend npm run openapi-ts

docker_test:
	docker compose run backend python manage.py test $(ARG) --parallel --keepdb

docker_test_reset:
	docker compose run backend python manage.py test $(ARG) --parallel

docker_up:
	docker compose up -d

docker_update_dependencies:
	docker compose down
	docker compose up -d --build

docker_down:
	docker compose down

docker_logs:
	docker compose logs -f $(ARG)

docker_makemigrations:
	docker compose run --rm backend python manage.py makemigrations

docker_migrate:
	docker compose run --rm backend python manage.py migrate

docker_backend_shell:
	docker compose run --rm backend bash

docker_backend_update_schema:
	docker compose run --rm backend python manage.py spectacular --color --file schema.yml

docker_frontend_update_api:
	docker compose run --rm frontend npm run openapi-ts