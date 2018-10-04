<template lang="pug">
    .menu
        header.menu__header
            h1.menu__title Tic Tac Toe
            button(@click="onClick") New Game
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$emit("onStartGame");
    }
  }
};
</script>
