import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/routes/Main'
import Quiz from '@/routes/Quiz'
import Config from '@/routes/Config'
import PageNotFound from '@/routes/PageNotFound'
import Login from '@/routes/Login'

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
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/config',
      name: 'Config',
      component: Config,
      beforeEnter: (to, from, next) => {
        const pw = global.configToken
        next()
      }
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
