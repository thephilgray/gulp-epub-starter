<template lang="pug">
  .game
    Menu(v-if="!isPlaying" @onStartGame="onStartGame")
    GameBoard(v-else :attempts="attempts")
      Card(v-for="card in cards" :match="card.match" :value="card.value"  @addToSeeking="onAddToSeeking" @removeFromSeeking="onRemoveFromSeeking" :key="card.value" :seeking="seeking")
</template>
<script>
import Menu from "./Menu.vue";
import GameBoard from "./GameBoard.vue";
import Card from "./Card.vue";
import shuffle from "lodash/shuffle";
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
        { value: "../images/apple.jpg", match: "apple" },
        { value: "apple", match: "../images/apple.jpg" },
        { value: "bee", match: "../images/bee.jpg" },
        { value: "../images/bee.jpg", match: "bee" },
        { value: "../images/cat.jpg", match: "cat" },
        { value: "cat", match: "../images/cat.jpg" },
        { value: "../images/dog.jpg", match: "dog" },
        { value: "dog", match: "../images/dog.jpg" },
        { value: "elephant", match: "../images/elephant.jpg" },
        { value: "../images/elephant.jpg", match: "elephant" },
        { value: "frog", match: "../images/frog.jpg" },
        { value: "../images/frog.jpg", match: "frog" }
      ],
      seeking: [],
      attempts: 0
    };
  },
  methods: {
    onStartGame() {
      this.isPlaying = true;
      this.cards = shuffle(this.cards);
    },

    onAddToSeeking(val) {
      const card = this.cards.filter(c => c.value === val);
      this.seeking = [...this.seeking, ...card];
      this.attempts = this.attempts + 1;
    },
    onRemoveFromSeeking(val) {
      this.seeking = this.seeking.filter(c => c.value !== val);
    }
  }
};
</script>
<style lang="scss" scoped>
.game {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 800px;
  width: 75%;
  margin: 0 auto;
}
</style>
