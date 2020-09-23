module.exports = {
  port: 8080,
  watch: true,
  nodeResolve: true,
  appIndex: 'demo/index.html',
  open: true,
  plugins: require('../es-dev-plugins'),
  moduleDirs: ['node_modules', 'web_modules'],
};
