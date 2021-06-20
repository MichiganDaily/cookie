<<<<<<< HEAD
.PHONY: dev build gh-pages build-prod

build-prod: export NODE_ENV = production
build-prod: build

install:
	yarn install
	rm -rf dist/
	git worktree add -b gh-pages dist

dev:
	yarn run dev

build:
	rm -rf build/*
	rm -rf dist/*
	yarn run build

gh-pages: build-prod
	(cd dist; git add --all)
	(cd dist; git commit -m "Build output as of $(git log '--format=format:%H' main -1)")
	git push -u origin gh-pages
=======
init:
	rm -rf .git/
	@echo "Installing dependencies..."
	yarn install -D
	@echo "Installing Makefile..."
	mv Makefile.project Makefile
	@echo "Setting up GH Pages deployment"
	git init
	git add .
	git commit -m "Initial Commit"
	git worktree add -b gh-pages dist
>>>>>>> 8575965a6c454ebc2ebb5a2044c302698a333f44
