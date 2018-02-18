<template>
  <v-container grid-list-xl>
    <h1>Quiz Auswählen:</h1>
    <loading v-if="loading"/>
    <quiz-list :quizzes="quizzes" v-else/>
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
  data() {
    return {
      loading: true,
      quizzes: []
    }
  },
  async mounted() {
    this.loading = true
    this.quizzes = await this.getQuizzes()
    this.loading = false
  },
  methods: {
    async getQuizzes() {
      const response = await fetch('/api/quizzes')
      if (!response.ok) {
        alert(response.statusText)
        return
      }
      const res = await response.json()
      return res.quizzes
    }
  }
}
</script>
