import {sanitizePoData, po2json} from './compile.js';
import {INPUT_PO, OUTPUT_DICT} from './test-fixtures.js';

import {expect} from 'chai';

function mockPoItem(overrides = {}) {
  return Object.assign({
    msgid: '你好，世界！',
    msgctxt: null,
    msgstr: ['Hello，World!'],
    flags: {},
    obsolete: false,
  }, overrides);
}

describe('sanitizePoData', () => {

  it('should sanitize input PO item', () => {
    const normalItem = mockPoItem();
    const obsoleteItem = mockPoItem({msgid: '测试1', obsolete: true});
    const fuzzyItem = mockPoItem({msgid: '测试2', flags: {fuzzy: true}});
    const bogusItem = mockPoItem({msgid: '测试3', msgstr: []});
    expect(sanitizePoData([normalItem])).to.deep.equal({'你好，世界！': 'Hello，World!'});
    expect(sanitizePoData([obsoleteItem])).to.deep.equal({});
    expect(sanitizePoData([fuzzyItem])).to.deep.equal({});
    expect(sanitizePoData([bogusItem])).to.deep.equal({});
    expect(sanitizePoData([normalItem, obsoleteItem, fuzzyItem, bogusItem]))
      .to.deep.equal({'你好，世界！': 'Hello，World!'});
  });

  it('should keep context', () => {
    const normalItem = mockPoItem();
    const contextItem = mockPoItem({msgctxt: '辅助文本测试', msgstr: ['Hello，World!(auxiliary)']});
    expect(sanitizePoData([normalItem, contextItem]))
      .to.deep.equal({
        '你好，世界！': {
          '': 'Hello，World!',
          '辅助文本测试': 'Hello，World!(auxiliary)',
        },
      });
  });
});

describe('po2json', () => {
  it('should correctly parse PO content', () => {
    expect(po2json(INPUT_PO)).to.deep.equal(OUTPUT_DICT);
  });
});
