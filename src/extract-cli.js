#!/usr/bin/env node

/* eslint no-console:0 */

import fs from 'fs';
import minimist from 'minimist';

import * as constants from './constants.js';
import {Extractor} from './extract.js';

const PROGRAM_NAME = 'easygettext';
const ALLOWED_EXTENSIONS = ['string', 'mustache', 'vm'];

// 处理参数
const argv = minimist(process.argv.slice(2));
// 文件排序
const files = argv._.sort() || [];
// 是否允许输出信息
const quietMode = argv.quiet || false;
// 获取输出文件的名称
const outputFile = argv.output || null;
// 获取定义的开始结束标识符
const startDelimiter = argv.startDelimiter === undefined ? constants.DEFAULT_DELIMITERS.start : argv.startDelimiter;
const endDelimiter = argv.endDelimiter === undefined ? constants.DEFAULT_DELIMITERS.end : argv.endDelimiter;
// 可以再命令行中添加标识符
const extraAttribute = argv.attribute || false;

// 不是静默状态且文件为0个报出错误信息
if (!quietMode && (!files || files.length === 0)) {
  console.log('Usage:\n\tgettext-extract [--attribute EXTRA-ATTRIBUTE] [--output OUTFILE] <FILES>');
  process.exit(1);
}

// 将传入的属性放到一起
let attributes = constants.DEFAULT_ATTRIBUTES.slice();
if (extraAttribute) {
  // 传入一个属性
  if (typeof extraAttribute === 'string') {
    attributes.push(extraAttribute);
  } else {
    // 传入多个属性
    attributes = attributes.concat(extraAttribute);
  }
}

// 提取字符串
const extractor = new Extractor({
  lineNumbers: true,
  attributes,
  startDelimiter,
  endDelimiter,
});

// 循环遍历文件提取
files.forEach(function(filename) {
  let file =  filename;
  const ext = file.split('.').pop();
  // 判断是否为支持的扩展名
  if (ALLOWED_EXTENSIONS.indexOf(ext) === -1) {
    console.log(`[${PROGRAM_NAME}] will not extract: '${filename}' (invalid extension)`);
    return;
  }
  console.log(`[${PROGRAM_NAME}] extracting: '${filename}`);
  try {
    let data = fs.readFileSync(file, {encoding: 'utf-8'}).toString();

    extractor.parse(file, data);
  } catch (e) {
    console.error(`[${PROGRAM_NAME}] could not read: '${filename}`);
    console.trace(e);
    process.exit(1);
  }
});
// 输出文件到命令行指定的文件
if (outputFile) {
  fs.writeFileSync(outputFile, extractor.toString());
} else {
  console.log(extractor.toString());
}
