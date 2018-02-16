<template>
  <div class="total-center" style="padding: 48px">
    <div>
      <v-progress-circular
        indeterminate
        :size="85"
        :width="3"
        class="primary--text"
      />
      <div style="font-size: 16px">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: 'Daten werden geladen, bitte warten...'
    }
  }
}
</script>
