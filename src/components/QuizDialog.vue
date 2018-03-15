<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar fixed class="main-bg no-text-highlight">
        <v-btn dark icon class="z-index-5" @click="close()" :disabled="isSaving">
          <v-icon>close</v-icon>
        </v-btn>

        <div class="toolbar-title" v-if="$vuetify.breakpoint.smAndUp">
          Quiz {{quizID ? 'bearbeiten' : 'anlegen'}}
        </div>

        <v-spacer/>

        <v-toolbar-items class="z-index-5">
          <v-btn flat @click="save()" dark :disabled="isSaving">{{ isSaving ? 'Wird gespeichert...' : 'Speichern' }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container>
          <h1 v-if="$vuetify.breakpoint.xsOnly">
            Quiz {{quizID ? 'bearbeiten' : 'anlegen'}}
          </h1>
          <v-form ref="form">
            <p class="error-text mt-2" v-if="error">
              Es ist ein Fehler aufgetreten: <br>
              <b>{{ error }}</b>
            </p>

            <v-text-field label="Name" v-model="name" required :rules="required"/>

            <v-select
              :items="databases"
              v-model="db"
              label="Datenbank"
              item-text="id"
              item-value="id"
              bottom
              required
              :rules="required"
            />

            <h2 class="mt-2 pb-0">Fragen:</h2>

            <div class="px-3">
              <!-- TODO: Add Cards -->
              <div v-for="(q, i) in questions" :key="i">
                <v-layout align-center row wrap class="ma-0 pa-0 mt-3">
                  <h3>Frage #{{ i + 1 }}:</h3>
                  <v-spacer/>
                  <v-btn
                    small
                    round
                    outline
                    color="primary"
                    v-if="questions.length > 1"
                    @click="removeQuestion(i)"
                  >
                    Frage löschen
                  </v-btn>
                </v-layout>

                <div class="px-3">
                  <v-text-field label="Frage" v-model.trim="q.question" required :rules="required"/>
                  <v-text-field label="Mögliche Antwort (SQL)" v-model="q.answer" required :rules="required"/>
                  <v-text-field label="Hinweis" v-model.trim="q.help"/>
                </div>
              </div>

              <div class="text-xs-center mt-2">
                <v-btn round @click="addQuestion" color="primary">Weitere Frage hinzufügen</v-btn>
              </div>
            </div>

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
  name: 'QuizDialog',
  props: {
    quizID: {
      type: [Number, String],
      default: null
    },
    databases: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      error: null,
      id: null,
      name: '',
      db: '',
      isSaving: false,
      questions: [{
        question: '',
        answer: '',
        help: undefined
      }],
      required: [
        v => !!v || 'Dies ist ein Pflichtfeld'
      ]
    }
  },
  async mounted() {
    if (this.quizID) {
      const response = await fetch(`/api/quizzes/${this.quizID}`)
      if (!response.ok) {
        alert(response.statusText)
        return
      }
      const quiz = await response.json()
      this.id = quiz.id
      this.name = quiz.name
      this.questions = quiz.questions
      this.db = quiz.db
    }
  },
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.isSaving = true

        this.questions.forEach(q => {
          if(q.help === '') q.help = undefined
        })

        const response = await fetch(`/api/quizzes/${this.id || this.name.toLowerCase() }`, {
          method: 'PUT',
          headers: {'x-config-token': global.configToken},
          body: JSON.stringify({
            name: this.name,
            db: this.db,
            questions: this.questions.map(({question, answer, help}) => ({question, answer, help}))
          })
        })

        const result = await response.json()
        this.error = result.error ? result.error : response.ok ? null : response.statusText
        this.isSaving = false
        if (!this.error) this.close()
      }
    },
    addQuestion() {
      this.questions.push({
        answer: '',
        question: '',
        help: undefined
      })
    },
    removeQuestion(i) {
      this.questions.splice(i, 1)
    },
    close() {
      this.$emit('refresh')
      this.error = null
      this.dialog = false
      if (!this.quizID) this.$refs.form.reset() // empty fields because the quiz wasn't saved
    }
  }
}
</script>
