import Pofile from 'pofile';

import * as constants from './constants.js';

// -[]/{}()*+?.\^$| 正则特殊符号，后续给这些转义
const ESCAPE_REGEX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

// 提取文本的文件名+行
// 参考信息类
export class TranslationReference {
  constructor(filename, content, charPosition) {
    this.file = filename;
    this.line = this.lineCount(content, charPosition);
  }

  // 获取文件行数
  lineCount(text, charPosition = -1) {
    let data = text;
    if (charPosition !== -1) {
      data = text.substr(0, charPosition);
    }
    return data.split(/\r\n|\r|\n/).length;
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
  constructor(text, reference, context, plural) {
    this.text = text;
    this.reference = reference;
    this.context = context || constants.MARKER_NO_CONTEXT; // 无上下文使用默认
    // 留作以后扩展单复数使用
    this.plural = plural;
  }

  toPoItem(withLineNumbers = false) {
    let poItem = new Pofile.Item();
    poItem.msgid = this.text;
    poItem.msgctxt = this.context === constants.MARKER_NO_CONTEXT ? null : this.context;
    poItem.references = [this.reference.toString(withLineNumbers)];
    // 此处可以留用扩展复数形式
    poItem.msgid_plural = this.plural || null;
    poItem.msgstr = this.plural ? ['', ''] : [];
    return poItem;
  }
}

// 提取类
export class Extractor {

  constructor(options) {
    // 组合传入属性和默认属性
    this.options = Object.assign({
      startDelimiter: '[#',
      endDelimiter: '#]',
      attributes: constants.DEFAULT_ATTRIBUTES,
      lineNumbers: false,
    }, options);

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
      return new RegExp(`#${attribute}\\((?:[']([^']+)[']|["]([^"]+)["])`, 'g');
    }));

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
        let item = this.items[d.text][d.context];
        const refString = d.reference.toString(this.options.lineNumbers);
        if (d.reference && item.references.indexOf(refString) === -1) {
          item.references.push(refString);
        }
      }
    }
  }

  toString() {
    const catalog = new Pofile();
    catalog.headers = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Transfer-Encoding': '8bit',
      'Generated-By': 'i18n-gettext',
      'Project-Id-Version': '',
      'Author': 'jackwang',
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

  // 提取翻译字符串
  _extractTranslationData(filename, content) {
    let matches;
    let tokensFromFilters = [];

    this.filterRegexps.forEach((reg) => {
      while ((matches = reg.exec(content)) !== null) {
        const reference = new TranslationReference(filename, content, matches.index);
        if (matches !== null) {
          const text = matches[1] || matches[2];
          if (text.length !== 0) {
            tokensFromFilters.push(new TranslationInfo(text, reference));
          }
        }
      }
    });

    return tokensFromFilters;
  }
}
