SHELL := /bin/bash

expo_go_local:
	@docker-compose up -d --scale frontend=0
	@cd frontend/ && \
	npm install && \
	npx expo start
	@docker-compose down

expo_go_docker:
	@docker-compose up -d
	@docker-compose exec -it frontend npx expo start --tunnel
	@docker-compose down -t 1

dev:
	@docker-compose up -d --scale frontend=0
	@cd frontend/ && \
	npm install && \
	eas build:run && \
	npx expo start
	@docker-compose down

eas_build:
	@cd frontend/ && \
	npm install && \
	npm install -g eas-cli && \
	eas build -p android -e development
	@docker-compose down

docker_build:
	@docker-compose build

clean:
	@find . -name "*.pyc" -exec rm -rf {} \;
	@find . -name "__pycache__" -delete