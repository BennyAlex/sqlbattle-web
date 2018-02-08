<template>
  <div v-if="quiz">
    <v-text-field label="Name" v-model="quiz.name" required/>
    <v-text-field label="Database" v-model="quiz.db" required/>
    <div v-for="(q, i) in quiz.questions" :key="i">
      <div>#{{ i + 1 }}</div>
      <v-btn v-if="quiz.questions.length > 1" @click="removeQuestion(i)">Frage löschen</v-btn>
      <v-text-field label="Frage" v-model="q.question" required/>
      <v-text-field label="Mögliche Antwort" v-model="q.answer" required/>
    </div>
    <v-btn @click="addQuestion">Frage hinzufügen</v-btn>
    <v-btn @click="saveQuiz">Aktualisieren</v-btn>
    <v-btn @click="deleteQuiz" v-if="quiz.id">Löschen</v-btn>
  </div>
</template>
<script>
  export default {
    name: 'ConfigQuizzes',
    data() {
      return {
        quiz: undefined
      }
    },
    async created() {
      if (this.$route.params.newQuiz) {
        this.newQuiz()
      } else {
        this.loadQuiz()
      }
    },
    methods: {
      removeQuestion(i) {
        this.quiz.questions.splice(i, 1)
      },
      addQuestion() {
        this.quiz.questions.push({
          answer: '',
          question: ''
        })
      },
      newQuiz() {
        this.quiz = {
          id: undefined,
          name: '',
          db: '',
          questions: []
        }
        this.addQuestion()
      },
      async loadQuiz() {
        const response = await fetch(`/api/quizzes/${this.$route.params.id}`)
        if (!response.ok) {
          alert(response.statusText)
          return
        }
        this.quiz = await response.json()
      },
      async saveQuiz() {
        const json = {
          name: this.quiz.name,
          db: this.quiz.db,
          questions: this.quiz.questions.map(({question, answer}) => ({question, answer}))
        }
        const result = await fetch(`/api/quizzes/${this.$route.params.id}`, {
          method: 'PUT',
          body: JSON.stringify(json)
        })
        const {error} = await result.json()
        if (error) {
          alert(error)
          return
        }
        this.quiz.id = this.$route.params.id
        alert('Update successful')
      },
      async deleteQuiz() {
        const result = await fetch(`/api/quizzes/${this.quiz.id}`, {
          method: 'DELETE'
        })
        const {error} = await result.json()
        if (error) {
          alert(error)
          return
        }
        this.$router.push('/config')
      }
    }
  }
</script>
