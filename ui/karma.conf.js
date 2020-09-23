/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

const e2e = process.env.E2E;
const testsPattern = `${e2e ? 'e2e' : 'test'}/**/*.test.js`;

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : testsPattern, type: 'module' },
      ],

      esm: {
        nodeResolve: {
          browser: true,
        },
        plugins: require('./es-dev-plugins'),
      },
      // you can overwrite/extend the config further
    })
  );
  return config;
};
