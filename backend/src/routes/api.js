const express = require('express')
const router = express.Router()

const checkCSP = require('../checks/security/csp')
const checkObservatory = require('../checks/security/observatory')
const checkSSL = require('../checks/security/ssl')

const checkLighthouse = require('../checks/accessibility/lighthouse')
const checkAxe = require('../checks/accessibility/axe')

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.post('/check', async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' })
  }

  try {
    const [csp, observatory, ssl, lighthouse, axe] = await Promise.all([
        checkCSP(url),
        checkObservatory(url),
        checkSSL(url),
        checkLighthouse(url),
        checkAxe(url)
    ])

    res.json({
      url,
      accessibility: { lighthouse, axe },
      privacy: {},
      security: { csp, observatory, ssl }
    })
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Prüfen der URL' })
  }
})

module.exports = router