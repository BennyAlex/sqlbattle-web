<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar class="main-bg">
        <v-btn icon @click="dialog = false" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>Datenbank bearbeiten</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click="save()" dark>Speichern</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <h2>Datenbank-ID: {{ database.id }}</h2>
          <v-text-field textarea label="SQL-Statement" v-model="database.sql" required/>
          <p class="error-text" v-if="error">
            Es ist ein Fehler aufgetreten: <br>
            <b>{{ error }}</b>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DatabaseDialog',
  props: {
    database: {
      type: Object,
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
    async save () {
      const result = await fetch(`/api/databases/${this.database.id}`, {
        method: 'PUT',
        body: JSON.stringify({sql: this.database.sql})
      })
      const {error} = await result.json()
      if (error) this.error = error
      else {
        this.dialog = false
        this.$emit('refresh')
      }
    }
  }
}
</script>
