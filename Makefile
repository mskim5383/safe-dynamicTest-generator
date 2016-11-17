
EXCLUDE=""

all: compile

compile: bin/src/run.js

bin/src/run.js: src/*.ts src/util/*.ts
	grunt

clean:
	rm -rf bin

.PHONY: all compile test clean experiment process
