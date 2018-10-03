<template>
    <div>
        <h1 @click="reverse" :class="{'--reversed': reversed}">{{message}}</h1>
    </div>
</template>
<script>
export default {
    data(){
        return {
            message: "Hello World",
            reversed: false
        }
    },
    methods: {
        reverse(){
            console.log('reversing');
            this.message = this.message.split('').reverse().join('');
            this.reversed = !this.reversed;
        }
    }
}
</script>
<style scoped>
h1 {
  color: white;
  background: blue;
}

h1:hover {
  cursor: pointer;
}

.--reversed {
  text-align: right;
}
</style>
