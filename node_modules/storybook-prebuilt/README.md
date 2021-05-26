# Storybook prebuilt

A build of storybook and all it's dependencies, bundled as es modules. Ready to be used in the browser.

## Usage

### Setup

Storybook consists out of a manager and a preview part, and requires a specific DOM structure and folder structure in order to set them up properly. We don't have documentation on how to set this up right now.

We recommend using `@open-wc/demoing-storybook` makes it easy to use storybook prebuilt to develop storybook without any build step. For web components, or anything else that works in the browser without a build.

### Importing storybook packages

Storybook prebuilt mimicks the package structure of storybook itself. When you would import `@storybook/foo` the prebuilt equivalant is `storybook-prebuilt/foo`.

We also provide imports for `react` and `react-dom`, because these are not available as es modules. This can be useful when writing your own addons which require react.

We recommend using file extensions when importing files in the browser, this saves having to add a build step for adding file extensions. They will also become mandatory in the future with import maps.

#### Overview

| Original                                     | Prebuilt                                         |
| -------------------------------------------- | ------------------------------------------------ |
| @storybook/web-components                    | storybook-prebuilt/web-components.js             |
| @storybook/addons                            | storybook-prebuilt/addons.js                     |
| @storybook/api                               | storybook-prebuilt/api.js                        |
| @storybook/core-events                       | storybook-prebuilt/core-events.js                |
| @storybook/theming                           | storybook-prebuilt/theming.js                    |
| @storybook/theming/create                    | storybook-prebuilt/theming/create.js             |
| @storybook/addon-actions                     | storybook-prebuilt/addon-actions.js              |
| @storybook/addon-actions/register            | storybook-prebuilt/addon-actions/register.js     |
| @storybook/addon-knobs                       | storybook-prebuilt/addon-knobs.js                |
| @storybook/addon-knobs/register              | storybook-prebuilt/addon-knobs/registerjs        |
| @storybook/addon-a11y                        | storybook-prebuilt/addon-a11y                    |
| @storybook/addon-a11y/register               | storybook-prebuilt/addon-a11y/register.js        |
| @storybook/addon-docs                        | storybook-prebuilt/addon-docs                    |
| @storybook/addon-docs/register               | storybook-prebuilt/addon-docs/register.js        |
| @storybook/addon-links                       | storybook-prebuilt/addon-links.js                |
| @storybook/addon-links/register              | storybook-prebuilt/addon-links/register.js       |
| @storybook/addon-backgrounds/register        | storybook-prebuilt/addon-backgrounds/register.js |
| @storybook/addon-viewport/register           | storybook-prebuilt/addon-viewport/register.js    |
| @storybook/addon-web-components-knobs        | storybook-prebuilt/addon-web-components-knobs.js |
| @storybook/core/dist/client/manager/index.js | storybook-prebuilt/manager.js                    |
| react                                        | storybook-prebuilt/react.js                      |
| react-dom                                    | storybook-prebuilt/react-dom.js                  |
