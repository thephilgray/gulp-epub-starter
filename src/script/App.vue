<template>
  <div class="example" @click="$store.commit('increment')">{{ msg }} {{$store.state.count}}</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: green;
}
</style>