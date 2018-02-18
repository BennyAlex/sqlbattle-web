<template>
  <div style="overflow: auto">
    <table class="mx-auto text-xs-center">
      <thead>
      <tr>
        <th v-for="(field, index) in fields" :key="index" class="main-bg">
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
  </div>
</template>

<script>
export default {
  name: 'SqlTable',
  props: {
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    rows: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
  table {
    border-spacing: 0;
  }

  th, td {
    padding: 11px 14px;
  }

  th {
    font-weight: bold;
    color: white;
  }

  tr td:first-child {
    border-left: 1px solid #1769aa;
  }

  tr td:last-child {
    border-right: 1px solid #1769aa;
  }

  tr:last-child td {
    border-bottom: 1px solid #1769aa;
  }

  tr:nth-child(even) {
    background: rgb(209, 209, 209);
  }
</style>
