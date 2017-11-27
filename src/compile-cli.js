#!/usr/bin/env node

/* eslint no-console:0 */

import fs from 'fs';
import {po2json} from './compile.js';
import minimist from 'minimist';

// Process arguments
const argv = minimist(process.argv.slice(2));
const files = argv._.sort() || [];
const outputDir = argv.dir || null;

if (!files) {
  console.log('Usage:\n\tcompile [--output OUTFILE] <FILES>');
  process.exit(1);
}

// Compile strings
const translationData = {};

for (let file of files) {
  console.log('[gettext] processing PO file:', file);
  try {
    const poContents = fs.readFileSync(file, {encoding: 'utf-8'}).toString();
    const data = po2json(poContents);
    const lang = data.headers.Language;
    if (!translationData[lang]) {
      translationData[lang] = data.messages;
    } else {
      Object.assign(translationData[data.headers.Language], data.messages);
    }
  } catch (e) {
    console.error('[gettext] could not read:', file);
    console.trace(e);
    process.exit(1);
  }
}

for (let key in translationData) {
  if (translationData.hasOwnProperty(key)) {
    try {
      if (outputDir) {
        fs.writeFileSync(outputDir + '/' + key + '.json', JSON.stringify(translationData[key]));
      }
    } catch (e) {
      console.log(e);
    }
  }
}
