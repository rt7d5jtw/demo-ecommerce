IMAGE_NAME := ecommerce-demo
BASE_IMAGE := node:16.15.1-alpine3.15

TAG := 1.0

ifeq (, $(shell which docker))
	DB_ID  := $(shell docker ps -f "ancestor=postgres:14.1" -q)
	APP_ID := $(shell docker ps -f "ancestor=chocoapp:1.0" -q)
endif

# Change to your database owner
DB_OWNER := postgres

all: vol local logs

createdb:
	sudo -u postgres psql -c 'create database bookstore owner $(DB_OWNER)'

cleandb:
	sudo -u postgres psql -d bookstore -c 'drop schema cascade; create schema public;'

dump:
	sudo -u postgres psql bookstore < res/data.sql

# Only deploys PostgreSQL 14.1
database:
	docker-compose -f docker-compose.yml up -d postgres
	docker-compose logs -f

# Only deploys the NestJS server
nestjs:
	docker-compose -f docker-compose.yml up -d application
	docker-compose logs -f

pull:
	docker pull $(BASE_IMAGE)

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

vol:
	docker volume create mariadb_data

local:
	docker-compose -f docker-compose.yml up -d

test:
	docker exec -t $(APP_ID) npm run test

e2e:
	docker exec -t $(APP_ID) npm run test:e2e

test-client:
	docker exec -t $(APP_ID) npm --prefix ./client run test

logs:
	docker logs -f $(APP_ID)

rmimg:
	docker rmi $(IMAGE_NAME):$(TAG)

# Terminates all the current running nodejs runtime processes
term:
	$(eval NODE_PID := $(shell pgrep node))
	kill -15 $(NODE_PID)

clean:
	sh res/clean.sh
	docker image prune -f
	sleep 2
	docker volume prune -f
	docker network prune -f

.PHONY: database pull build net vol local test e2e clean rmimg logs
