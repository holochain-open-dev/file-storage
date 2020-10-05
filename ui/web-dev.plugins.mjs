import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupBuiltins from 'rollup-plugin-node-builtins';
import rollupReplace from '@rollup/plugin-replace';

const replace = fromRollup(rollupReplace);
const builtins = fromRollup(rollupBuiltins);
const commonjs = fromRollup(rollupCommonjs);

export default [
  replace({
    global: 'window',
    'process.env.NODE_ENV': '"production"',
  }),
  builtins(),
  commonjs({
    include: [
      'node_modules/fast-json-stable-stringify/**/*',
      'node_modules/zen-observable/**/*',
      'node_modules/graphql-tag/**/*',
      'node_modules/isomorphic-ws/**/*',
      'node_modules/@msgpack/**/*',
      'node_modules/@holochain/conductor-api/**/*',
    ],
  }),
];
