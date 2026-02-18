<template>
  <v-container>

    <v-row justify="center" class="mb-8">
      <v-col cols="12" sm="4" md="3">
        <DonutChart title="Barrierefreiheit" :score="scores.accessibility" />
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <DonutChart title="Datenschutz" :score="scores.privacy" />
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <DonutChart title="Sicherheit" :score="scores.security" />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="9">
        <p class="text-h6 font-weight-bold mb-4">Detaillierte Reports</p>
        <v-expansion-panels variant="accordion">
          <ToolAccordion
            v-for="tool in tools"
            :key="tool.name"
            :tool="tool"
          />
        </v-expansion-panels>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import DonutChart from './DonutChart.vue'
import ToolAccordion from './ToolAccordion.vue'

export default {
  name: 'ReportView',
  components: { DonutChart, ToolAccordion },
  props: {
    report: Object
  },
  computed: {
    scores() {
      return this.report.scores
    },
    tools() {
      return [
        { name: 'Lighthouse', category: 'Barrierefreiheit', score: this.report.accessibility.lighthouse.score, details: this.report.accessibility.lighthouse.details },
        { name: 'axe-core', category: 'Barrierefreiheit', score: this.report.accessibility.axe.score, details: this.report.accessibility.axe.details },
        { name: 'Pa11y', category: 'Barrierefreiheit', score: this.report.accessibility.pa11y.score, details: this.report.accessibility.pa11y.details },
        { name: 'Cookies', category: 'Datenschutz', score: this.report.privacy.cookies.score, details: this.report.privacy.cookies.details },
        { name: 'Tracker', category: 'Datenschutz', score: this.report.privacy.trackers.score, details: this.report.privacy.trackers.details },
        { name: 'CSP', category: 'Sicherheit', score: this.report.security.csp.score, details: this.report.security.csp.message },
        { name: 'Mozilla Observatory', category: 'Sicherheit', score: this.report.security.observatory.score, details: this.report.security.observatory.details },
        { name: 'SSL', category: 'Sicherheit', score: this.report.security.ssl.score, details: this.report.security.ssl.details },
      ]
    }
  }
}
</script>