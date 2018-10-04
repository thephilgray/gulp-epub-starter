<template lang="pug">
    .gameBoard
        .grid
            slot
        .info
            h2 Attempts: {{attempts}}
</template>

<script>
export default {
  props: ["attempts"]
};
</script>

<style lang="scss" scoped>
.gameBoard {
  width: 100%;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 120px;
  width: 100%;
}
.info {
  text-align: center;
}
</style>
