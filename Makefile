pwd:=$(shell pwd)

build: Dockerfile clean
	cp -n .env.example .env
	docker build -t recipes-api .

clean:
	-rm -rf node_modules

lint:
	docker run --rm -v ${pwd}/:/data/:ro cytopia/eslint .

serve: build
	cp -n .env.example .env
	docker-compose up -d
	echo "App is running!"

setup:
	scripts/setup.sh
	make test
	echo "Success!"

test: lint

.PHONY: build clean lint serve setup
