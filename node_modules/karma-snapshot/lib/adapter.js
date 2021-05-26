(function (window) {
  "use strict";

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  // Object.assign polyfill copied from https://github.com/Microsoft/tslib/
  var assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };

  var prevSuite = {
    children: {},
    snapshots: {}
  };
  var nextSuite = {
    visited: false,
    dirty: false,
    children: {},
    snapshots: {}
  };

  window.__snapshot__ = {
    update: false,
    suite: prevSuite
  };

  window.__snapshot__.addSuite = function (name, suite) {
    prevSuite.children[name] = suite;
  };

  var normalizeNewlines = function (s) {
    return s.replace(/\r\n|\r/g, "\n");
  }

  var setSnapshot = function (path, index, code, lang, dirty) {
    if (dirty === void 0) {
      dirty = true;
    }
    var suite = nextSuite;
    suite.visited = true;
    if (dirty) {
      suite.dirty = true;
    }
    for (var i = 0; i < path.length - 1; i++) {
      var key = path[i];
      var s = suite.children[key];
      if (s === undefined) {
        suite.children[key] = suite = {
          visited: true,
          dirty: dirty,
          children: {},
          snapshots: {}
        };
      } else {
        suite = s;
        suite.visited = true;
        if (dirty) {
          suite.dirty = true;
        }
      }
    }
    var testName = path[path.length - 1];
    var snapshotList = suite.snapshots[testName];
    if (snapshotList === undefined) {
      suite.snapshots[testName] = snapshotList = [];
    }
    snapshotList[index] = {
      visited: true,
      dirty: dirty,
      lang: lang,
      code: normalizeNewlines(code)
    };
  };

  window.__snapshot__.get = function (path, index) {
    var key, s, i, testName, snapshotList, snapshot;
    var suite = prevSuite;

    for (i = 0; i < path.length - 1; i++) {
      key = path[i];
      s = suite.children[key];
      if (s === undefined) {
        return undefined;
      } else {
        suite = s;
      }
    }

    testName = path[path.length - 1];
    snapshotList = suite.snapshots[testName];
    if (snapshotList !== undefined) {
      snapshot = snapshotList[index];
      if (snapshot !== undefined) {
        setSnapshot(path, index, snapshot.code, snapshot.lang, false);
      }
      return snapshot;
    }

    return undefined;
  };

  window.__snapshot__.set = setSnapshot;

  window.__snapshot__.match = function (received, expected) {
    return received === normalizeNewlines(expected);
  };

  var copyMissingSnapshots = function (prev, next) {
    var snapshotList, nextChild, key, i;

    var pChildren = prev.children;
    var pSnapshots = prev.snapshots;

    for (key in pChildren) {
      if (hasOwnProperty.call(pChildren, key)) {
        nextChild = next.children[key];
        if (nextChild === undefined) {
          next.children[key] = pChildren[key];
        } else {
          copyMissingSnapshots(pChildren[key], nextChild);
        }
      }
    }

    for (key in pSnapshots) {
      if (hasOwnProperty.call(pSnapshots, key)) {
        nextChild = next.snapshots[key];
        if (nextChild === undefined) {
          next.snapshots[key] = pSnapshots[key];
        } else {
          snapshotList = pSnapshots[key];
          for (i = nextChild.length; i < snapshotList.length; i++) {
            nextChild.push(snapshotList[i]);
          }
        }
      }
    }
  }

  // Patch `karma.complete()` method and add snapshot data to the end result.
  var complete = window.__karma__.complete;
  window.__karma__.complete = function (data) {
    // We need to copy missing snapshots to detect which one should be pruned. Missing snapshots won't have `visited`
    // flag.
    copyMissingSnapshots(prevSuite, nextSuite);

    var arg = { snapshot: nextSuite };
    if (data !== undefined) {
      arg = assign({}, data, arg);
    }
    return complete.call(window.__karma__, arg);
  };
})(window);
