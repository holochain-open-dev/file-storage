**[@holochain-open-dev/file-storage](README.md)**

> [Globals](globals.md)

# UI Developer Setup

UI module for the `file_storage` zome.

## Requirements

- Having run through [holochain RSM installation](https://github.com/holochain/holochain-dna-build-tutorial).
- Having [holochain-run-dna](https://www.npmjs.com/package/@holochain-open-dev/holochain-run-dna) installed.

## Local Demo with `@web/dev-server`

First, [build the holochain dna](/zomes/README.md).

Run this from inside the `nix-shell` in which you have the `holochain` binary install.

```bash
npm start
```

This will serve a local development server that serves the basic demo located in `demo/index.html` at `localhost:8080/demo`.
Take into account that this will run the holochain conductor in the background and connect the UI to the actual conductor.

## Running only the UI

```bash
npm run start-ui
```

## Building

```bash
npm run build
```

## Testing with @web/test-runner

To run the suite of karma tests, run

```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run two terminals:

In the first terminal:
```bash
npm run build-watch
```

In the second terminal:
```bash
npm run test-watch
```

## E2E tests

First, [build the holochain dna](/zomes/README.md). 

Run this from inside the `nix-shell` in which you have the `holochain` binary install.

```bash
npm run e2e
```

Take into account that this will run the holochain conductor in the background to perform the tests.

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run build-storybook
```

## Linting with ESLint

To scan the project for linting errors, run

```bash
npm run lint
```

To automatically fix many linting errors, run

```bash
npm run format
```

## Publishing to npm

```bash
npm run publish-npm
```

This will build the application, copy the `README.md`, `LICENSE` and `package.json` to the `dist` folder and publish that.

## Publishing storybook documentation to Github Pages

```bash
npm run publish-storybook
```

This will build the static storybook site, and deploy it directly in the `gh-pages` of your repository.

After this, it will be accessible in the appropriate Github Pages URL (https://holochain-open-dev.github.io/file-storage-module).

## Publishing in a branch on this repository

If you don't want to publish to NPM yet, you can "publish" a build of this module with:

```bash
npm run publish-to-branch
```

Now, a built version of this module will be at the root of the `ui-build` branch, which other `package.json` files can reference like this:

```json
  "dependencies": {
    "@holochain-open-dev/file-storage": "holochain-open-dev/file-storage#ui-build",
  }
```
