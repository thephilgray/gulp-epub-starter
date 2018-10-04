<template lang="pug">
  .game
    Menu(v-if="!isPlaying" @onStartGame="onStartGame")
    GameBoard(v-else)
      Card(v-for="card in cards" :match="card.match" :value="card.value"  @addToSeeking="onAddToSeeking" @removeFromSeeking="onRemoveFromSeeking" :key="card.value" :seeking="seeking")
</template>
<script>
import Menu from "./Menu.vue";
import GameBoard from "./GameBoard.vue";
import Card from "./Card.vue";
export default {
  components: {
    Menu,
    GameBoard,
    Card
  },
  data() {
    return {
      isPlaying: false,
      cards: [
        { value: "a", match: "apple" },
        { value: "apple", match: "a" },
        { value: "bee", match: "b" },
        { value: "b", match: "bee" },
        { value: "c", match: "cat" },
        { value: "cat", match: "c" }
      ],
      seeking: []
    };
  },
  methods: {
    onStartGame() {
      this.isPlaying = true;
    },

    onAddToSeeking(val) {
      const card = this.cards.filter(c => c.value === val);
      this.seeking = [...this.seeking, ...card];
    },
    onRemoveFromSeeking(val) {
      this.seeking = this.seeking.filter(c => c.value !== val);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
