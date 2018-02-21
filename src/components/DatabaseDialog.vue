<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <slot slot="activator"/>
    <v-card>

      <v-toolbar class="main-bg" fixed>
        <v-btn icon @click="close()" dark :disabled="isSaving">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>Datenbank {{ dbID ? 'bearbeiten' : 'anlegen'}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click="save()" dark :disabled="isSaving">{{ isSaving ? 'Wird gespeichert...' : 'Speichern' }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container>
          <v-form ref="form">
            <p class="error-text" v-if="error">
              Es ist ein Fehler aufgetreten: <br>
              <b>{{ error }}</b>
            </p>

            <h2 v-if="dbID">Datenbank-Name: {{ id }}</h2>
            <v-text-field v-model="id" label="Datenbank Name" required :rules="required" v-else/>

            <v-text-field textarea label="SQL-Statement" v-model="sql" required :rules="required" :rows="rows"/>

            <p class="error-text" v-if="error">
              Es ist ein Fehler aufgetreten: <br>
              <b>{{ error }}</b>
            </p>
          </v-form>
        </v-container>
      </v-content>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DatabaseDialog',

  props: {
    dbID: {
      type: [Number, String],
      default: null
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialog: false,
      error: null,
      isSaving: false,
      id: '',
      sql: '',
      required: [
        v => !!v || 'Dies ist ein Pflichtfeld'
      ]
    }
  },

  computed: {
    rows() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 11
        case 'sm':
          return 15
        case 'md':
          return 19
        case 'lg':
          return 23
        case 'xl':
          return 27
      }
    }
  },

  async mounted() {
    if (this.dbID) {
      const response = await fetch(`/api/databases/${this.dbID}`)

      if (!response.ok) {
        alert(response.statusText)
        return
      }

      const db = await response.json()
      this.id = db.id
      this.sql = db.sql
    }
  },

  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.isSaving = true
        const response = await fetch(`/api/databases/${this.id}`, {
          method: 'PUT',
          body: JSON.stringify({sql: this.sql})
        })
        const result = await response.json()
        this.error = result.error ? result.error : response.ok ? null : response.statusText
        this.isSaving = false
        if (!this.error) this.close()
      }
    },

    close() {
      this.$emit('refresh')
      this.error = null
      this.dialog = false
      if (!this.dbID) this.$refs.form.reset() // empty fields because the db wasn't saved
    }
  }
}
</script>
