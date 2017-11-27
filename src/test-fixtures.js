export const FILENAME_0 = 'test.string';
export const FILENAME_1 = 'test.mustache';
export const FILENAME_2 = 'test.vm';

export const STRING0_CTX0 =  `
<div class="m-filter-tips gray">[# '请输入1-10000之间的数字，支持两位小数' | i18n #]</div>`;
export const POT_OUTPUT_0 = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Generated-By: i18n-gettext\\n"
"Project-Id-Version: \\n"
"Author: jackwang\\n"

#: test.string
msgid "请输入1-10000之间的数字，支持两位小数"
msgstr ""
`;

export const MUSTACHE0_CTX0 =  `
<div class="m-filter-tips gray">[# '请输入1-10000之间的数字，支持两位小数' | i18n #]</div>`;
export const POT_OUTPUT_1 = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Generated-By: i18n-gettext\\n"
"Project-Id-Version: \\n"
"Author: jackwang\\n"

#: test.mustache
msgid "请输入1-10000之间的数字，支持两位小数"
msgstr ""
`;

export const VM0_CTX0 =  `<li class="current"><a href="#">#qMessage('你好世界')</a></li>`;
export const POT_OUTPUT_2 = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Generated-By: i18n-gettext\\n"
"Project-Id-Version: \\n"
"Author: jackwang\\n"

#: test.vm
msgid "你好世界"
msgstr ""
`;

// 较长的vm
export const VM0_CTX1 = `<ul class="tab_gallery">
<li class="current"><a href="#">#qMessage('测试1')</a></li>
<li><a href="#">#qMessage('测试2')</a></li>
<li><a href="#">#qMessage('测试3')</a></li>
<li><a href="#">#qMessage('测试1')</a></li>
<li><a href="#">#qMessage('测试4')</a></li>
</ul>
`;

export const POT_OUTPUT_3 = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Generated-By: i18n-gettext\\n"
"Project-Id-Version: \\n"
"Author: jackwang\\n"

#: test.vm
msgid "测试1"
msgstr ""

#: test.vm
msgid "测试2"
msgstr ""

#: test.vm
msgid "测试3"
msgstr ""

#: test.vm
msgid "测试4"
msgstr ""

#: test.string
msgid "请输入1-10000之间的数字，支持两位小数"
msgstr ""
`;

export const VM0_CTX2 =  `<li class="current"><a href="#">#qMessage('你好<a href="#">测试</a>世界')</a></li>`;
export const POT_OUTPUT_4 = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Generated-By: i18n-gettext\\n"
"Project-Id-Version: \\n"
"Author: jackwang\\n"

#: test.vm
msgid "你好<a href=\\"#\\">测试</a>世界"
msgstr ""
`;

export const INPUT_PO = `msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Project-Id-Version: \n"
"Last-Translator: Automatically generated\n"
"Language-Team: none\n"
"Language: en\n"
"MIME-Version: 1.0\n"
"Plural-Forms: nplurals=2; plural=(n > 1);\n"

msgid "你好世界"
msgstr "Hello，world！"

msgctxt "辅助翻译文本"
msgid "你好世界"
msgstr "Hello，world!(auxiliary)"

msgid "(1 尝试)"
msgid_plural "({{ remaining }} 尝试)"
msgstr[0] "(1 attempt)"
msgstr[1] "({{ remaining }} attempts)"

#, fuzzy
msgid "fuzzy测试"
msgstr "不被捕获"

msgid "空串也不会补货"
msgstr ""`;

export const OUTPUT_DICT = {
  headers: {
    '': '',
    'Content-Transfer-Encoding': '8bit',
    'Content-Type': 'text/plain; charset=UTF-8',
    'Language': 'en',
    'Language-Team': 'none',
    'Last-Translator': 'Automatically generated',
    'MIME-Version': '1.0',
    'PO-Revision-Date': '',
    'POT-Creation-Date': '',
    'Plural-Forms': 'nplurals=2; plural=(n > 1);',
    'Project-Id-Version': '',
    'Report-Msgid-Bugs-To': '',
  }, messages: {
    '(1 尝试)': [
      '(1 attempt)',
      '({{ remaining }} attempts)',
    ],
    '你好世界': {
      '': 'Hello，world！',
      '辅助翻译文本': 'Hello，world!(auxiliary)',
    },
  },
};
