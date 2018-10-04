<template lang="pug">
    .menu
        header.menu__header
            h1.menu__title Memory Game
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
<style lang="scss" scoped>
.menu {
  text-align: center;
}
button {
  padding: 0.5em 1em;

  &:hover {
    cursor: pointer;
  }
}
</style>
