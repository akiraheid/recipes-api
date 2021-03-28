name = recipe-api
testname = $(name)-test
pwd:=$(shell pwd)
pod = $(name)-pod
db = $(name)-db
mongoargs = --env-file=.env mongo:4.0.14

build: Dockerfile clean
	cp -n .env.example .env
	podman build -t $(name) -f Dockerfile .

build-test: Dockerfile.test
	podman build -t $(testname) -f Dockerfile.test .

clean:
	-rm -rf node_modules

configure-db:
	./scripts/configuremongo.sh $(db) $(mongoargs)

lint:
	podman run --rm -v ${pwd}/:/data/:ro cytopia/eslint .

start: build
	cp -n .env.example .env
	bash ./scripts/start.sh $(name) $(mongoargs)

stop:
	-podman pod stop $(pod)
	-podman pod rm $(pod)

test: lint build build-test
	bash ./scripts/test.sh $(testname) $(mongoargs)

.PHONY: build clean lint start stop setup
