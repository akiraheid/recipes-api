#!/bin/bash
set -x

name=$1
shift
mongoargs=$@

db=$name-db
pod=$name-pod

# Create pod
podman pod create --name $pod -p 8080:8080

# Start mongo DB
podman run -d --pod $pod \
	--name $db \
	--volume=$db:/data/db \
	$mongoargs

# Start recipe API
podman run -d --pod=$pod \
	--env-file .env \
	--name recipe-api \
	--restart always \
	localhost/recipe-api ./wait-for.sh localhost:27017 -- node src/app.js
