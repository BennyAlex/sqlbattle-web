<template>
  <v-container fill-height class="py-0 my-0">
    <v-layout row justify-center align-center>
      <v-flex xs12 sm8 md6 xl4 style="padding-bottom: 44px">
        <v-form ref="form" @submit.prevent="login">
          <v-card>
            <v-card-title class="pb-1"><h2>Anmelden</h2></v-card-title>
            <v-card-text id="card-text">
              <v-text-field label="Passwort" v-model="password" required :rules="[(v) => !!v || 'Bitte Passwort eingeben']" type="password" @keypress.enter="login"/>
            </v-card-text>
            <p class="error-text" v-if="error">
              {{ error }}
            </p>
            <v-card-actions>
              <v-spacer/>
              <v-btn flat color="primary" type="submit">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    password: undefined,
    error: undefined
  }),
  methods: {
    async login () {
      this.error = undefined
      const valid = await this.$refs.form.validate()
      if (valid) {
        global.configToken = this.password
        const response = await fetch('/api/check-token', {
          method: 'POST',
          headers: {
            'x-config-token': global.configToken
          }
        })
        if (response.ok) {
          this.$router.push({name: 'Config'})
        }
        else if (response.status === 401) {
          // no token provided or it is invalid -> redirect to login page
          this.error = 'Das Passwort war leider falsch'
        }
        else {
          // unknown error
          this.error = 'Folgender Fehler ist aufgetreten: ' + response.statusText
        }
      }
    }
  }
}
</script>

<style scoped>
  #error {
    font-weight: bold;
    margin: 8px 0 7px;
  }

  #card-text {
    padding: 10px 32px 8px;
  }

  @media only screen and (max-width: 599px) {
    #card-text {
    padding: 10px 18px 8px;
    }
  }
</style>
