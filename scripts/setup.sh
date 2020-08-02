#!/bin/bash
set -e
echo "Checking for docker"
docker --version

echo "Checking for docker-compose"
docker-compose --version
