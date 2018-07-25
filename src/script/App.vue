<template>
  <div class="example" @click="count++">{{ msg }} {{count + 1}}</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!',
      count: 300
    }
  }
}
</script>

<style>
.example {
  color: green;
}
</style>