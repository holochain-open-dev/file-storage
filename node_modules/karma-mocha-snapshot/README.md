# Karma Plugin for Snapshot Testing with Mocha

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

## Usage Example

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
import { use, expect } from "chai";
import { matchSnapshot } from "chai-karma-snapshot";
import { test } from "../src/index.js";
use(matchSnapshot);

describe("src/index.js", () => {
  it("check snapshot", () => {
    expect(test()).to.matchSnapshot();
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
