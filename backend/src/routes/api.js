const express = require('express')
const router = express.Router()

const checkCSP = require('../checks/security/csp')
const checkObservatory = require('../checks/security/observatory')
const checkSSL = require('../checks/security/ssl')

const checkLighthouse = require('../checks/accessibility/lighthouse')
const checkAxe = require('../checks/accessibility/axe')
const checkPa11y = require('../checks/accessibility/pa11y')

const checkCookies = require('../checks/privacy/cookies')
const checkTrackers = require('../checks/privacy/tracker')

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.post('/check', async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' })
  }

  try {
    const csp = await checkCSP(url)
    const observatory = await checkObservatory(url)
    const ssl = await checkSSL(url)
    const lighthouse = await checkLighthouse(url)
    const axe = await checkAxe(url)
    const pa11y = await checkPa11y(url)
    const cookies = await checkCookies(url)
    const trackers = await checkTrackers(url)

    const average = (scores) => {
        const valid = scores.filter(s => s !== null && s !== undefined)
        if (valid.length === 0) return 0
        return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
    }

    const accessibilityScore = average([lighthouse.score, axe.score, pa11y.score])
    const privacyScore = average([cookies.score, trackers.score])
    const securityScore = average([csp.score, observatory.score, ssl.score])

    res.json({
        url,
        scores: {
            accessibility: accessibilityScore,
            privacy: privacyScore,
            security: securityScore
        },
        accessibility: { lighthouse, axe, pa11y },
        privacy: { cookies, trackers },
        security: { csp, observatory, ssl }
    })
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Prüfen der URL' })
  }
})

module.exports = router