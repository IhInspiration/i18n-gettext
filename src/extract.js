import Pofile from 'pofile';

import * as constants from './constants.js';

// -[]/{}()*+?.\^$| 正则特殊符号，后续给这些转义
const ESCAPE_REGEX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

// 获取文件的行数
function lineCount(text, charPosition = -1) {
  let data = text;
  if (charPosition !== -1) {
    data = text.substr(0, charPosition);
  }
  return data.split(/\r\n|\r|\n/).length;
}

// 提取文本的文件名+行
export class TranslationReference {
  constructor(filename, content, charPosition) {
    this.file = filename;
    this.line = lineCount(content, charPosition);
  }

  // 写入文件中的行说明
  toString(withLineNumbers = false) {
    let ref = this.file;
    if (withLineNumbers && this.line) {
      ref = `${ref}:${this.line}`;
    }
    return ref;
  }
}

export class TranslationInfo {
  constructor(text, reference) {
    this.text = text;
    this.reference = reference;
    // TODO 了解作用
    this.context = constants.MARKER_NO_CONTEXT;
    // 留作以后扩展单复数使用
    this.plural = false;
    // this.comment = '';
  }

  toPoItem(withLineNumbers = false) {
    let poItem = new Pofile.Item();
    poItem.msgid = this.text;
    // poItem.msgctxt = this.context === constants.MARKER_NO_CONTEXT ? null : this.context;
    poItem.references = [this.reference.toString(withLineNumbers)];
    // 此处可以留用扩展复数形式
    // poItem.msgid_plural = this.plural;
    poItem.msgstr = this.plural ? ['', ''] : [];
    // 注释
    // poItem.extractedComments = this.comment ? [this.comment] : [];
    return poItem;
  }
}


export class Extractor {

  constructor(options) {
    // 组合传入属性和默认属性
    this.options = Object.assign({
      startDelimiter: '[#',
      endDelimiter: '#]',
      attributes: constants.DEFAULT_ATTRIBUTES,
      lineNumbers: false,
    }, options);

    /* Translation items, indexed as:
     * {
     *   "msgid1": {
     *     NOCONTEXT: item,
     *     "ctx1": item2,
     *   },
     *   ...
     * }
     */
    this.items = {};
    
    // For mustache/string
    this.filterRegexps = this.options.attributes.map((attribute) => {
      const startOrEndQuotes = `(?:\\&quot;|[\\'"])`;  // 单双引号和html引号标记
      const spacesOrPipeChar = `\\s*\\|\\s*`;        // 形式：空白 | 空白
      const start = this.options.startDelimiter.replace(ESCAPE_REGEX, '\\$&');
      const end = this.options.endDelimiter.replace(ESCAPE_REGEX, '\\$&');
      return new RegExp(`${start}\\s*${startOrEndQuotes}([\\s\\S]+?)${startOrEndQuotes}${spacesOrPipeChar}${attribute}.*${end}`, 'g');
    });

    // For VM
    this.filterRegexps.push.apply(this.filterRegexps, this.options.attributes.map((attribute) => {
      const startOrEndQuotes = `(?:\\&quot;|[\\'"])`;  // 单双引号和html引号标记
      return new RegExp(`#${attribute}\\\(${startOrEndQuotes}([\\s\\S]+?)${startOrEndQuotes}\\\)`, 'g');
    }));

    console.log(this.filterRegexps);
  }

  parse(filename, content) {
    const extractedData = this._extractTranslationData(filename, content);

    for (const d of extractedData) {
      if (!this.items[d.text]) {
        this.items[d.text] = {};
      }
      if (!this.items[d.text][d.context]) {
        this.items[d.text][d.context] = d.toPoItem(this.options.lineNumbers);
      } else {
        // 扩展使用，暂时注释
        let item = this.items[d.text][d.context];
        // if (item.msgid_plural && d.plural && item.msgid_plural !== d.plural) {
        //   throw new Error(
        //     `Incompatible plural definitions for ${d.text}: '${item.msgid_plural}' !== '${d.plural}'`);
        // }
        // if (d.plural && !item.msgid_plural) {
        //   item.msgid_plural = d.plural;
        // }
        const refString = d.reference.toString(this.options.lineNumbers);
        if (d.reference && item.references.indexOf(refString) === -1) {
          item.references.push(refString);
        }
        // if (d.comment && item.extractedComments.indexOf(d.comment) === -1) {
        //   item.extractedComments.push(d.comment);
        // }
      }
    }
  }

  toString() {
    const catalog = new Pofile();
    catalog.headers = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Transfer-Encoding': '8bit',
      'Generated-By': 'easygettext',
      'Project-Id-Version': '',
    };

    for (let msgid in this.items) {
      if (this.items.hasOwnProperty(msgid)) {
        const contexts = Object.keys(this.items[msgid]).sort();
        for (const ctx of contexts) {
          catalog.items.push(this.items[msgid][ctx]);
        }
      }
    }

    catalog.items.sort((a, b) => a.msgid.localeCompare(b.msgid));
    return catalog.toString();
  }

  _extractTranslationData(filename, content) {
    let matches;
    let tokensFromFilters = [];

    this.filterRegexps.map((reg) => {
      while ((matches = reg.exec(content)) !== null) {
        const reference = new TranslationReference(filename, content, matches.index);
        if (matches !== null) {
          const text = matches[1];
          if (text.length !== 0) {
            tokensFromFilters.push(new TranslationInfo(text, reference));
          }
        }
      }
    });

    return tokensFromFilters;
  }
}
