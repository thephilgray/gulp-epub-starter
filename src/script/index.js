import kebabCase from 'lodash/kebabCase';
import Vue from 'vue';
import App from './App.vue';

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#app')) {
    new Vue({
      el: '#app',
      render: h => h(App)
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log(kebabCase('hey!!!!!!!!! are you still working babel loader'));
});

function checkReadingSystemSupport() {
  var neededFeatures = ['mouse-events', 'spine-scripting', 'dom-manipulation'];
  var support = typeof navigator.epubReadingSystem != 'undefined';
  if (support) {
    for (var i = 0; i < neededFeatures.length; i++) {
      if (!navigator.epubReadingSystem.hasFeature(neededFeatures[i])) {
        return false;
      }
    }
  }
  return support;
}

function togglePlay() {
  var video = document.getElementsByTagName('video')[0];
  if (video.ended || video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function toggleControls() {
  var video = document.getElementsByTagName('video')[0];
  if (video.controls) {
    video.removeAttribute('controls', 0);
  } else {
    video.controls = 'controls';
  }
}
