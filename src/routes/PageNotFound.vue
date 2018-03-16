<template>
  <div id="error-page">
    <img src="https://static.tutsplus.com/assets/sad-computer-128aac0432b34e270a8d528fb9e3970b.gif" alt="Sad computer">
    <h1>Error 404: Page Not Found</h1>
    <h2>The page you are looking for could not be found.</h2>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound'
}
</script>

<style scoped>
#error-page {
    font: normal 16px/26px;
    margin: 120px 16px 60px;
    text-align: center;
}

img {
    width: 112px;
    margin-bottom: 28px
}
</style>