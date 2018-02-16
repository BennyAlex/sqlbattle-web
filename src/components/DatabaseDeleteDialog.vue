<template>
  <v-dialog v-model="dialog" width="420">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar class="main-bg" flat dense>
        <v-toolbar-title>Datenbank löschen</v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="dialog = false" dark>
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <h2>Datenbank-ID: {{ dbID }}</h2>
          <div style="font-size: 15px">
            Möchten Sie die Datenbank {{ dbID }} wirklich löschen?
          </div>
          <p class="error-text" v-if="error">
            Es ist ein Fehler aufgetreten: <br>
            <b>{{ error }}</b>
          </p>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn flat color="red" @click="deleteDb()">Löschen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DatabaseDeleteDialog',
  props: {
    dbID: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      error: null
    }
  },
  methods: {
    async deleteDb () {
      const result = await fetch(`/api/databases/${this.dbID}`, {
        method: 'DELETE'
      })
      const {error} = await result.json()
      if (error) this.error = error
      else this.$emit('refresh')
    }
  }
}
</script>
