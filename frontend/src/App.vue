<template>
  <div id="app">
    <UrlChecker @check="handleCheck" />
  </div>
</template>

<script>
import UrlChecker from './components/UrlChecker.vue'

export default {
  name: 'App',
  components: { UrlChecker },
  methods: {
    handleCheck(url) {
      console.log('URL:', url)
    }
  }
}
</script>

<style>
</style>