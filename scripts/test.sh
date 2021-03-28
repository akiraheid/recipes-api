#!/bin/bash

set -x

name=$1
shift
mongoargs=$@

pod="$name-pod"
db="$name-db"

# Clear existing test pod and volume
podman pod stop $pod
podman pod rm $pod
podman volume rm $db

# Set up test db
bash ./scripts/configuremongo.sh $db $mongoargs

# Start API
date -u
bash ./scripts/start.sh $name $mongoargs

# Delay to allow API to start
sleep 3s

# Start test
date -u
podman run --rm --pod $pod \
	-v `pwd`/test/:/test/test/:ro \
	localhost/$name

# Clean up test pod and volume
podman pod stop $pod
podman pod rm $pod
podman volume rm $db
