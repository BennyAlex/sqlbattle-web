<template>
  <v-container fluid id="game" v-if="quiz">
    <v-snackbar
      auto-height
      bottom
      :timeout="0"
      v-model="correct"
      color="green accent-4"
      id="correct"
    >
      Gut gemacht! Auf zur nächsten Frage :)
    </v-snackbar>

    <v-layout row wrap align-center v-if="!quizFinished">
      <v-flex xs12 lg7>
        <h4>{{ quiz.name }}</h4>
        <h3>Frage {{ questionIndex + 1 }} von {{ quiz.questions.length }}:</h3>
        <h2>{{ quiz.questions[questionIndex].question }}</h2>
      </v-flex>

      <v-flex xs12 lg5 class="text-xs-center text-lg-right">
        <v-btn round color="primary" @click="nextQuestion()" v-if="correct">
          Nächste Frage!
        </v-btn>
        <template v-else>
          <v-btn outline round @click="skipQuestion()" :disabled="loading">
            Frage überspringen
          </v-btn>
          <v-btn outline round @click="showAnswer" :disabled="loading">
            Lösung anzeigen
          </v-btn>
          <v-btn round color="primary" @click="run" :disabled="loading || !statement">
            ausführen
            <v-icon>play_arrow</v-icon>
          </v-btn>
        </template>

      </v-flex>

      <v-flex xs12 md10 lg8 offset-md1 offset-lg2>
        <v-text-field
          label="SQL Statement"
          textarea
          rows="10"
          v-model="statement"
        />
      </v-flex>

      <v-flex xs12 v-if="error">
        <p id="error" class="error-text">
          Das war leider falsch! <br>
          Grund: {{ error }}
        </p>
      </v-flex>

      <v-flex xs12 v-if="loading">
        <loading text="SQL-Abfrage wird verarbeitet, bitte warten..."/>
      </v-flex>

      <v-flex xs12 lxl6 v-else-if="result">
        <sql-table :fields="result.fields" :rows="result.rows"/>
      </v-flex>

      <div id="next-btn">
        <v-btn round color="primary" class="mt-5" @click="nextQuestion()" v-if="correct">
          Nächste Frage!
        </v-btn>
      </div>
    </v-layout>

    <v-container class="text-xs-center" v-else>
      <h1>Gut gemacht!<br>Du hast "{{ quiz.name }}" erfolgreich abgeschlossen!</h1>
      <h2>Benötigte Zeit: {{ msToTime(endTime - startTime) }}</h2>
      <h2>Fragen richtig beantwortet: {{solvedQuestions}} von {{ questionIndex + 1 }}</h2>
      <v-btn class="mt-4" :to="{name: 'Main'}" color="primary" round>Zurück zum Menü</v-btn>
    </v-container>
  </v-container>
  <loading v-else/>
</template>
<script>
import SqlTable from '@/components/SqlTable'
import Loading from '@/components/Loading'

export default {
  name: 'Quiz',

  components: {
    Loading,
    SqlTable
  },

  props: {
    quizID: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      quiz: null,
      solvedQuestions: 0,
      questionIndex: 0,
      statement: '',
      loading: false,
      quizFinished: false,
      startTime: Date.now(),
      endTime: null,
      hintUsed: false,
      error: null,
      result: null,
      correct: false
    }
  },

  async mounted() {
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

  methods: {
    async run() {
      if (this.loading) return

      this.loading = true
      this.error = null

      const response = await fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify({
          db: this.quiz.db,
          sql: this.statement,
          answer: this.quiz.questions[this.questionIndex].answer
        })
      })

      const result = await response.json()
      this.error = response.ok ? result.error : response.statusText
      this.result = result.result
      this.correct = result.correct
      this.loading = false
    },

    showAnswer() {
      this.hintUsed = true
      this.statement = this.quiz.questions[this.questionIndex].answer
    },

    skipQuestion() {
      this.hintUsed = true
      this.nextQuestion()
    },

    nextQuestion() {
      if (!this.hintUsed) this.solvedQuestions++
      else this.hintUsed = false
      if (this.questionIndex < this.quiz.questions.length - 1) {
        this.questionIndex++
        this.statement = ''
      } else {
        this.quizFinished = true
        this.endTime = Date.now()
      }
      this.correct = false
      this.result = null
    },

    onKeydown(e) {
      if (!e.ctrlKey && !e.metaKey) {
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

<style>
  #correct {
    color: black;
    font-weight: bold;
    font-size: 19px;
  }

  #error {
    font-size: 19px !important;
    font-weight: bold;
  }

  #game {
    padding: 20px 16px;
  }

  #next-btn {
    width: 100%;
    text-align: center;
    margin-bottom: 62px;
  }

  @media only screen and (min-width: 600px) {
    #game {
      padding: 20px 26px;
    }

    #correct {
      font-size: 20px;
      margin-bottom: 60px;
    }

    #next-btn {
      width: 100%;
      text-align: center;
      margin-bottom: 98px;
    }
  }

  @media only screen and (min-width: 960px) {
    #game {
      padding: 22px 40px;
    }

    #correct {
      font-size: 21px;
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
