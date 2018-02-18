<template>
  <div v-if="quizzes && quizzes.length < 1">
    <h3>Keine Quizze vorhanden</h3>
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
        class="total-center no-text-highlight elevation-2"
        :style="{background: getBackground(), height: '142px'}"
      >
        <h2 class="mb-2 mt-2 white--text" style="width: 100%">{{ quiz.name }}</h2>
        <div class="mt-2 mb-2" style="width: 100%">
          <v-btn flat round outline :to="{name: 'Quiz', params: { quizID: quiz.id}}" color="white">
            Spielen
          </v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
const colors = [
  '#17c158',
  '#13b0c8',
  '#1b45da',
  '#5818b5',
  '#a318e5',
  '#f654f3',
]

const len = colors.length - 1

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
      const c1 = colors[Math.round(Math.random() * len)]
      let c2 = colors[Math.round(Math.random() * len)]
      while (c1 === c2) {
        c2 = colors[Math.round(Math.random() * len)]
      }
      return `linear-gradient(${angle}deg, ${c1}, ${c2})`
    }
  }
}
</script>
