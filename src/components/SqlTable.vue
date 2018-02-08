<template>
  <table>
    <thead>
      <tr>
        <th v-for="(field, index) in fields" :key="index">
          {{ field }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="(cell, i) in row" :key="i">
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'SqlTable',
  props: {
    fields: {
      type: Array,
      default () {
        return []
      }
    },
    rows: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  table {
    border: 1px solid black;
    border-spacing: 0;
  }

  th, td {
    padding: 11px 14px;
  }

  th {
    font-weight: bold;
    background: black;
    color: white;
  }

  tr:nth-child(odd) {
    background: rgb(199, 199, 199);
  }
</style>
