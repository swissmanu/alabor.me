install:
	bundle install
.PHONY: install

start:
	bundle exec jekyll serve --host 0.0.0.0 --drafts
.PHONY: start
