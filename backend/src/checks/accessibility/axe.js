const puppeteer = require('puppeteer')
const fs = require('fs')

const axeSource = fs.readFileSync(require.resolve('axe-core'), 'utf8')

const checkAxe = async (url) => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    await page.evaluate(axeSource)

    const results = await page.evaluate(async () => {
      return await window.axe.run()
    })

    const violations = results.violations
    const passes = results.passes.length

    let score = 100
    violations.forEach(v => {
      if (v.impact === 'critical') score -= 20
      if (v.impact === 'serious') score -= 10
      if (v.impact === 'moderate') score -= 5
      if (v.impact === 'minor') score -= 2
    })
    score = Math.max(0, score)

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: `${violations.length} Verstöße | ${passes} Tests bestanden`,
      details: violations.map(v => ({
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length
      }))
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'axe-core Check fehlgeschlagen',
      details: []
    }
  } finally {
    if (browser) await browser.close()
  }
}

module.exports = checkAxe