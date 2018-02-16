<template>
  <loading v-if="loading"/>
  <v-container grid-list-xl v-else>
    <h1>Quiz Auswählen</h1>
    <quiz-list :quizzes="quizzes"/>
  </v-container>
</template>

<script>
import Loading from '@/components/Loading'
import QuizList from '@/components/QuizList'

export default {
  components: {
    QuizList,
    Loading
  },
  data () {
    return {
      loading: true,
      quizzes: []
    }
  },
  async mounted () {
    this.loading = true
    this.quizzes = await this.getQuizzes()
    this.loading = false
  },
  methods: {
    async getQuizzes () {
      const quizzes = await fetch('/api/quizzes')
      const temp = await quizzes.json()
      return temp.quizzes
    }
  }
}
</script>

<style scoped>
</style>
