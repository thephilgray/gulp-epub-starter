import Vue from "vue";
import App from "./components/App.vue";

console.log("init vue");

new Vue({
  el: "#app",
  render: h => h(App)
});
