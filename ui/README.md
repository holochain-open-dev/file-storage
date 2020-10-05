# UI Developer Setup

UI module for the `calendar-events-zome`.

## Requirements

- Having run through [holochain RSM installation](https://github.com/holochain/holochain-dna-build-tutorial).
- Having [holochain-run-dna](https://www.npmjs.com/package/@holochain-open-dev/holochain-run-dna) installed.

## Local Demo with `@web/dev-server`

First, [build the holochain dna](/zomes/README.md). Run this from inside the `nix-shell` in which you have the `holochain` binary install.

Run this from inside the `nix-shell` in which you have the `holochain` binary install.

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
Take into account that this will run the holochain conductor in the background and connect the UI to the actual conductor.

## Running only the UI

```bash
npm run start-ui
```

## Building

```bash
npm run build
```

## Testing with Karma

To run the suite of karma tests, run

```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test-watch
```

## E2E tests

First, [build the holochain dna](/zomes/README.md). Run this from inside the `nix-shell` in which you have the `holochain` binary install.

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

After this, it will be accessible in the appropriate Github Pages URL (eg. https://holochain-open-dev.github.io/calendar-events-module).
