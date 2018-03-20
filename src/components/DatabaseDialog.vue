<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar fixed class="main-bg no-text-highlight">
        <v-btn dark class="z-index-5" icon @click="cancel()" :disabled="isSaving">
          <v-icon>close</v-icon>
        </v-btn>

        <div class="toolbar-title hidden-xs-only">
          Datenbank {{ dbID ? 'bearbeiten' : 'anlegen'}}
        </div>

        <v-spacer/>

        <v-toolbar-items class="z-index-5">
          <v-btn flat @click="save()" dark :disabled="isSaving">{{ isSaving ? 'Wird gespeichert...' : 'Speichern' }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container>
          <h1 class="mb-2 hidden-sm-and-up">
            Datenbank {{ dbID ? 'bearbeiten' : 'anlegen'}}
          </h1>
          <v-form ref="form" @submit.prevent="save">
            <p class="error-text mt-2" v-if="error">
              Es ist ein Fehler aufgetreten: <br>
              <b>{{ error }}</b>
            </p>

            <h2 v-if="dbID">Datenbank-Name: {{ db.id }}</h2>
            <v-text-field v-model="db.id" label="Datenbank Name" required :rules="required" v-else/>

            <v-text-field textarea label="SQL-Statement" v-model="db.sql" required :rules="required" :rows="rows"/>

            <p class="error-text mt-2" v-if="error">
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
      default: undefined
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialog: false,
      error: undefined,
      isSaving: false,
      db: {
        id: '',
        sql: ''
      },
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
    await this.loadDB()
  },

  methods: {
    async loadDB() {
      if (this.dbID) {
        const response = await fetch(`/api/databases/${this.dbID}`)

        if (!response.ok) {
          alert(response.statusText)
          return
        }

        this.db = await response.json()
      }
    },

    async save() {
      const valid = await this.$refs.form.validate()
      if (valid) {
        this.isSaving = true
        const response = await fetch(`/api/databases/${this.db.id}`, {
          method: 'PUT',
          headers: {'x-config-token': global.configToken},
          body: JSON.stringify({sql: this.db.sql})
        })
        const result = await response.json()
        this.error = result.error ? result.error : response.ok ? undefined : response.statusText
        this.isSaving = false
        if (!this.error) this.close()
      }
    },

    async cancel() {
      // closes the dialog and reload the db
      this.$refs.form.reset()
      this.close()
      this.db = {
        id: '',
        sql: ''
      }
      await this.loadDB()
    },

    close() {
      this.$emit('refresh')
      this.error = undefined
      this.dialog = false
    }
  }
}
</script>
