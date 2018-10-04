<template lang="pug">
    .card(@click="onClick" :class="{'card--isFlipped': isFlipped, 'card--isMatched': isMatched}")
        template(v-if="isFlipped")
          .card__bg(v-if="isImage" :style="{backgroundImage: 'url(' + value + ')'}")
          h3(v-else) {{value}}
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
      if (this.seeking.length > 0 && this.isMatch) {
        this.isMatched = true;
      } else {
        setTimeout(() => {
          if (!this.isMatch) {
            this.isFlipped = false;
          } else {
            this.isMatched = true;
          }
          this.$emit("removeFromSeeking", this.value);
        }, 2000);
      }
    }
  },
  computed: {
    isMatch: function() {
      return (
        this.seeking.some(c => c.match === this.value) ||
        this.seeking.some(c => c.value === this.match)
      );
    },
    isImage: function() {
      return /\.(gif|jpg|jpeg|tiff|png)$/i.test(this.value);
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  &--isFlipped {
    background: white;
  }
  &--isMatched {
    background: rgba(0, 200, 0, 0.5);
  }
}

.card__bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
