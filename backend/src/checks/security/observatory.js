const axios = require('axios')

const checkObservatory = async (url) => {
  try {
    const domain = new URL(url).hostname

    const response = await axios.post(
      `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${domain}`
    )

    const data = response.data
    const score = Math.min(100, Math.max(0, data.score))

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
      message: `Grade: ${data.grade} | Tests bestanden: ${data.tests_passed}/${data.tests_quantity}`,
      details: data.details_url
    }

  } catch (error) {
    console.log(error.message)
    return {
      score: 0,
      status: 'error',
      message: 'Observatory Check fehlgeschlagen',
      details: []
    }
  }
}

module.exports = checkObservatory