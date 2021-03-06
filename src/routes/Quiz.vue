<template>
  <v-container fluid id="game" v-if="quiz">
    <v-snackbar
      auto-height
      bottom
      :timeout="0"
      v-model="showSnackbar"
      :color="snackbar.color"
      id="snackbar"
      v-if="snackbar"
    >
      {{ snackbar.text }}
      <v-btn icon @click="showSnackbar = false"><v-icon large color="black">close</v-icon></v-btn>
    </v-snackbar>

    <v-layout row wrap align-center v-if="!quizFinished">
      <v-flex xs12 lg7>
        <h4>{{ quiz.name }}</h4>
        <h3>Frage {{ questionIndex + 1 }} von {{ quiz.questions.length }}:</h3>
        <h2>{{ quiz.questions[questionIndex].question }}</h2>
      </v-flex>

      <v-flex xs12 lg5 class="text-xs-center text-lg-right my-2">
        <v-btn round color="primary" @click="nextQuestion" v-if="correct">
          Nächste Frage!
        </v-btn>
        <template v-else>
          <v-btn round color="orange darken-1" @click="skipQuestion" :disabled="loading">
            Frage überspringen
          </v-btn>
          <v-btn round color="yellow darken-1" @click="showHint" :disabled="loading" v-if="!hintUsed && quiz.questions[this.questionIndex].help">
            Hinweis anzeigen
          </v-btn>
          <v-btn round color="yellow darken-1" @click="showAnswer" :disabled="loading" v-else>
            Lösung anzeigen
          </v-btn>
          <v-btn round color="primary" @click="run" :disabled="loading || !statement">
            ausführen
            <v-icon>play_arrow</v-icon>
          </v-btn>
        </template>
      </v-flex>

      <v-flex class="mt-3" xs12 md10 lg8 offset-md1 offset-lg2>
        <h4>SQL-Statement:</h4>
        <codemirror
          id="statement"
          v-model="statement"
          class="mb-2"
          :options="codemirrorOptions"
        />
      </v-flex>

      <v-flex xs12 v-if="hintUsed">
        <p id="hint" class="error-text mt-2 mb-0">
          Hinweis: <br>
          {{ hint }}
        </p>
      </v-flex>

      <v-flex xs12 v-if="error">
        <p class="error-text mt-2 mb-0">
          Das war leider falsch! <br>
          Grund: {{ error }}
        </p>
      </v-flex>

      <v-flex xs12 v-if="loading">
        <loading text="SQL-Abfrage wird verarbeitet, bitte warten..."/>
      </v-flex>

      <v-flex xs12 v-else-if="result" class="mt-3">
        <sql-table :fields="result.fields" :rows="result.rows"/>
      </v-flex>

      <div id="next-btn" v-if="correct">
        <v-btn round color="primary" @click="nextQuestion()">
          Nächste Frage!
        </v-btn>
      </div>
    </v-layout>

    <!-- TODO: besser machen! -->
    <v-container class="text-xs-center" v-else>
      <h2>Du hast "{{ quiz.name }}" erfolgreich abgeschlossen!</h2>
      <br>
      <h2>Du hast <i>{{ Math.round(solvedQuestions / quiz.questions.length * 100) }}%</i> der Fragen richtig beantwortet.
        <br>
        Dies entspricht der IHK Note <u>{{ getGrade() }}</u>
      </h2>
      <br>
      <h3>Benötigte Zeit: {{ msToTime(endTime - startTime) }}</h3>
      <h3>Fragen richtig beantwortet: {{solvedQuestions}} von {{ questionIndex + 1 }}</h3>
      <h3>Hinweise benutzt: {{usedHints}}</h3>
      <v-btn class="mt-4 mb-3" :to="{name: 'Main'}" color="primary" round>Zurück zum Menü</v-btn>
    </v-container>
  </v-container>
  <loading v-else/>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/sql/sql.js'

import SqlTable from '@/components/SqlTable'
import Loading from '@/components/Loading'

export default {
  name: 'Quiz',

  components: {
    Loading,
    SqlTable,
    codemirror
  },

  props: {
    quizID: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      quiz: undefined,
      solvedQuestions: 0,
      questionIndex: 0,
      statement: '',
      loading: false,
      quizFinished: false,
      startTime: Date.now(),
      endTime: undefined,
      answerUsed: false,
      usedHints: 0,
      hint: undefined,
      error: undefined,
      result: undefined,
      hintUsed: false,
      correct: undefined,
      skipCorrectCounting: false,
      showSnackbar: false,
      codemirrorOptions: {
        mode: 'text/x-mariadb',
        theme: 'base16-light',
        lineNumbers: true,
        line: true,
      }
    }
  },

  async mounted () {
    const response = await fetch(`/api/quizzes/${this.quizID}`)
    if (!response.ok) {
      alert(response.statusText)
      return
    }
    this.quiz = await response.json()
    document.addEventListener('keydown', this.onKeydown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
  },

  computed: {
    rows() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 6
        case 'sm':
          return 7
        case 'md':
          return 9
        case 'lg':
          return 10
        case 'xl':
          return 11
      }
    },
    snackbar () {
      return {
        color: this.answerUsed ? 'orange' : this.correct ? 'green accent-4' : 'red darken-1',
        text: this.answerUsed ? 'Dies ist die Lösung, du kannst nun weiter zur nächsten Frage.' : this.correct ? 'Gut gemacht! Auf zur nächsten Frage :)' : 'Das war leider Falsch, versuchs nochmal :)'
      }
    }
  },

  methods: {
    async run() {
      if (this.loading) return

      this.loading = true
      this.error = undefined

      const response = await fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify({
          db: this.quiz.db,
          sql: this.statement,
          answer: this.quiz.questions[this.questionIndex].answer
        })
      })

      const result = await response.json()
      this.error = result.error ? result.error : response.ok ? undefined : response.statusText
      this.result = result.result
      this.correct = !!result.correct
      this.showSnackbar = true
      this.loading = false
    },

    getGrade() {
      // get the IHK grade
      const percentage = Math.round(this.solvedQuestions / this.quiz.questions.length * 100)
      if (percentage >= 92) return 1
      if (percentage >= 81) return 2
      if (percentage >= 67) return 3
      if (percentage >= 50) return 4
      if (percentage >= 30) return 5
      else return 6
    },

    showHint() {
      this.hintUsed = true
      this.hint = this.quiz.questions[this.questionIndex].help
    },

    showAnswer() {
      this.answerUsed = true
      this.statement = this.quiz.questions[this.questionIndex].answer
      this.run()
    },

    skipQuestion() {
      this.skipCorrectCounting = true
      this.nextQuestion()
    },

    nextQuestion() {
      this.showSnackbar = false

      if (!this.skipCorrectCounting && !this.answerUsed) {
        this.solvedQuestions++
      }

      if (this.hintUsed) {
        this.usedHints++
      }

      if (this.questionIndex < this.quiz.questions.length - 1) {
        this.questionIndex++
      } else {
        this.quizFinished = true
        this.endTime = Date.now()
      }

      this.skipCorrectCounting = false
      this.answerUsed = false
      this.statement = ''
      this.hintUsed = false
      this.correct = undefined
      this.result = undefined
    },

    onKeydown(e) {
      // check if ctrl (windows) or alt (macOS) is pressed
      if (!(e.ctrlKey || e.metaKey)) {
        return
      }
      if (e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        this.run()
      }
    },

    msToTime(duration) {
      const leftPad = i => i < 10 ? '0' + Math.floor(i) : Math.floor(i)
      const seconds = leftPad((duration / 1000) % 60)
      const minutes = leftPad((duration / (1000 * 60)) % 60)
      const hours = leftPad((duration / (1000 * 60 * 60)) % 24)
      return `${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
  #snackbar {
    color: black;
    font-weight: bold;
    font-size: 17px;
  }

  #hint {
    color: #047404 !important;
  }

  #statement {
    border: 1px solid #222;
  }

  #game {
    padding: 20px 16px;
  }

  #next-btn {
    width: 100%;
    text-align: center;
    margin: 30px 0 26px;
  }

  @media only screen and (min-width: 600px) {
    #game {
      padding: 20px 26px;
    }

    #snackbar {
      font-size: 18px;
      margin-bottom: 60px;
    }
  }

  @media only screen and (min-width: 960px) {
    #game {
      padding: 22px 40px;
    }

    #snackbar {
      font-size: 19px;
    }
  }

  @media only screen and (min-width: 1264px) {
    #game {
      padding: 22px 54px;
    }
  }

  @media only screen and (min-width: 1904px) {
    #game {
      padding: 22px 96px;
    }
  }
</style>
