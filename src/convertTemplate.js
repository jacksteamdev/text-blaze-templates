function getTemplate(text) {
  let indent = 0;
  let start = false;

  const template = text
    .split(/^( *)- /gm)
    .reduce((r, line, i) => {
      start = line.length > 0 || start;

      if (!start) {
        return r;
      } else if (start && /^\s*$/.test(line)) {
        // This is a new block
        // console.log('🚀: indentation', line.length / 4)
        const _indent = line.length / 4;
        let keys = ['enter'];
        if (_indent > indent) {
          // Need to indent one more
          keys.push('tab');
        } else if (_indent < indent) {
          // Need to indent less
          keys.push(...Array(indent - _indent).fill('enter'));
        }
        // console.log('🚀: keys', keys)
        indent = _indent;
        return r + (i ? ' ' + keys.map((key) => `{key: ${key}}`).join('') : '');
      } else {
        // This is a line of text
        // console.log('🚀: line', line)
        return r + line.trim();
      }
    }, '')
    .trim();

  return template;
}

exports.getTemplate = getTemplate;
