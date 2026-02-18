const https = require('https')

const checkSSL = async (url) => {
  try {
    const domain = new URL(url).hostname

    const cert = await new Promise((resolve, reject) => {
      const req = https.request({ host: domain, port: 443, method: 'GET' }, (res) => {
        resolve(res.socket.getPeerCertificate())
      })
      req.on('error', reject)
      req.end()
    })

    if (!cert || !cert.subject) {
      return {
        score: 0,
        status: 'error',
        message: 'Kein SSL Zertifikat gefunden',
        details: []
      }
    }

    const validTo = new Date(cert.valid_to)
    const now = new Date()
    const daysLeft = Math.floor((validTo - now) / (1000 * 60 * 60 * 24))

    const findings = []
    let score = 100

    if (daysLeft < 0) {
      findings.push('Zertifikat ist abgelaufen')
      score -= 100
    } else if (daysLeft < 30) {
      findings.push(`Zertifikat läuft in ${daysLeft} Tagen ab`)
      score -= 40
    } else if (daysLeft < 90) {
      findings.push(`Zertifikat läuft in ${daysLeft} Tagen ab`)
      score -= 10
    }

    score = Math.max(0, score)

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: daysLeft > 0 ? `Zertifikat gültig noch ${daysLeft} Tage` : 'Zertifikat abgelaufen',
      details: [
        { label: 'Ausgestellt für', value: cert.subject.CN },
        { label: 'Ausgestellt von', value: cert.issuer.CN },
        { label: 'Gültig bis', value: cert.valid_to },
        { label: 'Noch gültig', value: `${daysLeft} Tage` }
      ]
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'SSL Check fehlgeschlagen',
      details: []
    }
  }
}

module.exports = checkSSL