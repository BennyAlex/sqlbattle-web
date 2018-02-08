<template>
  <v-app :dark="isDark" :light="!isDark">
    <v-toolbar app class="elevation-4">
      <v-btn icon v-show="$route.name !== 'Main'" @click="$router.go('-1')" absolute>
        <v-icon dark>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title style="width: 100%" class="text-xs-center">
        <router-link to="/">SQL-Battle</router-link>
      </v-toolbar-title>
      <v-btn icon @click="changeBrightness()">
        <v-icon>brightness_{{ isDark ? 'low' : '2' }}</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
    <v-footer app>
      <v-spacer/>
      <div class="mr-3">&copy; {{ new Date().getFullYear() }} by Julian & Maxi & Benny</div>
    </v-footer>
  </v-app>
</template>
<script>
  import Vue from 'vue'

  export default {
    name: 'App',
    computed: {
      isDark() {
        console.log('computed updated')
        return window && window['SqlBattle'] && window['SqlBattle']['isDark']
      }
    },
    beforeCreate() {
      this.$nextTick(function () {
        Vue.set('window.SqlBattle', {
          isDark: true
        })
      })
    },
    methods: {
      changeBrightness() {
        console.log('dark', window['SqlBattle']['isDark'])
        window['SqlBattle']['isDark'] = !window['SqlBattle']['isDark']
      },
      log(log) {
        debugger
      }
    }
  }
</script>
<style>
  a {
    text-decoration: none;
    color: inherit;
  }
</style>
