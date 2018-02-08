<template>
  <div style="height: 100%">
    <h2>{{ dbID }}</h2>
    <div id="divBody">
      <div id="divInput">
        <v-text-field
          name="textareaStatement"
          label="Header"
          textarea
          v-model="sql"
          id="textareaStatement"
        />
      </div>
      <v-btn @click="save">Aktualisieren</v-btn>
      <v-btn @click="deletee">Löschen</v-btn>
    </div>
  </div>
</template>
<script>
  import SqlTable from '@/components/SqlTable'

  export default {
    name: 'ConfigDB',
    components: {
      SqlTable
    },
    props: {
      dbID: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        sql: String
      }
    },
    async created() {
      const res = await fetch(`/api/databases/${this.dbID}`)
      this.sql = (await res.json()).sql
    },
    methods: {
      async save() {
        const result = await fetch(`/api/databases/${this.dbID}`, {
          method: 'PUT',
          body: JSON.stringify({sql: this.sql})
        })

        const {error} = await result.json()
        if (error) {
          alert(error)
        } else {
          alert('Update successful')
        }
      },
      async deletee() {
        const result = await fetch(`/api/databases/${this.dbID}`, {
          method: 'DELETE'
        })
        const {error} = await result.json()
        if (error) {
          alert(error)
        } else {
          this.$router.push('/config')
        }
      }
    }
  }
</script>

<style>
  #textareaStatement {
    resize: none;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    font-family: monospace;
    width: 100%;
    height: 330px;
    overflow: auto;
    display: block;
    font-size: inherit;
  }

  #divInput {
    width: 100%;
    height: 50%;
    overflow: auto;
    position: absolute;
  }

  #divBody {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
