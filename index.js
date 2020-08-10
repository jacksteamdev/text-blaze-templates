const path = require('path')
const fs = require('fs-extra')

fs.emptyDirSync('templates')

fs.readdir('src').then(async (files) => {
  try {
    const mdFiles = files
      .filter((file) => file.endsWith('.md'))
      .map((fileName) => path.join('src', fileName))

    await Promise.all(
      mdFiles.map(async (filePath) => {
        const text = await fs.readFile(filePath, 'utf8')

        const template = text
          .split(/[\n\r]/g)
          .reduce(
            (r, line) => {
              const replaced = line.replace(/^ */, (match) => {
                const indent = match.length

                // Levels of indentation change
                const change =
                  line.length && Math.floor((indent - r.indent) / 2)

                let result
                if (!line.length) {
                  // Empty line, new block
                  result = '{key: enter}'
                } else if (line.length && change > 0) {
                  // Indent one level
                  result = '{key: tab}'
                } else if (line.length && change < 0) {
                  // Unindent
                  result = Array.from(
                    { length: Math.abs(change) },
                    () => '{key: enter}'
                  ).join('')
                } else {
                  // Strip leading spaces
                  result = ''
                }

                // console.log('============================')
                // console.log(`🚀: line: "${line}"`)
                // console.log('🚀: line.length', line.length)
                // console.log('🚀: prev indent', r.indent)
                // console.log('🚀: this indent', indent)
                // console.log('🚀: change', change)
                // console.log(`🚀: match: "${match}"`)
                // console.log('🚀: offset', offset)
                // console.log(`🚀: result: "${result}"`)

                r.indent = line.length ? indent : r.indent
                return result
              })

              r.lines.push(replaced)
              return r
            },
            { indent: 0, lines: [] }
          )
          .lines.join('\n')
          .replace(/\n\{key: enter\}\n?/g, ' {key: enter}')

        return fs.outputFile(filePath.replace('src', 'templates'), template)
      })
    )
  } catch (error) {
    console.error(error)
  }
})
