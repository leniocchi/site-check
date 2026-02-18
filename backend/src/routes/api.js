const express = require('express')
const router = express.Router()

const checkCSP = require('../checks/security/csp')
const checkObservatory = require('../checks/security/observatory')
const checkSSL = require('../checks/security/ssl')

const checkLighthouse = require('../checks/accessibility/lighthouse')
const checkAxe = require('../checks/accessibility/axe')
const checkPa11y = require('../checks/accessibility/pa11y')
const checkIBM = require('../checks/accessibility/codesniffer')

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.post('/check', async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' })
  }

  try {
    const [csp, observatory, ssl, lighthouse, axe, pa11y, ibm] = await Promise.all([
        checkCSP(url),
        checkObservatory(url),
        checkSSL(url),
        checkLighthouse(url),
        checkAxe(url),
        checkPa11y(url),
        checkIBM(url)
    ])

    res.json({
      url,
      accessibility: { lighthouse, axe, pa11y, ibm },
      privacy: {},
      security: { csp, observatory, ssl }
    })
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Prüfen der URL' })
  }
})

module.exports = router