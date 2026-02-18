<template>
  <v-card rounded="xl" elevation="0" border class="pa-4 text-center">
    <p class="text-subtitle-2 text-medium-emphasis mb-2">{{ title }}</p>
    <Doughnut :data="chartData" :options="chartOptions" />
    <p class="text-h4 font-weight-bold mt-2" :style="{ color: scoreColor }">
      {{ score }}%
    </p>
  </v-card>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip)

export default {
  name: 'DonutChart',
  components: { Doughnut },
  props: {
    title: String,
    score: Number
  },
  computed: {
    scoreColor() {
      if (this.score >= 80) return '#4caf50'
      if (this.score >= 50) return '#ff9800'
      return '#f44336'
    },
    chartData() {
      return {
        datasets: [{
          data: [this.score, 100 - this.score],
          backgroundColor: [this.scoreColor, '#f5f5f5'],
          borderWidth: 0
        }]
      }
    },
    chartOptions() {
      return {
        cutout: '75%',
        plugins: { tooltip: { enabled: false } }
      }
    }
  }
}
</script>