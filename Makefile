# ------------------------------------------------------------------------------
# PROJECT CONFIGURATION
# ------------------------------------------------------------------------------
IMAGE_NAME := ecommerce-demo
TAG        := 1.0
BASE_IMAGE := node:16.15.1-alpine3.15
DB_OWNER   := postgres # Database owner for local psql commands

all: local logs

# ------------------------------------------------------------------------------
# DOCKER SETUP
# ------------------------------------------------------------------------------
.PHONY: build pull local api database logs rmimg

# Builds the Docker image locally
build:
	docker build --progress=plain -t $(IMAGE_NAME):$(TAG) .

# Pulls the specified base image
pull:
	docker pull $(BASE_IMAGE)

# Starts all services from docker-compose.yml (DB and API)
local:
	docker-compose up -d

# Deploys only the NestJS server
api:
	docker-compose up -d api
	docker-compose logs -f api

# Deploys only the PostgreSQL database
database:
	docker-compose up -d postgres
	docker-compose logs -f postgres

# Streams logs from the API container
logs:
	docker-compose logs -f api

# Removes the local Docker image
rmimg:
	docker rmi $(IMAGE_NAME):$(TAG)

# ------------------------------------------------------------------------------
# DATABASE (LOCAL PSQL/HELPER COMMANDS)
# ------------------------------------------------------------------------------
.PHONY: createdb cleandb dump

# Creates the 'bookstore' database locally via psql
createdb:
	sudo -u postgres psql -c 'create database bookstore owner $(DB_OWNER)'

# Drops and recreates the public schema in 'bookstore'
cleandb:
	sudo -u postgres psql -d bookstore -c 'drop schema public cascade; create schema public;'

# Imports initial data from res/data.sql into the 'bookstore' database
dump:
	sudo -u postgres psql bookstore < res/data.sql

# ------------------------------------------------------------------------------
# TESTING & UTILITIES
# ------------------------------------------------------------------------------
.PHONY: test e2e test-client term clean

# Executes API unit/integration tests inside the running container
test:
	docker-compose exec api npm run test

# Executes API end-to-end tests inside the running container
e2e:
	docker-compose exec api npm run test:e2e

# Executes client tests inside the running container
test-client:
	docker-compose exec api npm --prefix ./client run test

# Terminates all currently running node.js runtime processes on the host
term:
	$(eval NODE_PID := $(shell pgrep node))
	@if [ -z "$(NODE_PID)" ]; then echo "No node processes running."; else kill -15 $(NODE_PID); fi

# Cleans up unused Docker resources and custom shell cleanup
clean:
	sh res/clean.sh
	docker-compose down -v --rmi local # Stops containers, removes volumes, and local images
	docker system prune -f
