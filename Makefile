.PHONY: install lint test coverage

# Install dependencies
install:
	npm i

# Lints all files, and attempts to fix any that it can
lint:
	node ./node_modules/.bin/eslint . --fix

# Run tests
test:
	npm test

# Run coverage tests
coverage:
	npm run coverage
