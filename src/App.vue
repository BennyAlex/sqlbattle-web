<template>
  <v-app light>
    <v-toolbar app fixed class="no-text-highlight main-bg">
      <v-btn exact flat icon dark class="z-index-5" :to="{name: 'Main'}" v-show="$route.name === 'Quiz' || $route.name === 'Config'">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-btn exact flat icon dark class="z-index-5" :to="{name: 'Config'}" v-show="$route.name === 'Main'">
        <v-icon>settings</v-icon>
      </v-btn>

      <div class="app-title">
        <router-link :to="{name: 'Main'}" class="color-inherit">SQL-Battle</router-link>
      </div>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer app class="main-bg">
      <v-spacer/>
      <div class="mr-3">&copy; 2017 - {{ new Date().getFullYear() }} by Julian, Maxi & Benny</div>
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
    font-size: 17px !important;
    color: red;
    margin: 20px;
    text-align: center;
  }

  .main-bg {
    background: #18639c !important;
    background-color: #18639c !important;
    color: white !important;
  }

  .app-title {
    color: white;
    text-decoration: none;
    z-index: 0;
    letter-spacing: 2px;
    font-weight: 500;
    font-size: 22px;
    width: 100% !important;
    text-align: center;
    position: fixed;
  }

  .color-inherit {
    color: inherit !important;
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

  .cursor-pointer, a, .btn, button, .btn__content, .app-title a {
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
</style>
