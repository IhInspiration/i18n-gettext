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
