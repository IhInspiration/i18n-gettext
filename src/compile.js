import Pofile from 'pofile';

// 分析经过gettext和i18n-gettext合并后的相关参数，生成json
export function sanitizePoData(poItems) {
  const messages = {};

  for (let item of poItems) {
    const ctx = item.msgctxt || '';
    if (item.msgstr[0] && item.msgstr[0].length > 0 && !item.flags.fuzzy && !item.obsolete) {
      if (!messages[item.msgid]) {
        messages[item.msgid] = {};
      }
      // 是否有复数形式
      messages[item.msgid][ctx] = item.msgstr.length === 1 ? item.msgstr[0] : item.msgstr;
    }
  }

  // 没有上下文的提取
  for (let key in messages) {
    if (Object.keys(messages[key]).length === 1 && messages[key]['']) {
      messages[key] = messages[key][''];
    }
  }
  return messages;
}

export function po2json(poContent) {
  const catalog = Pofile.parse(poContent);
  if (!catalog.headers.Language) {
    throw new Error('No Language headers found!');
  }
  return {
    headers: catalog.headers,
    messages: sanitizePoData(catalog.items),
  };
}
