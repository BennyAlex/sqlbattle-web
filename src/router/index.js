import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/routes/Main'
import Quiz from '@/routes/Quiz'
import Config from '@/routes/Config'
import PageNotFound from '@/routes/PageNotFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/quizzes/:quizID',
      props: true,
      name: 'Quiz',
      component: Quiz
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
