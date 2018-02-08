<template>
  <v-container fluid grid-list-md>
    <v-container v-if="loading">
      Daten werden geladen, bitte warten...
    </v-container>
    <template v-else>
      <div>Datenbanken:</div>
      <v-layout row wrap>
        <v-flex xs12 md6 lg4 v-for="db in databases" :key="db.id">
          <!-- <v-card flat tile :to="{name: 'Quiz', params: { quizID: quiz.id}}" class="quiz-card"> -->
          <v-card flat tile :to="{name: 'ConfigDB', params: { dbID: db.id}}" class="config-card">
            <v-card-text>{{ db.id }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <div>Quizzes:</div>
      <v-layout row wrap>
        <v-flex xs12 md6 lg4 v-for="quiz in quizzes" :key="quiz.id">
          <v-card flat tile class="config-card" :to="{ name: 'ConfigQuizzes', params: { id: quiz.id } }">
            <v-card-text>{{ quiz.name }}</v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn fab dark color="pink" @click="createDB" fixed bottom left>
                <v-icon dark>create</v-icon>
              </v-btn>
              <v-btn fab dark color="pink" @click="createQuiz" fixed bottom right>
                <v-icon dark>create</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
  export default {
    name: 'Config',
    data() {
      return {
        loading: true,
        databases: [],
        quizzes: []
      }
    },
    async mounted () {
      this.loading = true
      this.databases = await this.getDatabases()
      this.quizzes = await this.getQuizzes()
      this.loading = false
    },
    methods: {
      async getQuizzes() {
        const quizzes = await fetch('/api/quizzes')
        const temp = await quizzes.json()
        return temp.quizzes
      },
      async getDatabases() {
        const databases = await fetch('/api/databases')
        const temp = await databases.json()
        return temp.databases
      },
      async createDB() {
        const name = prompt('Enter DB Title')

        const result = await fetch(`/api/databases/${name}`, {
          method: 'PUT',
          body: JSON.stringify({sql: ''})
        })

        const {error} = await result.json()
        if (error) {
          alert(error)
        } else {
          alert('Create successful')
        }
      },
      createQuiz() {
        const id = prompt('Enter Quiz Id')
        this.$router.push({name: 'ConfigQuizzes', params: {id, newQuiz: true}})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .config-card {
    color: rgb(0, 0, 0) !important;
    text-align: center;
    /* background: linear-gradient(22deg, rgb(64, 0, 94), rgb(0, 255, 221)); */
    background: linear-gradient(43deg, #3cff00, #3cff00);
    margin: 0 10px;
    border: 1px solid black;
    border-radius: 5px;
  }

  .config-card div {
    height: 200px !important;
  }

  .config-card {
    font-size: 1.75em;
  }

  .config-card:hover div {
    background: rgba(0, 0, 0, 0.22);
    color: rgb(255, 255, 255) !important;
  }
</style>
