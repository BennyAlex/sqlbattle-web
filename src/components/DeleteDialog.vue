<template>
  <v-dialog v-model="dialog" width="350">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar class="main-bg" flat dense>
        <v-toolbar-title>{{ title }} löschen</v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="close()" dark title="Schließen">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <h2>{{ title }}-Name: {{ name || id }}</h2>
        <div style="font-size: 16px">
          Möchten Sie {{ name || id }} wirklich löschen?
        </div>
        <p class="error-text" v-if="error">
          Es ist ein Fehler aufgetreten: <br>
          <b>{{ error }}</b>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn flat color="red" @click="deleteItem()">Löschen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DeleteDialog',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      error: null
    }
  },
  methods: {
    async deleteItem() {
      const response = await fetch(`/api/${this.type}/${this.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        alert(response.statusText)
        return
      }

      const {error} = await response.json()
      if (error) this.error = error
      else {
        this.$emit('refresh')
        this.close()
      }
    },
    close() {
      this.error = null
      this.dialog = false
    }
  }
}
</script>
