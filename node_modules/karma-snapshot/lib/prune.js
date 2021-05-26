const path = require('path');
const fs = require('fs');

function _pruneSnapshots(suite, snapshotPath) {
  const children = suite.children;
  const snapshots = suite.snapshots;
  const result = {
    pruned: [],
    alive: 0,
    suite: {
      children: {},
      snapshots: {},
      visited: suite.visited,
      dirty: suite.dirty
    }
  };
  let keys, key, i;

  keys = Object.keys(children);
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    const c = children[key];
    const nextPath = snapshotPath.slice();
    nextPath.push(key);
    const p = _pruneSnapshots(c, nextPath);
    if (p.pruned.length > 0) {
      result.suite.dirty = true;
      result.pruned = result.pruned.concat(p.pruned);
    }
    if (p.alive > 0) {
      result.alive += p.alive;
      result.suite.children[key] = p.suite;
    }
  }

  keys = Object.keys(snapshots);
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    const snapshotList = snapshots[key];
    const newSnapshotList = [];
    for (let j = 0; j < snapshotList.length; j++) {
      const s = snapshotList[j];
      if (s.visited === true) {
        newSnapshotList.push(s);
        result.alive++;
      } else {
        const fullPath = snapshotPath.slice();
        fullPath.push(key + ' ' + j);
        result.suite.dirty = true;
        result.pruned.push(fullPath);
      }
    }
    if (newSnapshotList.length > 0) {
      result.suite.snapshots[key] = newSnapshotList;
    }
  }

  return result;
}

function pruneSnapshots(suite) {
  const result = _pruneSnapshots(suite, []);
  const fileNames = Object.keys(suite.children);

  const prunedFiles = [];
  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    if (!result.suite.children.hasOwnProperty(fileName)) {
      prunedFiles.push(fileName);
    }
  }

  return {
    pruned: result.pruned,
    prunedFiles: prunedFiles,
    alive: result.alive,
    suite: result.suite,
  };
}

function pruneFiles(pathResolver, basePath, files) {
  files.forEach((f) => {
    fs.unlinkSync(pathResolver(basePath, f));
  });
}

module.exports = {
  pruneSnapshots: pruneSnapshots,
  pruneFiles: pruneFiles
};
