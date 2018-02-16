<template>
  <loading v-if="loading"/>
  <v-container grid-list-xl v-else>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-card>
          <v-card-text>
            <v-layout row space-between align-center>
              <v-flex><h2>Datenbanken:</h2></v-flex>
              <!--
              TODO: Allow post for database
              <database-dialog>
                <v-btn flat outline round small color="primary">Datenbank anlegen
                  <v-icon small>add</v-icon>
                </v-btn>
              </database-dialog>
              -->
            </v-layout>
            <v-list>
              <template v-for="(db, index) in databases">
                <v-divider v-if="index !== 0" :key="db.id"/>
                <v-list-tile :key="db.id">
                  <v-list-tile-content>
                    <v-list-tile-title v-text="' - ' + db.id"/>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <database-edit-dialog :database="Object.assign({}, db)" @refresh="loadData()">
                      <v-btn icon>
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </database-edit-dialog>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <database-delete-dialog :dbID="db.id" @refresh="loadData()">
                      <v-btn icon>
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </database-delete-dialog>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card>
          <v-card-text>
            <v-layout row space-between align-center>
              <v-flex><h2>Quizze:</h2></v-flex>
              <quiz-dialog>
                <v-btn flat outline round small color="primary">Quiz anlegen
                  <v-icon small>add</v-icon>
                </v-btn>
              </quiz-dialog>
            </v-layout>
            <v-list>
              <template v-for="(quiz, index) in quizzes">
                <v-divider v-if="index !== 0" :key="quiz.id"/>
                <v-list-tile :key="quiz.id">
                  <v-list-tile-content>
                    <v-list-tile-title v-text="' - ' + quiz.name"/>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon @click="editQuiz(quiz)">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Loading from '@/components/Loading'
import QuizDialog from '@/components/QuizDialog'
import DatabaseEditDialog from '@/components/DatabaseEditDialog'
import DatabaseDeleteDialog from '@/components/DatabaseDeleteDialog'

export default {
  components: {
    DatabaseEditDialog,
    DatabaseDeleteDialog,
    QuizDialog,
    Loading
  },
  name: 'Config',
  data () {
    return {
      loading: true,
      error: null,
      deleteDbDialog: false,
      databases: [],
      quizzes: []
    }
  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      this.loading = true
      this.databases = await this.getDatabases()
      this.quizzes = await this.getQuizzes()
      this.loading = false
    },
    async getQuizzes () {
      const quizzes = await fetch('/api/quizzes')
      const temp = await quizzes.json()
      return temp.quizzes
    },
    async getDatabases () {
      const databases = await fetch('/api/databases')
      const temp = await databases.json()
      // TODO: get database.sql
      return temp.databases
    },
    async createDB () {
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
    createQuiz () {
      const id = prompt('Enter Quiz Id')
      this.$router.push({name: 'ConfigQuizzes', params: {id, newQuiz: true}})
    },
    editDb (db) {}
  }
}
</script>

<style scoped>
  .list__tile__title {
    font-size: 17px;
  }

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
