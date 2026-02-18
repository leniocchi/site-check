<template>
  <v-container>

    <!-- Kategorie Scores -->
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

    <!-- Einzelne Reports -->
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
    url: String
  },
  data() {
    return {
      scores: {
        accessibility: 78,
        privacy: 45,
        security: 91
      },
      tools: [
        { name: 'Lighthouse', category: 'Barrierefreiheit', score: 82, details: 'Placeholder' },
        { name: 'IBM', category: 'Barrierefreiheit', score: 74, details: 'Placeholder' },
        { name: 'axe-core', category: 'Barrierefreiheit', score: 80, details: 'Placeholder' },
        { name: 'Pa11y', category: 'Barrierefreiheit', score: 76, details: 'Placeholder' },
        { name: 'cookiemetrix', category: 'Datenschutz', score: 50, details: 'Placeholder' },
        { name: 'PrivacySpy', category: 'Datenschutz', score: 40, details: 'Placeholder' },
        { name: 'CSP Evaluator', category: 'Sicherheit', score: 90, details: 'Placeholder' },
        { name: 'Mozilla Observatory', category: 'Sicherheit', score: 88, details: 'Placeholder' },
        { name: 'SSL', category: 'Sicherheit', score: 95, details: 'Placeholder' },
      ]
    }
  }
}
</script>