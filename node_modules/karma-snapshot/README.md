# Karma Plugin for Snapshot Testing

`karma-snapshot` provides a communication layer between browser and [Karma](http://karma-runner.github.io/) to store and
retrieve snapshots.

![karma-snapshot Example][example]

## Supported Assertion Libraries

- [chai](https://github.com/localvoid/chai-karma-snapshot)
- [iko](https://github.com/localvoid/iko)

## Snapshot Format

Snapshot can be stored in different formats. Right now there are two formats supported: `md` and `indented-md`.

### Markdown Format

This format is preferred when you specify language for code blocks in an assertion plugin. With this format, code
editors will automatically highlight syntax of code blocks.

````md
# `src/html.js`

## `Sub Suite`

####   `HTML Snapshot`

```html
<div>
  <span />
</div>
```
````

### Indented Markdown Format

```md
# `src/html.js`

## `Sub Suite`

####   `HTML Snapshot`

    <div>
      <span />
    </div>
```

## Snapshot File Path

Snapshot file path is extracted from the name of the root suit cases and stored alongside with a tested files in a
`__snapshots__` directory.

Snapshot file path can be changed by providing a custom `pathResolver` in snapshot config.

## Usage Example with Mocha and Chai

```sh
$ npm install karma karma-webpack karma-sourcemap-loader karma-snapshot karma-mocha \
              karma-mocha-snapshot karma-mocha-reporter karma-chrome-launcher mocha \
              chai chai-karma-snapshot webpack --save-dev
```

Karma configuration: 

```js
// karma.conf.js
const webpack = require("webpack");

module.exports = function (config) {
  config.set({
    browsers: ["ChromeHeadless"],
    frameworks: ["mocha", "snapshot", "mocha-snapshot"],
    reporters: ["mocha"],
    preprocessors: {
      "**/__snapshots__/**/*.md": ["snapshot"],
      "__tests__/index.js": ["webpack", "sourcemap"]
    },
    files: [
      "**/__snapshots__/**/*.md",
      "__tests__/index.js"
    ],

    colors: true,
    autoWatch: true,

    webpack: {
      devtool: "inline-source-map",
      performance: {
        hints: false
      },
    },

    webpackMiddleware: {
      stats: "errors-only",
      noInfo: true
    },

    snapshot: {
      update: !!process.env.UPDATE,
      prune: !!process.env.PRUNE,
    },

    mochaReporter: {
      showDiff: true,
    },

    client: {
      mocha: {
        reporter: "html",
        ui: "bdd",
      }
    },
  });
};
```

Source file:

```js
// src/index.js

export function test() {
  return "Snapshot Test";
}
```

Test file:

```js
// __tests__/index.js
import { use, expect, assert } from "chai";
import { matchSnapshot } from "chai-karma-snapshot";
import { test } from "../src/index.js";
use(matchSnapshot);

describe("src/index.js", () => {
  it("check snapshot", () => {
    // 'expect' syntax
    expect(test()).to.matchSnapshot();
    // 'assert' syntax
    assert.matchSnapshot(test());
  });
});
```

Run tests:

```sh
$ karma start
```

Update snapshots:

```sh
$ UPDATE=1 karma start --single-run
```

Prune snapshots:

```sh
$ PRUNE=1 karma start --single-run
```

## Config

```js
function resolve(basePath, suiteName) {
  return path.join(basePath, "__snapshots__", suiteName + ".md");
}

config.set({
  ...
  snapshot: {
    update: true,           // Run snapshot tests in UPDATE mode (default: false)
    prune: false,           // Prune unused snapshots (default: false)
    format: "indented-md",  // Snapshot format (default: md)
    checkSourceFile: true,  // Checks existince of the source file associated with tests (default: false)
    pathResolver: resolve,  // Custom path resolver,
    limitUnusedSnapshotsInWarning: -1  // Limit number of unused snapshots reported in the warning
                                       // -1 means no limit

  }
});
```

## Custom Snapshot Format

Snapshot config option `format` also works with custom serialization formats. Custom snapshot serializer should have
interface:

```ts
interface SnapshotSerializer {
  serialize: (name: string, suite: SnapshotSuite) => string,
  deserialize: (content: string) => { name: string, suite: SnapshotSuite },
}
```

## Internals

### Snapshot Data

`karma-snapshot` plugin is communicating with a browser by assigning a global variable `__snapshot__` on a `window`
object.

Snapshot data has a simple data structure:

```ts
declare global {
  interface Window {
    __snapshot__: SnapshotState;
  }
}

interface SnapshotState {
  update?: boolean;
  suite: SnapshotSuite;
}

interface SnapshotSuite {
  children: { [key: string]: SnapshotSuite };
  snapshots: { [key: string]: Snapshot[] };
  visited?: boolean;
  dirty?: boolean;
}

interface Snapshot {
  lang?: string;
  code: string;
  visited?: boolean;
  dirty?: boolean;
}
```

When `SnapshotState.update` variable is `true`, it indicates that assertion plugin should run in update mode, and
instead of checking snapshots, it should update all values.

`SnapshotState.suite` is a reference to the root suite.

`SnapshotSuite` is a tree with snapshots that has a similar structure to test suites. `children` property is used to
store references to children suites, and `snapshots` is used to store snapshot lists for tests in the current snapshot.
Snapshots are stored as a list because each test can have multiple snapshot checks, and they should be automatically
indexed by their position.

`Snapshot` is an object that stores details about snapshot. `lang` property indicates which language should be used
in a markdown format to improve readability. `code` property stores snapshot value that will be checked by an assertion
plugin.

`visited` is a flag that should be marked by an assertion plugin when it visits suites and snapshots. Visited flags are
used to  automatically prune removed snapshots.

`dirty` is a flag that should be marked by an assertion plugin when it updates or adds a new snapshot.

### Interface for Assertion Libraries

To make it easier to add support for assertion libraries, `SnapshotState` has two methods that should be used when
creating an API for an assertion library.

```ts
interface SnapshotSuite {
  get(path: string[], index: number): Snapshot | undefined;
  set(path: string[], index: number, code: string, lang?: string): void;
  match(received: string, expected: string): boolean;
}
```

`get()` method tries to find a `Snapshot` in a current snapshot state. It also automatically marks all nodes on the
`path` as visited.

`set()` method adds or updates an existing `Snapshot`.

`match()` method checks if two snapshots are matching in normalized form.

Here is an example how it should be used:

```ts
function matchSnapshot(path: string[], index: number, received: string) {
  if (snapshotState.update) {
    snapshotState.set(path, index, received);
  } else {
    const snapshot = snapshotState.get(path, index);
    if (!snapshot) {
      snapshotState.set(path, index, received);
    } else {
      const pass = snapshotState.match(received, snapshot.code);
      if (!pass) {
        throw new AssertionError(`Received value does not match stored snapshot ${index}`);
      }
    }
  }
}
```

[example]: https://localvoid.github.io/karma-snapshot/images/example.png "karma-snapshot Example"
