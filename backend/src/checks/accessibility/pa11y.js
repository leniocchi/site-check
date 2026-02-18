const pa11y = require('pa11y')

const checkPa11y = async (url) => {
  try {
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      timeout: 30000,
      chromiumArgs: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const errors = results.issues.filter(i => i.type === 'error')
    const warnings = results.issues.filter(i => i.type === 'warning')
    const notices = results.issues.filter(i => i.type === 'notice')

    let score = 100
    score -= errors.length * 15
    score -= warnings.length * 5
    score = Math.max(0, score)

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: `${errors.length} Fehler | ${warnings.length} Warnungen | ${notices.length} Hinweise`,
      details: results.issues.map(i => ({
        type: i.type,
        message: i.message,
        code: i.code,
        selector: i.selector
      }))
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'Pa11y Check fehlgeschlagen',
      details: []
    }
  }
}

module.exports = checkPa11y