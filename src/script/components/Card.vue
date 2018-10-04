<template lang="pug">
    .card(@click="onClick" :class="{'card--isFlipped': isFlipped, 'card--isMatched': isMatched}")
        span(v-if="isFlipped") {{value}}
</template>
<script>
export default {
  props: ["matched", "value", "seeking"],
  data() {
    return {
      isFlipped: false,
      isMatched: false
    };
  },
  methods: {
    onClick(event) {
      this.$emit("addToSeeking", this.value);
      this.isFlipped = true;

      setTimeout(() => {
        if (!this.isMatch) {
          this.isFlipped = false;
        } else {
          this.isMatched = true;
        }
        this.$emit("removeFromSeeking", this.value);
      }, 3000);
    }
  },
  computed: {
    isMatch: function() {
      if (this.seeking.length < 2 || !this.isFlipped) {
        return false;
      } else {
        return (
          this.seeking.some(c => c.match === this.value) ||
          this.seeking.some(c => c.value === this.match)
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  border: 1px solid black;

  &--isFlipped {
    background: white;
  }
  &--isMatched {
    background: green;
  }
}
</style>
