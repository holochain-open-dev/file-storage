const path = require('path');

function pattern(path) {
  return {
    pattern: path,
    included: true,
    served: true,
    watched: false,
  };
}

function findFileIndex(files, matcher) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (typeof file === 'object') {
      if (matcher.test(file.pattern)) {
        return i;
      }
    }
  }
  return -1;
}

function mochaSnapshotFactory(files) {
  files.splice(
    findFileIndex(files, /mocha\.js$/) + 1,
    0,
    pattern(path.join(__dirname, 'adapter.js')));
}

mochaSnapshotFactory.$inject = ['config.files'];

module.exports = {
  'framework:mocha-snapshot': ['factory', mochaSnapshotFactory],
}
