const unified = require('unified');
const remarkParse = require('remark-parse')

const mdParser = unified().use(remarkParse);

/**
 * createMarkdownSerializer create a snapshot serializer.
 * 
 * @param {boolean} indentCodeBlocks Use indentation for code blocks.
 * @returns Snapshot serializer.
 */
function createMarkdownSerializer(indentCodeBlocks) {
  return {
    serialize: (name, suite) => snapshotToMarkdown(name, suite, indentCodeBlocks),
    deserialize: markdownToSnapshot,
  };
}

/**
 * markdownToSnapshot converts snapshot from markdown format into native.
 * 
 * @param {string} content Snapshot in a markdown format.
 * @returns Snapshot in a native format.
 */
function markdownToSnapshot(content) {
  const tree = mdParser.parse(content);

  const state = {
    name: null,
    suite: null,
    suiteStack: [],
    currentSuite: null,
    currentSnapshotList: null,
    depth: 0
  };

  const children = tree.children;
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    switch (c.type) {
      case 'heading':
        if (c.depth === 1) {
          enterRootSuite(state, c);
        } else if (c.depth === 2) {
          tryExit(state, suiteDepth(c));
          enterSuite(state, c);
        } else if (c.depth === 4) {
          enterSnapshot(state, c);
        }
        break;
      case 'code':
        pushSnapshotCode(state, c);
        break;
    }
  }

  return { name: state.name, suite: state.suite };
};

/**
 * tryExit tries to pop state until it has correct depth.
 * 
 * @param {SerializerState} state Current state.
 * @param {number} depth Current depth.
 */
function tryExit(state, depth) {
  while (state.depth >= depth) {
    state.suiteStack.pop();
    state.currentSuite = state.suiteStack[state.suiteStack.length - 1];
    state.currentSnapshotList = null;
    state.depth--;
  }
}

/**
 * suiteDepth calculates current depth of the suite from the offset position.
 * 
 * @param {*} node Markdown node.
 * @returns depth.
 */
function suiteDepth(node) {
  const inlineCode = node.children[0];
  return ((inlineCode.position.start.column - 4) >> 1) + 1;
}

/**
 * snapshotDepth calculates current depth of the snapshot from the offset position.
 * 
 * @param {*} node Markdown node.
 * @returns depth.
 */
function snapshotDepth(node) {
  const inlineCode = node.children[0];
  return ((inlineCode.position.start.column - 6) >> 1) + 1;
}

/**
 * enterRootSuite pushes root suite into the current state.
 * 
 * @param {SerializerState} state Current state.
 * @param {*} node Markdown node.
 */
function enterRootSuite(state, node) {
  const inlineCode = node.children[0];
  const name = inlineCode.value;
  const suite = {
    children: {},
    snapshots: {}
  }
  state.name = name;
  state.suite = suite;
  state.suiteStack.push(suite);
  state.currentSuite = suite;
  state.currentSnapshotList = null;
  state.depth = 0;
}

/**
 * enterSuite pushes suite into the current state.
 * 
 * @param {SerializerState} state Current state.
 * @param {*} node Markdown node.
 */
function enterSuite(state, node) {
  const inlineCode = node.children[0];
  const name = inlineCode.value;
  const suite = {
    children: {},
    snapshots: {}
  }
  state.currentSuite.children[name] = suite;
  state.suiteStack.push(suite);
  state.currentSuite = suite;
  state.currentSnapshotList = null;
  state.depth++;
}

/**
 * enterSnapshot pushes snapshot into the current state.
 * 
 * @param {SerializerState} state Current state.
 * @param {*} node Markdown node.
 */
function enterSnapshot(state, node) {
  const inlineCode = node.children[0];
  const name = inlineCode.value;
  const snapshotList = [];
  state.currentSuite.snapshots[name] = snapshotList;
  state.currentSnapshotList = snapshotList;
}

/**
 * pushSnapshotCode adds snapshot to the current snapshot.
 * 
 * @param {SerializerState} state Current state.
 * @param {*} node Markdown node.
 */
function pushSnapshotCode(state, node) {
  state.currentSnapshotList.push({
    lang: node.lang,
    code: normalizeNewlines(node.value)
  });
}

/**
 * normalizeNewlines normalizes newlines into a standard "\n" form.
 * 
 * @param {string} string 
 * @returns Normalized string.
 */
function normalizeNewlines(string) {
  return string.replace(/\r\n|\r/g, "\n");
}

/**
 * snapshotToMarkdown converts snapshot from native into markdown format.
 * 
 * @param {string} name Suite name.
 * @param {*} suite Root suite.
 * @param {boolean} indentCodeBlocks Use indentation for code blocks.
 * @returns Snapshot in a markdown format.
 */
function snapshotToMarkdown(name, suite, indentCodeBlocks) {
  return transformSuite(name, suite, -1, indentCodeBlocks);
}

/**
 * transformSuite converts suite from native into markdown format.
 * 
 * @param {string} name Suite name.
 * @param {*} suite Suite.
 * @param {number} depth Suite depth.
 * @param {boolean} indentCodeBlocks  Use indentation for code blocks.
 * @returns Suite in a markdown format.
 */
function transformSuite(name, suite, depth, indentCodeBlocks) {
  const children = suite.children;
  const snapshots = suite.snapshots;
  const nextDepth = depth + 1;

  let result = suiteHeader(name, depth);
  let keys, i;

  keys = Object.keys(snapshots);
  for (i = 0; i < keys.length; i++) {
    const key = keys[i];
    const snapshotList = snapshots[key];
    result += transformSnapshotList(key, snapshotList, nextDepth, indentCodeBlocks);
  }

  keys = Object.keys(children);
  for (i = 0; i < keys.length; i++) {
    const key = keys[i];
    result += transformSuite(key, children[key], nextDepth, indentCodeBlocks);
  }
  return result;
}

/**
 * transformSnapshotList converts snapshot list from native into markdown format.
 * 
 * @param {number} name Snapshot name.
 * @param {*} snapshotList Snapshot list.
 * @param {number} depth Snapshot depth.
 * @param {boolean} indentCodeBlocks  Use indentation for code blocks.
 * @returns Snapshot in a markdown format.
 */
function transformSnapshotList(name, snapshotList, depth, indentCodeBlocks) {
  let result = snapshotHeader(name, depth);

  for (let i = 0; i < snapshotList.length; i++) {
    if (i > 0 && indentCodeBlocks) {
      result += '---\n\n';
    }
    const snapshot = snapshotList[i];
    const lang = snapshot.lang;
    const code = snapshot.code;
    const delimiter = safeDelimiter(code);

    if (indentCodeBlocks) {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        result += '    ' + lines[i] + '\n';
      }
    } else {
      result += delimiter;
      if (lang) {
        result += lang;
      }
      result += '\n' + code + '\n' + delimiter + '\n';
    }

    result += '\n';
  }

  return result;
}

/**
 * suiteHeader serializes suite header.
 * 
 * @param {string} name Suite name.
 * @param {number} depth Suite depth.
 * @returns Serialized suite header.
 */
function suiteHeader(name, depth) {
  if (depth === -1) {
    return "# " + serializeName(name) + "\n\n";
  }
  return "## " + indent(depth) + serializeName(name) + "\n\n";
}

/**
 * snapshotHeader serializes snapshot header.
 * 
 * @param {string} name Snapshot name.
 * @param {number} depth Snapshot depth.
 * @returns Serialized snapshot header.
 */
function snapshotHeader(name, depth) {
  return "#### " + indent(depth) + serializeName(name) + "\n\n";
}

/**
 * serializeName serializes suite or snapshot names.
 * 
 * @param {string} name Suite or snapshot name.
 * @returns Name wrapped into a safe delimiters.
 */
function serializeName(name) {
  const delimiter = safeDelimiter(name, '`');
  return delimiter + name + delimiter;
}

/**
 * indent generates indentation string.
 * 
 * @param {number} depth Current depth.
 * @returns Indentation string.
 */
function indent(depth) {
  let result = '';
  for (let i = 0; i < depth; i++) {
    result += '  ';
  }
  return result;
}

/**
 * safeDelimiter tries to find a safe delimiter by appending backticks until it finally finds it.
 * 
 * @param {string} s String that should be delimited.
 * @param {string} delimiter Initial delimiter.
 * @returns Safe delimiter.
 */
function safeDelimiter(s, delimiter) {
  if (delimiter === undefined) {
    delimiter = '```';
  }
  while (s.indexOf(delimiter) !== -1) {
    delimiter += '`';
  }
  return delimiter;
}

module.exports = createMarkdownSerializer;