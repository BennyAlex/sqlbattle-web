<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar class="main-bg" fixed>
        <v-btn icon @click="close()" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>Quiz {{quizID ? 'bearbeiten' : 'anlegen'}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click="save()" dark>Speichern</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container>
          <v-form ref="form">
            <p class="error-text" v-if="error">
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
                  <v-text-field label="Frage" v-model="q.question" required :rules="required"/>
                  <v-text-field label="Mögliche Antwort" v-model="q.answer" required :rules="required"/>
                </div>
              </div>

              <div class="text-xs-center mt-2">
                <v-btn round @click="addQuestion" color="primary">Weitere Frage hinzufügen</v-btn>
              </div>
            </div>

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
      questions: [{
        question: '',
        answer: ''
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
        const response = await fetch(`/api/quizzes/${this.id || this.name.toLowerCase() }`, {
          method: 'PUT',
          body: JSON.stringify({
            name: this.name,
            db: this.db,
            questions: this.questions.map(({question, answer}) => ({question, answer}))
          })
        })

        if (!response.ok) {
          alert(response.statusText)
          return
        }

        const {error} = await response.json()
        if (error) this.error = error
        else this.close()
      }
    },
    addQuestion() {
      this.questions.push({
        answer: '',
        question: ''
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
