<template>
  <v-container fill-height class="py-0 my-0">
    <v-layout row justify-center align-center>
      <v-flex xs12 sm8 md6 xl4 style="padding-bottom: 44px">
        <v-form ref="form">
          <v-card>
            <v-card-text class="px-4 pt-4 pb-3">
              <v-text-field label="Passwort" v-model="password" required :rules="[(v) => !!v || 'Bitte das Passwort eingeben']" type="password" @keypress.enter="login"/>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>      
              <v-btn flat color="primary" @click="login">Login</v-btn>
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
  }),
  mounted () {},
  methods: {
    async login () {
      const valid = await this.$refs.form.validate()
      if (valid) {
        global.configToken = this.password
        this.$router.push({name: 'Config'})
      }
    }
  }
}
</script>
