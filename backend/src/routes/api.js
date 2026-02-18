const express = require('express')
const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.post('/check', async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' })
  }

  try {
    res.json({
      url,
      accessibility: {},
      privacy: {},
      security: {}
    })
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Prüfen der URL' })
  }
})

module.exports = router