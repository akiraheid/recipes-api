#!/bin/bash
# Set up mongo database to log into

db=$1
shift
mongoargs=$@

pod=db-configure-pod

cp -n .env.example .env

podman pod create --name $pod
podman run -d \
	--pod $pod \
	--name $db \
	--volume=$db:/data/db \
	$mongoargs

sleep 1s

source .env

code="db.createUser({user:'${MONGO_USERNAME}',pwd:'${MONGO_PASSWORD}',roles:[{role:'userAdminAnyDatabase',db:'admin'}]})"

podman run --rm \
	--pod $pod \
	--volume=$db:/data/db \
	$mongoargs mongo 127.0.0.1:27017/admin --eval $code

# Clean up set up DB container
podman stop $db
podman rm $db
