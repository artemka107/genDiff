install:
	npm install
start:
	npm run build
publish:
	npm publish
lint:
	npm run eslint .
run:
	npm run babel-node -- src/bin/gendiff.js -f tree __tests__/__fixtures__/json/before.json package.json
test:
	npm run test
devTest:
	npm run devTest
