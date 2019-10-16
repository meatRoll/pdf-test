const path = require('path')
const url = require('url')
const puppeteer = require('puppeteer')

const test = async num => {
  const start = new Date()
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: [ '--disable-extensions' ]
  })
  const [page] = await browser.pages()
  await page.goto(
    url.format({
      pathname: path.resolve(__dirname, 'content.html'),
      protocol: 'file:',
      slashes: true
    }),
    {
      waitUntil: 'networkidle0'
    }
  )
  await page.emulateMedia('screen')
  const pdfPath = path.resolve(__dirname, `../../temp/puppeteer-${num}.pdf`)
  await page.pdf({
    format: 'A4',
    displayHeaderFooter: true,
    printBackground: true,
    path: pdfPath,
    margin: {
      top: 100,
      bottom: 100
    },
    headerTemplate: `
      <div style="width:100%;height:20px;font-size:16px;color:#000000;">这是头部</div>
    `,
    footerTemplate: `
      <div style="width:100%;height:20px;font-size:16px;color:#000000;">这是尾部</div>
    `
  })
  await browser.close()
  const end = new Date()
  const time = end - start
  return time
}

module.exports = {
  test
}