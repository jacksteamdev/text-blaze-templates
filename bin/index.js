const path = require('path')
const fs = require('fs-extra')
const { getTemplate } = require('../src/convertTemplate')

const inputDir = '01-input-roam-templates'
const outputDir = '02-output-text-blaze'

fs.emptyDirSync(outputDir)

fs.readdir(inputDir).then(async (files) => {
  try {
    const mdFiles = files
      .filter((file) => file.endsWith('.md'))
      .map((fileName) => path.join(inputDir, fileName))

    await Promise.all(
      mdFiles.map(async (filePath) => {
        console.log('🚀: converting template', filePath)
        const text = await fs.readFile(filePath, 'utf8')

        const template = getTemplate(text)

        return fs.outputFile(filePath.replace(inputDir, outputDir), template)
      })
    )
  } catch (error) {
    console.error(error)
  }
})
