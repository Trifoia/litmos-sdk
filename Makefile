.PHONY: install lint test coverage package

PACKAGE_LOCATION = nodejs/node_modules

# Destroys node modules
clean:
	rm -rf node_modules/

# Install dependencies
install: clean
	npm i

# Install production dependencies
install-prod: clean
	npm i --only=prod

# Lints all files, and attempts to fix any that it can
lint:
	node ./node_modules/.bin/eslint . --fix

# Lints without fixing. Used in validation testing
lint-nofix:
	node ./node_modules/.bin/eslint .

# Run tests
test:
	npm test

# Run coverage tests
coverage:
	npm run coverage

# Zips up all required files for uploading to a Lambda Layer
package: install-prod # clean install lint test
	# Clean and install only production modules
	rm -rf nodejs

	# Create package directories
	mkdir -p $(PACKAGE_LOCATION)
	mkdir -p build

	# Copy files and directories
	cp litmos.js $(PACKAGE_LOCATION)
	cp -a lib/ $(PACKAGE_LOCATION)
	cp -a node_modules/. $(PACKAGE_LOCATION)

	# Zip
	zip -q -T build/build.zip -r nodejs

	# Re-install dev dependencies when we are done
	rm -rf node_modules
	npm install
