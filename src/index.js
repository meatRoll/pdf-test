const fs = require('fs')
const path = require('path')
const open = require('open')

const checkToRun = dirPath => new Promise((resolve, reject) => {
  fs.stat(dirPath, (e, stats) => {
    if (e) {
      reject(e)
      return
    }
    if (!stats.isDirectory(dirPath)) {
      resolve()
      return
    }
    const indexFilePath = path.resolve(dirPath, 'index.js')
    const isFileExists = fs.existsSync(indexFilePath)
    if (isFileExists) resolve(indexFilePath)
    else resolve()
  })
})

const mkdir = dirPath => new Promise((resolve, reject) => {
  fs.mkdir(dirPath, e => {
    if (e) reject(e)
    resolve()
  })
})

const writeFile = content => new Promise(async (resolve, reject) => {
  const dirPath = path.resolve(__dirname, '../temp')
  const isDirExists = fs.existsSync(dirPath)
  if (!isDirExists) {
    try {
      await mkdir(dirPath)
    } catch (e) {
      reject(e)
      return
    }
  }
  const filePath = path.resolve(dirPath, 'report.html')
  fs.writeFile(filePath, content, e => {
    if (e) reject(e)
    resolve(filePath)
  })
})

const buildReportHtml = async results => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>测试结果</title>
      <style>
        .title {
          width: 100%;
          height: 30px;
          line-height: 30px;
          font-size: 24px;
          font-weight: bold;
          color: #000000;
          margin: 0;
          padding: 15px 0;
        }
        .result {
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 18px;
          color: #1A1A1A;
          margin: 0;
          padding: 5px 0;
        }
      </style>
    </head>
    <body>
      <h3 class="title">测试结果如下：</h3>
      ${results.map(result => `
        <div class="result">
          <span class="key">${result.title}：</span>
          <span class="value">${result.time}ms</span>
        </div>
      `)}
    </body>
    </html>
  `
  const filePath = await writeFile(html)
  return filePath
}

fs.readdir(__dirname, async (e, files) => {
  if (e) {
    console.error(e)
    return
  }
  try {
    const results = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const dirPath = path.resolve(__dirname, file)
      let filePath
      filePath = await checkToRun(dirPath)
      if (filePath) {
        const {getResult} = require(filePath) 
        if (getResult) {
          const result = await getResult() /* title, time */
          results.push(result)
        }
      }
    }
    const filePath = await buildReportHtml(results)
    open(filePath)
  } catch (e) {
    console.error(e)
  }
})