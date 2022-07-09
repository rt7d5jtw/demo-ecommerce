IMAGE_NAME := chocoapp
BASE_IMAGE := node:16.15.1-alpine3.15
TAG := 1.0
DB_ID := $(shell docker ps -f "ancestor=postgres:14.1" -q)
APP_ID := $(shell docker ps -f "ancestor=chocoapp:1.0" -q)

all: net vol local

# Only deploys PostgreSQL 14.1
database:
	docker-compose -f docker-compose.yml up -d postgres
	docker-compose logs -f

pull:
	docker pull $(BASE_IMAGE)

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

net:
	docker network create -d overlay --attachable perunanetti \
		--opt encrypted=true

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

clean:
	sh res/clean.sh
	docker rmi $(IMAGE_NAME):$(TAG)
	docker image prune -f
	sleep 2
	docker volume prune -f
	docker network prune -f

.PHONY: database pull build net vol local test e2e clean logs
