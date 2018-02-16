<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <slot slot="activator"/>
    <v-card>
      <v-toolbar class="main-bg">
        <v-btn icon @click="dialog = false" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>Quiz {{quiz.id ? 'bearbeiten' : 'anlegen'}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click="create()" dark>Speichern</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field label="Name" v-model="quiz.name" required/>
          <v-text-field multi-line label="SQL-Statement" v-model="quiz.sql" required/>
          <p class="ma-2 red--text" style="font-size: 18px; text-align: center" v-if="error">
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
  name: 'QuizDialog',
  model: {
    prop: 'quiz' // set v-model to quiz instead of value
  },
  props: {
    quiz: {
      type: Object,
      default () {
        return {
          name: '',
          sql: ''
        }
      }
    }
  },
  data () {
    return {
      dialog: false,
      error: null
    }
  },
  methods: {
    async create () {
      const result = await fetch(`/api/quizzes/${this.quiz.name}`, {
        method: this.quiz.id ? 'PUT' : 'POST',
        body: JSON.stringify({sql: this.quiz.sql})
      })
      const {error} = await result.json()
      if (error) this.error = error
      else this.dialog = false
    }
  }
}
</script>
