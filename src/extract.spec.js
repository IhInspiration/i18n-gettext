import {Extractor} from './extract.js';
import * as constants from './constants.js';
import * as fixtures from './test-fixtures.js';

import {expect} from 'chai';


describe('Extractor object', () => {
  it('should output a correct POT file from the .string files', () => {
    const extractor = new Extractor();
    extractor.parse(fixtures.FILENAME_0, fixtures.STRING0_CTX0);
    expect(extractor.toString()).to.equal(fixtures.POT_OUTPUT_0);
  });

  it('should output a correct POT file from the .mustache files', () => {
    const extractor = new Extractor();
    extractor.parse(fixtures.FILENAME_1, fixtures.MUSTACHE0_CTX0);
    expect(extractor.toString()).to.equal(fixtures.POT_OUTPUT_1);
  });

  it('should output a correct POT file from the .vm files', () => {
    const extractor = new Extractor();
    extractor.parse(fixtures.FILENAME_2, fixtures.VM0_CTX0);
    expect(extractor.toString()).to.equal(fixtures.POT_OUTPUT_2);
  });

  it('should output a correct POT file from multiple .vm&.string files', () => {
    const extractor = new Extractor();
    extractor.parse(fixtures.FILENAME_0, fixtures.STRING0_CTX0);
    extractor.parse(fixtures.FILENAME_2, fixtures.VM0_CTX1);
    expect(extractor.toString()).to.equal(fixtures.POT_OUTPUT_3);
  });
});


describe('Raw translation data', () => {
  const extractor = new Extractor();

  it('should extract data and metadata correctly', () => {
    const data = extractor._extractTranslationData(fixtures.FILENAME_0, fixtures.STRING0_CTX0);
    expect(data.length).to.equal(1);
    expect(data[0].text).to.equal('请输入1-10000之间的数字，支持两位小数');
    expect(data[0].reference.file).to.equal(fixtures.FILENAME_0);
    expect(data[0].reference.line).to.equal(2);
  });

  it('should correctly render the reference', () => {
    const data = extractor._extractTranslationData(fixtures.FILENAME_0, fixtures.STRING0_CTX0);
    expect(data[0].reference.toString(true)).to.equal('test.string:2');
  });

  it('should extract multiple tokens correctly', () => {
    const data = extractor._extractTranslationData(fixtures.FILENAME_2, fixtures.VM0_CTX1);
    expect(data.length).to.equal(5);
    expect(data[0].reference.toString(true)).to.equal('test.vm:2');
    expect(data[1].context).to.equal(constants.MARKER_NO_CONTEXT);
    expect(data[3].text).to.equal('测试1');
    expect(data[4].reference.line).to.equal(6);
  });
});
