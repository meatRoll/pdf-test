const run = async () => {
  const start = new Date()
  const el = document.getElementById('pdf')
  const opts = {
    margin: [30, 10, 30, 10],
    html2canvas:  {
      dpi: 192
    },
    image: {
      type: 'jpeg',
      quality: 1
    }
  }
  const data = await html2pdf().set(opts).from(el).toPdf().get('pdf').then(pdfObj => {
    const pdfPages = pdfObj.internal.pages
    for (let i = 1; i < pdfPages.length; i++) {
      pdfObj.setPage(i)
      pdfObj.text('这是头部', 10, 20)
      pdfObj.text('这是尾部', 10, 280)
    }
  }).outputPdf()
  const end = new Date()
  const time = end - start
  exportTime(time, data)
}

run()