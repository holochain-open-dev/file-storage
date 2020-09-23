# UI Developer Setup

UI module for the `calendar-events-zome`.

> This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Requirements

- Having run through [holochain RSM installation](https://github.com/holochain/holochain-dna-build-tutorial).
- Having [holochain-run-dna](https://www.npmjs.com/package/@holochain-open-dev/holochain-run-dna) installed.

## Local Demo with `es-dev-server`

Run this from inside the `nix-shell` in which you have the `holochain` binary install.

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
Take into account that this will run the holochain conductor in the background and connect the UI to the actual conductor.

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
npm run test:watch
```

## E2E tests

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
npm run storybook:build
```

## Linting with ESLint, Prettier, and Types

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
npm run npm:publish
```

This will build the application, copy the `README.md`, `LICENSE` and `package.json` to the `dist` folder and publish that.