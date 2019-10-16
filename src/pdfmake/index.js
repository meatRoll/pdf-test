const fs = require('fs')
const path = require('path')
const url = require('url')
const puppeteer = require('puppeteer')

const writeFile = (pdfPath, data) => new Promise(resolve => {
  const buffer = Buffer.from(data.data)
  fs.writeFile(pdfPath, buffer, 'binary', e => resolve())
})

const test = async (num, contentLength) => {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: [ '--disable-extensions' ]
  })
  try {
    const waitForClose = () => new Promise(async (resolve, reject) => {
      const [page] = await browser.pages()
      await page.exposeFunction('exportTime', async (time, data) => resolve({time, data}))
      await page.goto(
        url.format({
          pathname: path.resolve(__dirname, 'web/index.html'),
          query: {
            contentLength
          },
          protocol: 'file:',
          slashes: true
        })
      )
      setTimeout(() => reject(Error('Time out')), 10000)
    })
    const {time, data} = await waitForClose()
    const pdfPath = path.resolve(__dirname, `../../temp/pdfmake-${num}.pdf`)
    await browser.close()
    await writeFile(pdfPath, data)
    return time
  } catch (e) {
    await browser.close()
    throw e
  }
}

module.exports = {
  test
}