const { default: lighthouse } = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const checkLighthouse = async (url) => {
  let chrome
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox']
    })

    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['accessibility', 'performance', 'best-practices']
    })

    const categories = result.lhr.categories
    const accessibility = Math.round(categories.accessibility.score * 100)
    const performance = Math.round(categories.performance.score * 100)
    const bestPractices = Math.round(categories['best-practices'].score * 100)

    const score = accessibility

    const audits = Object.values(result.lhr.audits)
      .filter(a => a.score !== null && a.score < 1)
      .map(a => ({
        title: a.title,
        description: a.description,
        score: Math.round(a.score * 100)
      }))

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: `Accessibility: ${accessibility} | Performance: ${performance} | Best Practices: ${bestPractices}`,
      details: audits
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'Lighthouse Check fehlgeschlagen',
      details: []
    }
  } finally {
    if (chrome) await chrome.kill()
  }
}

module.exports = checkLighthouse