<template>
    <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    RouterView
  },
  setup() {
    // Vous pouvez ajouter une logique de setup ici si nécessaire
    return {}
  }
})
</script>

<style>
/* Vos styles globaux si nécessaire */
</style>