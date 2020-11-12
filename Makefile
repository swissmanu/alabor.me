install:
	bundle install
.PHONY: install

start:
	bundle exec jekyll serve --drafts
.PHONY: start
