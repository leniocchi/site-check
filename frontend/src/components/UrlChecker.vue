<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">

        <div class="text-center pa-8">
          <h1 class="font-weight-bold mb-2">Site Check</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Prüfe Accessibility, Performance und Sicherheit einer Website
          </p>
        </div>

        <div class="pa-8">
          <v-text-field
            v-model="url"
            clearable
            label="URL"
            placeholder="https://example.com"
            prepend-inner-icon="mdi-web"
            variant="outlined"
            class="mb-4"
            :disabled="loading"
          />
          <v-btn
            @click="startCheck"
            color="black"
            size="large"
            rounded="lg"
            block
            :disabled="!url"
            :loading="loading"
          >
            Jetzt prüfen
          </v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'UrlChecker',
    props: {
      loading: Boolean
    },
    data() {
        return {
            url: ''
        }
    },
    methods: {
        startCheck() {
            if (!this.url) return
            this.$emit('check', this.url)
        }
    }
}
</script>