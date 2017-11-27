# i18n-gettext

[![Build Status](https://travis-ci.org/IhInspiration/i18n-gettext.svg?branch=master)](https://travis-ci.org/IhInspiration/i18n-gettext)
[![codecov](https://codecov.io/gh/IhInspiration/i18n-gettext/branch/master/graph/badge.svg)](https://codecov.io/gh/IhInspiration/i18n-gettext)

`i18n-gettext`支持从vm，string，mustache三种格式的文件提取gettext标记。同时可以将翻译好的`.po`文件转换为`.json`文件

## 前言

这个模块主要是用于帮助对项目进行国际化使用的，这个模块灵感来自[easygettext](https://github.com/Polyconseil/easygettext)，但是由于`easygettext`有一些特性不太符合我们项目的要求，因而在保持原有架构的基础上，进行了一定幅度的修改，主要原因有以下几点

1. `easygettext`主要利用了DOM节点进行分析，但是对我们这三类文件来说，DOM节点分析会出现问题，这是由于vm和mustache语法导致的，那么会造成分析出来的`.po`文件含有大量的无用参考说明(提取文件位置注释过于混乱)
2. `vm`的提取采用这种方式`#qMessage('内容')`的原因主要是这样可以通过后端直接解析，那么对于页面的首屏显示有很好的收益，因而原有的`easygettext`形式不太符合我们的要求。
3. `easygettext`将`.po`文件转为`.json`文件时，会将几种语言打包到相同文件，由于我们工程偏大，如果能将语言包分开，在减小文件大小的同时能更好的管理

## 使用方法&示例

**gettext-extract**

一个简单的命令行来将你要提取的文件输出到`.pot`文件

```
gettext-extract --output extract.pot product.vm tipTmpl.string
```

product.vm
```
<li><a href="javascript:void(0)"><span>#qMessage('你好，世界！')</span></a></li>
<textarea name="test" placeholder="#qMessage('多个用逗号隔开')" class="hotel_textarea">#qMessage('你好，朋友！')</textarea>
```

tipTmpl.string
```
<tr class="q_ping_text_content">
    <td>[# '你好' | i18n #]</td>
    <td class="td_detail">[# '你好' | i18n #]</td>
</tr>
```

gettext-extract支持的参数

`--startDelimiter <sign>` 开始符，默认为`[#`，注意此处只能应用于`string/mustache`，同时注意`string/mustache`的标记符为`{{`和`}}`，请不要改成这个，否则会出现混乱，另外，`vm`由于为函数，因此必须用#号开头，采用传入标记内容的方式

`--endDelimiter <sign>` 结束符，默认为`#]`，其他同开始符

`--attribute <attribute>` 可以添加多个其他的属性，默认为qMessage，i18n，get-text，translate

`--output <file>` 输出到的文件

`--quiet` 加上之后不会提示出错信息

`<files>` 最后跟的就是要提取的文件/文件

示例

```
gettext-extract --attribute q-translate --output extract.pot product.vm tipTmpl.string
gettext-extract --startDelimiter '<%' --endDelimiter '%>' --output extract.pot product.vm tipTmpl.string
```

**gettext-compile**

提取`.po`文件到`.json`文件，输入几种语言的`.po`，最后会输出几个`.json`文件到指定目录

参数

`--dir <directory>` 要输出语言包`.json`的目录

`<files>` 最后面接所有的`.po`文件

示例

```
gettext-compile --dir ./i18n/ en.po zh-CN.po de.po
```

**关于标记添加**

`vm`

直接在需要标记的本体语言中标记，其中`qMessage`的位置可为默认的四个属性和你在命令行`--attribute`后面添加的属性

标记前
```
<span>你好，世界！</span>
```

标记后
```
<span>#qMessage('你好，世界！')</span>
```

`string/mustache`

同上`i18n`的位置为默认四属性和命令行添加的属性

标记前
```
<td>你好</td>
```
标记后
```
<td>[# '你好' | i18n #]</td>
```


### 测试

利用`mocha`执行测试

```
npm run test
```
执行覆盖率检测
```
npm run cover
```

### CLI使用方法

```
npm run build
```

然后执行`extract-cli.js`，`compile-cli.js`同理，`gettext-extract`命令对应`extract-cli.js`文件，`gettext-compile`命令对应`compile-cli.js`文件，使用方法上面已经提到，此处不赘述。

```
./dist/extract-cli.js --attribute q-translate ~/output.html
```

### 致谢

感谢`easygettext`作者，代码有部分来自此库，在此给予感谢~

另外，感谢[WoHal](https://github.com/WoHal)对于我部署覆盖率给予的帮助

### 许可

MIT
