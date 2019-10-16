const path = require('path')
const {exec} = require('child_process')

const execSync = num => new Promise((resolve, reject) => {
  exec(`${path.resolve(__dirname, '../../assets/wkhtmltopdf.exe')} -T 30MM -B 30mm --header-html ${path.resolve(__dirname, 'header.html')} ${path.resolve(__dirname, 'content.html')} --footer-html ${path.resolve(__dirname, 'footer.html')} ${path.resolve(__dirname, `../../temp/wkhtmltopdf-${num}.pdf`)}`, {
    windowsHide: true
  }, e => {
    if (e) reject(e)
    else resolve()
  })
})

const test = async num => {
  const start = new Date()
  await execSync(num)
  const end = new Date()
  const time = end - start
  return time
}

module.exports = {
  test
}