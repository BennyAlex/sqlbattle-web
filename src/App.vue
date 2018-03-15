<template>
  <v-app light>
    <v-toolbar app fixed class="no-text-highlight main-bg">
      <v-btn exact flat icon dark class="z-index-5" :to="{name: 'Main'}" v-show="$route.name === 'Quiz' || $route.name === 'Config' || $route.name === 'Login'">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-btn exact flat icon dark class="z-index-5" :to="{name: 'Config'}" v-show="$route.name === 'Main'">
        <v-icon>settings</v-icon>
      </v-btn>

      <div class="toolbar-title">
        <router-link :to="{name: 'Main'}" style="color: #fff">SQL-Battle</router-link>
      </div>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer app class="main-bg px-3 py-2" height="auto">
      <v-layout row wrap align-center>
        <v-flex xs12 sm6>
          <div class="text-xs-center text-sm-left" id="school">&copy; 2017 - {{ new Date().getFullYear() }} Klara-Oppenheimer-Schule</div>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="text-xs-center text-sm-right" id="creators">Created by Julian L., Maxi R. & Benny F.</div>
        </v-flex>
      </v-layout>  
    </v-footer>
  </v-app>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
  html {
    overflow-y: auto;
  }

  #app {
    background: #eeeeee
  }

  p {
    font-size: 15px;
  }

  a {
    text-decoration: none;
  }

  .error-text {
    font-size: 18px !important;
    font-weight: bold;
    color: red;
    text-align: center;
  }

  .main-bg {
    background: #18639c !important;
    background-color: #18639c !important;
    color: white !important;
  }

  .toolbar-title {
    color: white !important;
    text-decoration: none;
    z-index: 0;
    letter-spacing: 2px;
    font-weight: 500;
    font-size: 22px;
    font-weight: 900;
    width: 100% !important;
    text-align: center;
    position: fixed;
  }

  #school {
    font-weight: bold;
    font-size: 1.125em;
  }

  #creators {
    font-size: 0.9em
  }

  .no-text-highlight, .input-group--select, .input-group--selections {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -ms-user-select: none;
    -moz-user-select: none;
    user-select: none;
    outline-style: none;
    cursor: default;
  }

  .cursor-pointer, a, .btn, button, .btn__content, .toolbar-title a {
    cursor: pointer !important
  }

  .z-index-5 {
    z-index: 5;
  }

  .total-center {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
    text-align: center;
    flex-wrap: wrap;
  }

  nav, footer {
    /* fix for codemirror */
    z-index: 100 !important;
  }

  @media only screen and (max-width: 599px) {
    #school {
      font-size: 1.075em;
    }
  }
</style>
