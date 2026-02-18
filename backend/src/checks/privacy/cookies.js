const puppeteer = require('puppeteer')

const checkCookies = async (url) => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    const cookies = await page.cookies()

    const sessionCookies = cookies.filter(c => !c.expires || c.expires === -1)
    const persistentCookies = cookies.filter(c => c.expires && c.expires > 0)
    const thirdPartyCookies = cookies.filter(c => !c.domain.includes(new URL(url).hostname.replace('www.', '')))
    const secureCookies = cookies.filter(c => c.secure)
    const httpOnlyCookies = cookies.filter(c => c.httpOnly)

    let score = 100
    score -= thirdPartyCookies.length * 10
    score -= (cookies.length - secureCookies.length) * 5
    score -= (cookies.length - httpOnlyCookies.length) * 5
    score = Math.max(0, score)

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: `${cookies.length} Cookies | ${thirdPartyCookies.length} Drittanbieter | ${persistentCookies.length} persistent`,
      details: cookies.map(c => ({
        name: c.name,
        domain: c.domain,
        secure: c.secure,
        httpOnly: c.httpOnly,
        sameSite: c.sameSite,
        thirdParty: !c.domain.includes(new URL(url).hostname.replace('www.', ''))
      }))
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'Cookie Check fehlgeschlagen',
      details: []
    }
  } finally {
    if (browser) await browser.close()
  }
}

module.exports = checkCookies