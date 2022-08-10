#!/bin/sh
# Cleans up containers
# Script for cleaning some docker volumes, secrets, networks and containers

set -e
set -u

docker stop $(docker ps -a -q) \
  && sleep 5 \
  && docker rm $(docker ps -a -q) \
  && docker container prune -f \
  && echo "Containers stopped and removed succesfully" \
  && docker ps -a

docker volume prune -f && docker network prune -f

