const puppeteer = require('puppeteer')

const KNOWN_TRACKERS = [
  'google-analytics.com',
  'googletagmanager.com',
  'facebook.com',
  'facebook.net',
  'doubleclick.net',
  'googlesyndication.com',
  'twitter.com',
  'linkedin.com',
  'hotjar.com',
  'segment.com',
  'mixpanel.com',
  'amplitude.com',
  'intercom.io',
  'hubspot.com',
  'salesforce.com',
  'marketo.com',
  'criteo.com',
  'amazon-adsystem.com',
  'bing.com',
  'yahoo.com'
]

const checkTrackers = async (url) => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    const detectedTrackers = []

    await page.setRequestInterception(true)

    page.on('request', request => {
      const requestUrl = request.url()
      KNOWN_TRACKERS.forEach(tracker => {
        if (requestUrl.includes(tracker) && !detectedTrackers.find(t => t.tracker === tracker)) {
          detectedTrackers.push({
            tracker,
            url: requestUrl
          })
        }
      })
      request.continue()
    })

    await page.goto(url, { waitUntil: 'networkidle2' })

    let score = 100
    score -= detectedTrackers.length * 15
    score = Math.max(0, score)

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: `${detectedTrackers.length} Tracker gefunden`,
      details: detectedTrackers
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'Tracker Check fehlgeschlagen',
      details: []
    }
  } finally {
    if (browser) await browser.close()
  }
}

module.exports = checkTrackers