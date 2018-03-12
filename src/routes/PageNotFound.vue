<template>
    <div class="error-page">
        <header class="error-page__header">
            <img class="error-page__header-image" src="https://static.tutsplus.com/assets/sad-computer-128aac0432b34e270a8d528fb9e3970b.gif" alt="Sad computer">
            <h1 class="error-page__title nolinks">Page Not Found</h1>
        </header>
        <p class="error-page__message">The page you are looking for could not be found.</p>
    </div>
</template>

<script>

export default {
  data() {
    return {

    }
  }
}
</script>

<style>
body {
    font: normal 16px/26px;
    background: #fafafa;
    color: #2a3744;
}

.error-page {
    margin: 100px 0 40px;
    text-align: center;
}

.error-page__header-image {
    width: 112px;
}

.error-page__title {
    font-size: 31px;
}
</style>