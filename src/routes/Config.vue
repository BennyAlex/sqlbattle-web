<template>
  <v-container id="config" grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="card-title">
            <h1>Datenbanken:</h1>
          </v-card-title>
          <v-card-text class="card-text">
            <loading v-show="loading"/>
            <v-list v-show="!loading">
              <v-list-tile v-for="db in databases" :key="db.id" class="list-tile">
                <v-list-tile-content>
                  <v-list-tile-title class="list-title" v-text="db.id"/>
                </v-list-tile-content>
                <v-list-tile-action>
                  <database-dialog :dbID="db.id" @refresh="loadData()" :key="db.id">
                    <v-btn icon>
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </database-dialog>
                </v-list-tile-action>
                <v-list-tile-action>
                  <delete-dialog
                    :id="db.id"
                    type="databases"
                    title="Datenbank"
                    @refresh="loadData()"
                    key="delete-db"
                  >
                    <v-btn icon>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </delete-dialog>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <div class="add-btn">
              <database-dialog isNew @refresh="loadData()" key="new-db">
                <v-btn round color="primary">
                  Datenbank Hinzufügen
                </v-btn>
              </database-dialog>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md6>
        <v-card>
          <v-card-title class="card-title">
            <h1>Quizze:</h1>
          </v-card-title>
          <v-card-text class="card-text">
            <loading v-show="loading"/>
            <v-list v-show="!loading">
              <v-list-tile v-for="quiz in quizzes" :key="quiz.id" class="list-tile">
                <v-list-tile-content>
                  <v-list-tile-title class="list-title" v-text="quiz.name"/>
                </v-list-tile-content>
                <v-list-tile-action>
                  <quiz-dialog :databases="databases" :quizID="quiz.id" @refresh="loadData()">
                    <v-btn icon>
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </quiz-dialog>
                </v-list-tile-action>
                <v-list-tile-action>
                  <delete-dialog
                    :id="quiz.id"
                    :name="quiz.name"
                    type="quizzes"
                    title="Quiz"
                    @refresh="loadData()"
                    key="delete-quiz"
                  >
                    <v-btn icon>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </delete-dialog>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <div class="add-btn">
              <quiz-dialog :databases="databases" @refresh="loadData()" key="new-quiz">
                <v-btn round color="primary">
                  Quiz Hinzufügen
                </v-btn>
              </quiz-dialog>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Loading from '@/components/Loading'
import QuizDialog from '@/components/QuizDialog'
import DatabaseDialog from '@/components/DatabaseDialog'
import DeleteDialog from '@/components/DeleteDialog'

export default {
  name: 'Config',

  components: {
    DatabaseDialog,
    DeleteDialog,
    QuizDialog,
    Loading
  },

  data() {
    return {
      loading: true,
      error: null,
      databases: [],
      quizzes: []
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      this.databases = await this.getDatabases()
      this.quizzes = await this.getQuizzes()
      this.loading = false
    },

    async getQuizzes() {
      const quizzes = await fetch('/api/quizzes')
      const temp = await quizzes.json()
      return temp.quizzes
    },

    async getDatabases() {
      const databases = await fetch('/api/databases')
      const temp = await databases.json()
      return temp.databases
    }
  }
}
</script>

<style>
  #config .card-title {
    padding-bottom: 0;
    padding-top: 10px;
    margin: 0;
  }

  #config .card-text {
    margin: 0;
    padding: 0 28px;
  }

  #config .list-title {
    font-size: 18px;
  }

  #config .list-tile {
    padding: 0 12px !important;
  }

  #config li:not(:last-child) {
    border-bottom: 1px solid #b9b9b9;
  }

  #config .add-btn {
    padding-top: 4px;
    padding-bottom: 7px;
    text-align: center;
  }
</style>
