# Recipe REST API

The REST API for the recipes application that handles logic for:
* users

## Setting up

After cloning this repository, run `make setup` to build and test the app.

```console
$ make test
...Building output...
...Testing output...
Success!
```

Failures indicate that this system is not supported by this repository.

## Running the app

After cloning the repository, run `make configure-db` to set up the initial recipe database.

Run `make start` to build and start the pod.

```console
$ make configure-db
$ make start
...Building output...
```

The API will be running at `http://localhost:8080`.
