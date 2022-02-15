#!/bin/sh

command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is required for this script to run, but it's not installed. Aborting."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo >&2 "jq is required for this script to run, but it's not installed. Aborting."; exit 1; }
command -v curl >/dev/null 2>&1 || { echo >&2 "curl is required for this script to run, but it's not installed. Aborting."; exit 1; }
command -v cat >/dev/null 2>&1 || { echo >&2 "cat is required for this script to run, but it's not installed. Aborting."; exit 1; }
command -v sed >/dev/null 2>&1 || { echo >&2 "sed is required for this script to run, but it's not installed. Aborting."; exit 1; }

image_check=$(docker images | awk '{ print $1}' | grep -E '\bchocoapp\b')

# checks for image named "chocoapp"
if [ -z "$image_check" ]; then
  read -p "You dont seem to have image named \"chocoapp\", are you sure you want to continue? [Y]es/[N]o " -n 1 -r; echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
  fi
fi

# setup containers
docker-compose up -d && echo "Starting up the environment..."

# depends on postgres image being named postgres:14.1
postgres_cid=$(docker ps -a | awk '$2=="postgres:14.1" { print $1 }')
postgres_health=$(docker exec -t $postgres_cid pg_isready -U postgres)

# depends on application image being named chocoapp:1
app_cid=$(docker ps -a | awk '$2=="chocoapp:1" { print $1 }')

# gets the jwt_token
jwt_token=$(curl -X POST http://localhost:3000/auth/signin -H 'Content-Type: application/json' -d '{"email": "meemau@gmail.com", "password": "habbo1234"}' | jq '.accessToken')

if [ -z "$postgres_cid" ]; then
  echo "Could not find postgres container"
  exit 1
else
  echo "Container with ID: $postgres_cid detected, running postgres:14.1 image"
  if [ -n "$postgres_health" ]; then
    echo "Postgres 14.1 Container is running :)"
    echo "Checking for application container..."
    echo "application container id is: $app_cid"
    sleep 1
    if [ -n "$app_cid" ]; then
      echo "Application container found"
      if docker exec -t $app_cid npm run test; then
        echo "Application container tests working :)"
        docker ps -a
      fi
    else
      echo "No container found, exit status: $?"
    fi
  else
    echo "Failure, exit status: $?"
  fi
fi

# try the endpoint for a test
if curl -I http://localhost:3000/; then
  echo "Application website up."
  echo "Testing logging in..."
  # try logging in
  if curl -X POST http://localhost:3000/auth/signin -H 'Content-Type: application/json' -d '{"email": "meemau@gmail.com", "password": "habbo1234"}' | jq '.accessToken' > /tmp/token.txt; then
    echo "Success logging in"
    cat /tmp/token.txt | sed 's/"//g' && echo "Token is set"
    sleep 1 
    echo "Trying /users endpoint with jwt token..."
    # try endpoint with the jwt token
    token=$(cat /tmp/token.txt | sed 's/"//g')
    if curl -H 'Accept: application/json' -H "Authorization: Bearer $token" http://localhost:3000/users | jq ; then
      echo "Success :)"
      echo "Setup ready."
    fi
  fi
fi



