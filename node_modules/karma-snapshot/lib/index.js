const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const createMarkdownSerializer = require('./format/markdown');
const prune = require('./prune');

/**
 * filePattern creates a Karma file pattern object that should be included and non-watched.
 * 
 * @param {string} path File path.
 * @returns Karma file pattern object.
 */
function filePattern(path) {
  return {
    pattern: path,
    included: true,
    served: true,
    watched: false,
  };
}

/**
 * defaultPathResolver is a default path resolver for snapshot files.
 * 
 * @param {string} basePath Base path.
 * @param {string} suiteName Name of the suite.
 * @returns Full path to snapshot file.
 */
function defaultPathResolver(basePath, suiteName) {
  const suiteSourcePath = path.join(basePath, suiteName);
  const suiteSourceDir = path.dirname(suiteSourcePath);
  const sourceFileName = path.basename(suiteName);

  return path.join(suiteSourceDir, "__snapshots__", sourceFileName + ".md");
}

/**
 * Renders a list of snapshots up to specified limit of lines
 * @param list {array} list of snapshots
 * @param limit {number} maximum number of lines rendered under summary
 * @returns {string}
 */
function formatSnapshotList(list, limit) {
  limit = (typeof limit != 'undefined') ? limit : -1;

  const limitedList = limit > 0 ? list.slice(0, limit) : list;
  const hasMore = list.length > limitedList.length;
  const buildList = (snapshots) => snapshots.map((s) => s.join(' > ')).join('\n');

  if (hasMore) {
    return buildList(limitedList.slice(0, -1)) + `\n +${list.length - limitedList.length + 1} more`;
  }

  return buildList(limitedList);
}

/**
 * Renders the message for unused snapshots warning
 * @param list {array} list of snapshots
 * @param limit {number} maximum number of lines rendered under summary
 * @returns {string}
 */
function formatUnusedSnapshotsWarning(list, limit) {
  if (limit == 0) {
    return `Found ${list.length} unused snapshots`;
  }

  const prunedList = formatSnapshotList(list, limit);
  return `Found ${list.length} unused snapshots:\n${prunedList}`;
}

let snapshotSerializer;

/**
 * snapshotFramework
 * 
 * @param {*} files Karma file patterns.
 * @param {*} config Karma config.
 * @param {*} emitter Karma emitter.
 * @param {*} loggerFactory Karma logger factory.
 */
function snapshotFramework(files, config, emitter, loggerFactory) {
  const logger = loggerFactory.create('framework.snapshot');

  const snapshotConfig = Object.assign({
    update: false,
    prune: false,
    format: "md",
    checkSourceFile: false,
    pathResolver: defaultPathResolver,
    limitUnusedSnapshotsInWarning: -1
  }, config.snapshot);

  if (typeof snapshotConfig.format === "string") {
    switch (snapshotConfig.format) {
      case "indented-md":
        snapshotSerializer = createMarkdownSerializer(true);
        break;
      case "md":
      default:
        snapshotSerializer = createMarkdownSerializer(false);
    }
  } else {
    snapshotSerializer = snapshotConfig.format;
  }

  // it should be in a files list after `adapter.js`
  if (snapshotConfig.update) {
    files.unshift(filePattern(path.join(__dirname, 'snapshot-state-update.js')));
  }

  // inject snapshot adapter
  files.unshift(filePattern(path.join(__dirname, 'adapter.js')));

  emitter.on('browser_complete', (clientInfo, data) => {
    const lastResult = clientInfo.lastResult;

    if (!lastResult.disconnected) {
      if (data && data.snapshot) {
        let rootSuite = data.snapshot;
        let dirty = rootSuite.dirty;

        // prune dead snapshots
        if (!lastResult.error && lastResult.failed === 0 && lastResult.skipped === 0) {
          const prunedSnapshots = prune.pruneSnapshots(rootSuite);
          if (prunedSnapshots.pruned.length > 0) {
            if (snapshotConfig.prune) {
              const prunedList = formatSnapshotList(prunedSnapshots.pruned)
              logger.warn(`Removed ${prunedSnapshots.pruned.length} unused snapshots:\n${prunedList}`);
              rootSuite = prunedSnapshots.suite;
              prune.pruneFiles(snapshotConfig.pathResolver, config.basePath, prunedSnapshots.prunedFiles);
              dirty = true;
            } else {
              logger.warn(formatUnusedSnapshotsWarning(prunedSnapshots.pruned, snapshotConfig.limitUnusedSnapshotsInWarning));
            }
          }
        }

        if (dirty) {
          Object.keys(rootSuite.children).forEach((suiteName) => {
            const suite = rootSuite.children[suiteName];
            if (suite.dirty) {
              if (snapshotConfig.checkSourceFile) {
                const suiteSourceFilePath = path.join(config.basePath, suiteName);
                if (!fs.existsSync(suiteSourceFilePath)) {
                  logger.error(
                    'Failed to save snapshot file. ' +
                    'Source file "' + suiteSourceFilePath + '" does not exist.'
                  );
                  return;
                }
              }

              const snapshotPath = snapshotConfig.pathResolver(config.basePath, suiteName);
              const snapshotDir = path.dirname(snapshotPath);
              if (!fs.existsSync(snapshotDir)) {
                mkdirp.sync(snapshotDir);
              }
              fs.writeFileSync(
                snapshotPath,
                snapshotSerializer.serialize(suiteName, suite)
              );
            }
          });
        }
      }
    } else {
      logger.warn('Snapshot data is unavailable');
    }
  });
}

snapshotFramework.$inject = ['config.files', 'config', 'emitter', 'logger'];

/**
 * iifeWrapper wraps javascript into IIFE.
 * 
 * @param {string} content 
 * @returns Javascript wrapped into IIFE.
 */
function iifeWrapper(content) {
  return "(function(window){\"use strict\";" + content + "})(window);"
}

/**
 * Snapshot preprocessor.
 * 
 * @param {string} basePath Base path.
 * @param {*} loggerFactory Karma logger factory.
 * @returns Karma preprocessor.
 */
function snapshotPreprocessor(basePath, loggerFactory) {
  const logger = loggerFactory.create('preprocessor.snapshot');

  return function (content, file, done) {
    const root = snapshotSerializer.deserialize(content);
    done(iifeWrapper('window.__snapshot__.addSuite("' + root.name + '",' + JSON.stringify(root.suite) + ');'));
  };
}

snapshotPreprocessor.$inject = ['config.basePath', 'logger'];

module.exports = {
  'framework:snapshot': ['factory', snapshotFramework],
  'preprocessor:snapshot': ['factory', snapshotPreprocessor]
}
