<template>
  <div v-if="!quizFinished">
    <div v-if="quiz" style="height: 100vh">
      <h4>{{ quiz.name }}</h4>
      <h2>Frage {{ questionIndex + 1 }} / {{ quiz.questions.length }}: {{ quiz.questions[questionIndex].question }}</h2>
      <div id="divBody">
        <div id="divInput">
          <v-text-field
            name="textareaStatement"
            label="SQL Statement"
            textarea
            v-model="statement"
            id="textareaStatement"
          />
        </div>
        <div v-if="sqlResult" id="divOutput">
          <sql-table :fields="sqlResult.fields" :rows="sqlResult.rows"/>
        </div>
        <v-container>
          <v-layout justify-center>
            <v-flex xs8>
              <v-card>
                <v-card-text>
                  <v-pagination :length="quiz.questions.length" v-model="page" @input="pageSelected"/>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <div>
          <v-btn fab dark color="pink" @click="run" fixed bottom right>
            <v-icon dark>play_arrow</v-icon>
          </v-btn>
          <v-speed-dial
            fixed
            bottom
            left
            direction="right"
            transition="scale-transition"
          >
            <v-btn slot="activator" color="pink" dark fab hover>
              <v-icon>more_horiz</v-icon>
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn fab dark small color="pink" @click="showAnswer">
              <v-icon dark>lightbulb_outline</v-icon>
            </v-btn>
            <v-btn fab dark small color="pink" @click="goToPreviousQuestion" v-show="questionIndex > 0">
              <v-icon dark>skip_previous</v-icon>
            </v-btn>
            <v-btn fab dark small color="pink" @click="goToNextQuestion">
              <v-icon dark>skip_next</v-icon>
            </v-btn>
          </v-speed-dial>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div>
      <h1 align="center">Gut gemacht!<br>Du hast "{{ quiz.name }}" erfolgreich abgeschlossen!</h1>
      <h2 align="center">Benötigte Zeit: { {msToTime(endTime - startTime) }}</h2>
      <h2 align="center">Fragen gelöst: {{ questionIndex + 1 }}</h2>
      <v-btn @click="backToMenu">Zurück zum Menü</v-btn>
    </div>
  </div>
</template>
<script>
  import SqlTable from '@/components/SqlTable'

  export default {
    name: 'Quiz',
    components: {
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
        page: 0,
        code: 'const noop = () => {}',
        quiz: undefined,
        questionIndex: 0,
        statement: '',
        result: undefined,
        canRunStatement: true,

        quizFinished: false,
        startTime: Date.now(),
        endTime: undefined,

        sqlResult: undefined
      }
    },
    async mounted() {
      const quiz = await fetch(`/api/quizzes/${this.quizID}`)
      this.quiz = await quiz.json()
      this.page = this.questionIndex + 1
      document.addEventListener('keydown', this.onKeydown)
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.onKeydown)
    },
    methods: {
      async run() {
        if (!this.canRunStatement) return

        this.canRunStatement = false
        const result = await fetch('/api/query', {
          method: 'POST',
          body: JSON.stringify({
            db: this.quiz.db,
            sql: this.statement,
            answer: this.quiz.questions[this.questionIndex].answer
          })
        })

        this.result = await result.json()

        if (this.result.error) alert(this.result.error)
        else {
          this.sqlResult = this.result.result[0]
          if (this.result.correct) {
            setTimeout(() => alert('Well done! Solve the next Question!'), 0)
            this.statement = ''
            this.goToNextQuestion()
          }
        }
        this.canRunStatement = true
      },
      showAnswer() {
        alert(this.quiz.questions[this.questionIndex].answer)
      },
      goToNextQuestion() {
        if (this.questionIndex < this.quiz.questions.length - 1) {
          this.questionIndex++
          this.page++
        } else {
          alert('Congratulations! Quiz finished!')
          this.quizFinished = true
          this.endTime = Date.now()
        }
      },
      goToPreviousQuestion() {
        if (this.questionIndex > 0) {
          this.questionIndex--
        }
      },
      onKeydown(e) {
        if (!e.ctrlKey && !e.metaKey) {
          return
        }
        if (e.key === 'Enter') {
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
      },
      backToMenu() {
        this.$router.replace('/')
      },
      pageSelected(value) {
        this.questionIndex = value - 1
        this.page = value
      }
    }
  }
</script>

<style>
  #textareaStatement {
    resize: none;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    font-family: monospace;
    width: 100%;
    height: 330px;
    overflow: auto;
    display: block;
    font-size: inherit;
  }

  #divInput {
    width: 100%;
    height: 50%;
    overflow: auto;
    position: absolute;
  }

  #divOutput {
    width: 100%;
    height: 50%;
    overflow: auto;
    position: absolute;
    bottom: 0;
  }

  #divBody {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
