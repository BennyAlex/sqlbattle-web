<template>
  <div v-if="quizzes.length < 1">
    <h2>Keine Quizze vorhanden!</h2>
  </div>
  <v-layout row wrap v-else>
    <v-flex
      xs12
      sm6
      md4
      v-for="quiz in quizzes"
      :key="quiz.id"
    >
      <div
        class="total-center no-text-highlight elevation-3"
        :style="{background: getBackground(), height: '148px'}"
      >
        <h2 class="mb-2 mt-2 white--text" style="width: 100%">{{ quiz.name }}</h2>
        <div class="mt-2 mb-2" style="width: 100%">
          <v-btn round outline :to="{name: 'Quiz', params: { quizID: quiz.id}}" color="white">
            Spielen
          </v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'QuizList',
  props: {
    quizzes: {
      type: Array,
      required: true
    }
  },
  methods: {
    getBackground() {
      const angle = Math.round(Math.random() * 360)
      return `linear-gradient(${angle}deg, #13b0c8, #1b45da)`
    }
  }
}
</script>
