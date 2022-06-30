IMAGE_NAME := chocoapp
BASE_IMAGE := node:16.15.1-alpine3.15
TAG := 1.0
DB_ID := $(shell docker ps -f "ancestor=postgres:14.1" -q)
APP_ID := $(shell docker ps -f "ancestor=chocoapp:1.0" -q)

# Only deploys PostgreSQL 14.1
database:
	docker-compose -f docker-compose.yml up -d postgres
	docker-compose logs -f

pull:
	docker pull $(BASE_IMAGE)

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

local:
	docker-compose -f docker-compose.yml up -d

logs:
	docker logs -f $(APP_ID)

clean:
	sh res/clean.sh
	docker rmi $(IMAGE_NAME):$(TAG)
	docker image prune -f
	sleep 2
	docker volume prune -f
	docker network prune -f

.PHONY: pull build local clean logs logs
