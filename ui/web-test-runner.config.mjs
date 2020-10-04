import plugins from './web-dev.plugins.mjs';

const folder = process.env.E2E ? 'e2e' : 'test';

export default {
  files: `${folder}/**/*.test.js`,
  nodeResolve: {
    browser: true,
  },
  plugins,
};
