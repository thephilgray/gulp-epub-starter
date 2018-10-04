<template lang="pug">
    .gameBoard
        .grid
            slot
</template>
<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
  height: 200px;
}
</style>
