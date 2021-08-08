const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  let str = '';
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];  // name,value
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},` // {a: 'aaa'}
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  const children = el.children;
  if (children) {
    return children.map(child => gen(child)).join(',')
  } else {
    return false
  }
}

function gen(node) {  // 区分元素还是文本
  console.log('gen', node)

  if (node.type === 1) {
    return generate(node)
  } else {
    // 文本节点逻辑不能用 _c来处理
    // 有 {{}} 普通文本 混合文本
    let text = node.text
    if (defaultTagRE.test(text)) {
      // 是带有 {{}}
      let tokens = [];
      let match;
      let index = 0;
      let lastIndex = defaultTagRE.lastIndex = 0 // Todo 为什么这里等于 0
      while(match = defaultTagRE.exec(text)) {
        index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }

      // NOTE: 如果文本节点是这样的 {{a}} b {{c}} d, 下面的代码是为了处理 d
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }

      return `_v(${tokens.join('+')})`
    } else {
      return `_v(${JSON.stringify(text)})`
    }
  }
}

export function generate(el) {
  console.log(el) // 转化成 render 代码

  let children = genChildren(el)

  let code = `_c('${el.tag}', ${
    el.attrs.length ? genProps(el.attrs) : 'undefined'
  } ${
    children ? `,${children}` : ''
  })`

  return code;

  // html代码 => js代码 字符串拼接
}
