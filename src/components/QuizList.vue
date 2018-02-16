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
const colorPairs = [
  ['#3678da', '#ef8d0f'],
  ['#23c7da', '#ef5d24'],
  ['#9002ec', '#01dddc'],
  ['#2685da', '#ef78af'],
  ['#01d2d1', '#ec2bde'],
  ['#2369d6', '#2cdfa3'],
  ['#2c68c0', '#01e3e2']
]

const len = colorPairs.length - 1

export default {
  name: 'QuizList',
  props: {
    quizzes: {
      type: Array,
      required: true
    }
  },
  methods: {
    getBackground () {
      const angle = Math.round(Math.random() * 360)
      const pair = colorPairs[Math.round(Math.random() * len)]
      return `linear-gradient(${angle}deg, ${pair[0]}, ${pair[1]})`
    }
  }
}
</script>
