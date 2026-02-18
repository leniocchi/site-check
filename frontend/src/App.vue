<template>
  <div id="app">
    <UrlChecker @check="handleCheck" :loading="loading" />
    <ReportView v-if="report" :report="report" />
  </div>
</template>

<script>
import UrlChecker from './components/UrlChecker.vue'
import ReportView from './components/ReportView.vue'

export default {
  name: 'App',
  components: { UrlChecker, ReportView },
  data() {
    return {
      loading: false,
      report: null
    }
  },
  methods: {
    async handleCheck(url) {
      this.loading = true
      this.report = null
      try {
        const response = await fetch('http://localhost:3000/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })
        this.report = await response.json()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
</style>