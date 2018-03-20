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
      async beforeEnter(to, from, next) {
        const response = await fetch('/api/check-token', {
          method: 'POST',
          headers: {
            'x-config-token': global.configToken
          }
        })
        if (response.ok) {
          next()
        }
        else if (response.status === 401) {
          // no token provided or it is invalid -> redirect to login page
          next({path: '/login'})
        }
        else {
          // unknown error
          alert('Folgender Fehler ist aufgetreten: ' + response.statusText)
          next({path: '/'})
        }
      }
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ],
  mode: 'history'
})
