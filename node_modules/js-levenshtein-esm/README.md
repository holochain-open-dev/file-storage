[![Build Status](https://travis-ci.com/43081j/js-levenshtein.svg?branch=master)](https://travis-ci.com/43081j/js-levenshtein)
[![npm version](https://img.shields.io/npm/v/js-levenshtein-esm.svg?style=flat)](https://npmjs.org/package/js-levenshtein-esm "View this project on npm")

# js-levenshtein-esm

This is a fork of [js-levenshtein](https://github.com/gustf/js-levenshtein)
rewritten for ES module consumption.

---

A very efficient JS implementation calculating the Levenshtein distance, i.e. the difference between two strings.

Based on Wagner-Fischer dynamic programming algorithm, optimized for speed and memory
 - use a single distance vector instead of a matrix
 - loop unrolling on the outer loop
 - remove common prefixes/postfixes from the calculation
 - minimize the number of comparisons

## Install

```
$ npm i -S js-levenshtein-esm
```


## Usage

In Node:

```js
const levenshtein = require('js-levenshtein-esm');

levenshtein('kitten', 'sitting'); // 3
```

In the browser:

```js
import levenshtein from 'https://unpkg.com/js-levenshtein-esm/js-levenshtein.js';

levenshtein('kitten', 'sitting'); // 3
```

## Benchmark

```
$ npm run test:perf

  50 paragraphs, length max=500 min=240 avr=372.5
     62 op/s » fast-levenshtein
    143 op/s » js-levenshtein
    140 op/s » js-levenshtein-esm
     89 op/s » leven
     92 op/s » levenshtein-edit-distance
    100 op/s » talisman

  100 sentences, length max=170 min=6 avr=57.5
    1,304 op/s » fast-levenshtein
    2,829 op/s » js-levenshtein
    2,750 op/s » js-levenshtein-esm
    1,780 op/s » leven
    1,788 op/s » levenshtein-edit-distance
    2,097 op/s » talisman

  2000 words, length max=20 min=3 avr=9.5
    1,952 op/s » fast-levenshtein
    3,104 op/s » js-levenshtein
    2,908 op/s » js-levenshtein-esm
    2,351 op/s » leven
    2,381 op/s » levenshtein-edit-distance
    2,729 op/s » talisman
```

## License

MIT
