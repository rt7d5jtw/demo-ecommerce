#!/bin/sh
# Cleans up containers
# Script for cleaning some docker volumes, secrets, networks and containers

set -e
set -u

docker volume prune -f && docker network prune -f

docker stop $(docker ps -a -q) \
  && docker rm $(docker ps -a -q) \
  && docker container prune -f \
  && echo "Containers stopped and removed succesfully" \
  && docker ps -a
