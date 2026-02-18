<template>
  <div id="app">
    <UrlChecker @check="handleCheck" />
    <ReportView v-if="url" :url="url" />
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
      url: null
    }
  },
  methods: {
    handleCheck(url) {
      this.url = url
    }
  }
}
</script>

<style>
</style>