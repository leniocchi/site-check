<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <div class="d-flex align-center ga-4">
        <v-chip
          :color="scoreColor"
          size="small"
          variant="flat"
        >
          {{ tool.score }}%
        </v-chip>
        <span class="font-weight-medium">{{ tool.name }}</span>
        <v-chip size="x-small" variant="tonal">{{ tool.category }}</v-chip>
      </div>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <p class="text-medium-emphasis">{{ tool.details }}</p>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'ToolAccordion',
  props: {
    tool: Object
  },
  computed: {
    scoreColor() {
      if (this.tool.score >= 80) return 'success'
      if (this.tool.score >= 50) return 'warning'
      return 'error'
    }
  }
}
</script>