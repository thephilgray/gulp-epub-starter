<template lang="pug">
  div
    h1(@click="reverse" :class="{'--reversed': reversed}") {{message}}
</template>
<script>
export default {
  data() {
    return {
      message: "Hello World",
      reversed: false
    };
  },
  methods: {
    reverse() {
      console.log("reversing");
      this.message = this.message
        .split("")
        .reverse()
        .join("");
      this.reversed = !this.reversed;
    }
  }
};
</script>
<style lang="scss" scoped>
h1 {
  color: white;
  background: blue;

  &:hover {
    cursor: pointer;
  }
  &.--reversed {
    text-align: right;
  }
}
</style>
