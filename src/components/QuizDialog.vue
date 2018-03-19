<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar fixed class="main-bg no-text-highlight">
        <v-btn dark icon class="z-index-5" @click="cancel()" :disabled="isSaving">
          <v-icon>close</v-icon>
        </v-btn>

        <div class="toolbar-title hidden-xs-only">
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
          <h1 class="mb-2 hidden-sm-and-up">
            Quiz {{quizID ? 'bearbeiten' : 'anlegen'}}
          </h1>
          <v-form ref="form">
            <p class="error-text mt-2" v-if="error">
              Es ist ein Fehler aufgetreten: <br>
              <b>{{ error }}</b>
            </p>

            <v-text-field label="Name" v-model="quiz.name" required :rules="required"/>

            <v-select
              :items="databases"
              v-model="quiz.db"
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
              <div v-for="(q, i) in quiz.questions" :key="i">
                <v-layout align-center row wrap class="ma-0 pa-0 mt-3">
                  <h3>Frage #{{ i + 1 }}:</h3>
                  <v-spacer/>

                  <v-tooltip top v-if="i !== 0">
                  <v-btn
                    flat
                    icon
                    small
                    color="primary"
                    slot="activator"
                    @click="moveDown(i - 1)"
                  >
                    <v-icon>arrow_upward</v-icon>
                    </v-btn>
                    <span>Nach oben verschieben</span>
                  </v-tooltip>

                  <v-tooltip bottom v-if="i !== quiz.questions.length - 1">
                    <v-btn
                      flat
                      icon
                      small
                      color="primary"
                      slot="activator"
                      @click="moveDown(i)"
                    >
                      <v-icon>arrow_downward</v-icon>
                    </v-btn>
                    <span>Nach unten verschieben</span>
                  </v-tooltip>

                  <v-tooltip left>
                    <v-btn
                      flat
                      icon
                      small
                      color="primary"
                      slot="activator"
                      v-if="quiz.questions.length > 1"
                      @click="removeQuestion(i)"
                    >
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                    <span>Frage löschen</span>
                  </v-tooltip>
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
      default: undefined
    },
    databases: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      dialog: false,
      error: undefined,
      isSaving: false,
      quiz: {
        id: undefined,
        db: '',
        name: '',
        questions: [{
          question: '',
          answer: '',
          help: undefined
        }]
      },
      required: [
        v => !!v || 'Dies ist ein Pflichtfeld'
      ]
    }
  },

  async mounted() {
    await this.loadQuiz()
  },

  methods: {
    async loadQuiz() {
      if (this.quizID) {
        const response = await fetch(`/api/quizzes/${this.quizID}`)
        if (!response.ok) {
          alert(response.statusText)
          return
        }
        this.quiz = await response.json()
      }
    },

    async save() {
      const valid = await this.$refs.form.validate()
      if (valid) {
        this.isSaving = true

        this.quiz.questions.forEach(q => {
          if(q.help === '') q.help = undefined
        })

        const response = await fetch(`/api/quizzes/${this.quiz.id || this.quiz.name.toLowerCase() }`, {
          method: 'PUT',
          headers: {'x-config-token': global.configToken},
          body: JSON.stringify({
            name: this.quiz.name,
            db: this.quiz.db,
            questions: this.quiz.questions.map(({question, answer, help}) => ({question, answer, help}))
          })
        })

        const result = await response.json()
        this.error = result.error ? result.error : response.ok ? undefined : response.statusText
        this.isSaving = false
        if (!this.error) this.close()
      }
    },

    moveDown(index) {
      const questions = this.quiz.questions
      questions.splice(index, 2, questions[index + 1], questions[index])
    },

    addQuestion() {
      this.quiz.questions.push({
        answer: '',
        question: '',
        help: undefined
      })
    },

    removeQuestion(i) {
      this.quiz.questions.splice(i, 1)
    },

    async cancel() {
      // closes the dialog and reload the db
      this.$refs.form.reset()
      this.close()
      this.quiz = {
        id: undefined,
        db: '',
        name: '',
        questions: [{
          question: '',
          answer: '',
          help: undefined
        }]
      }
      await this.loadQuiz()
    },

    close() {
      this.$emit('refresh')
      this.error = undefined
      this.dialog = false
    }
  }
}
</script>
