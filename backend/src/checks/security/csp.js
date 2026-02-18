const axios = require('axios')
const https = require('https')

const agent = new https.Agent({ rejectUnauthorized: false })
const UNSAFE_VALUES = ["'unsafe-inline'", "'unsafe-eval'", 'data:', '*']

const checkCSP = async (url) => {
  try {
    const response = await axios.get(url, { httpsAgent: agent })
    const cspHeader = response.headers['content-security-policy']

    if (!cspHeader) {
      return {
        score: 0,
        status: 'error',
        message: 'Kein CSP Header gefunden',
        details: []
      }
    }

    const directives = cspHeader.split(';').map(d => d.trim())
    const findings = []

    directives.forEach(directive => {
      UNSAFE_VALUES.forEach(unsafe => {
        if (directive.includes(unsafe)) {
          findings.push(`Unsicherer Wert "${unsafe}" in: ${directive}`)
        }
      })
    })

    let score = 100
    score -= findings.length * 15
    score = Math.max(0, score)

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: findings.length === 0 ? 'CSP sieht gut aus' : `${findings.length} Probleme gefunden`,
      details: findings
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'CSP Check fehlgeschlagen',
      details: []
    }
  }
}

module.exports = checkCSP