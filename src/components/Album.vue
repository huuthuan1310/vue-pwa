<template>
  <main>
    <agile :arrows="false" :autoplay="true" :fade="true" :dots="false">
      <div class="slide slide--1"></div>
      <div class="slide slide--2"></div>
      <div class="slide slide--3"></div>
    </agile>
  </main>
</template>
<script>
  export default {
    name: 'album'
  }
</script>
<style lang="scss">
  .slide {
    background: {
      position: center;
      size: cover;
    }
    height: 500px;
    &:before {
        background-color: rgba(#000, .2);
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    &--1 {
      background-image: url(https://lukaszflorczak.github.io/vue-agile/static/img/bg-07.3a19e81.jpg);
    }

    &--2 {
      background-image: url(https://lukaszflorczak.github.io/vue-agile/static/img/bg-08.c43e689.jpg);
    }

    &--3 {
      background-image: url(https://lukaszflorczak.github.io/vue-agile/static/img/bg-09.e55cb0a.jpg);
    }
  }
</style>


