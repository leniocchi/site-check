const puppeteer = require('puppeteer')

const checkIBM = async (url) => {
  let browser
  try {
    const aChecker = require('accessibility-checker')

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    const results = await aChecker.getCompliance(page, 'test')
    const report = results.report

    const violations = report.results.filter(r => r.level === 'violation')
    const potentials = report.results.filter(r => r.level === 'potentialviolation')

    let score = 100
    score -= violations.length * 15
    score -= potentials.length * 5
    score = Math.max(0, score)

    await aChecker.close()

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: `${violations.length} Verstöße | ${potentials.length} potentielle Verstöße`,
      details: violations.map(v => ({
        message: v.message,
        level: v.level,
        path: v.path.dom
      }))
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'IBM Equal Access Check fehlgeschlagen',
      details: []
    }
  } finally {
    if (browser) await browser.close()
  }
}

module.exports = checkIBM