export default class AudioPlayer {
  constructor(el) {
    Object.assign(this, {
      $wrapper: el,
      playing: false
    });

    this.$controls = this.$wrapper.querySelector(".audioControls");
    this.$playPauseButton = this.$wrapper.querySelector(
      ".audioControls__playPause"
    );
    this.$stopButton = this.$wrapper.querySelector(".audioControls__stop");
    this.$player = this.$wrapper.querySelector("audio");

    this.$playPauseButton.onclick = () => this.playPause();
    this.$stopButton.onclick = () => this.stopPlayBack();
    this.$playPauseButton.onkeydown = event => this.playPauseKeyHandler(event);
    this.$stopButton.onkeydown = event => this.stopPlayBackKeyHandler(event);
  }

  playPause() {
    if (this.playing) {
      this.$controls.classList.remove("audioControls__playPause--isPlaying");
      this.$player.pause();
      this.playing = false;
      this.$playPauseButton.setAttribute("aria-label", "pause");
    } else {
      this.$player.play();
      this.$controls.classList.add("audioControls__playPause--isPlaying");
      this.playing = true;
      this.$playPauseButton.setAttribute("aria-label", "play");
    }
  }

  stopPlayBack() {
    this.$player.pause();
    this.$player.currentTime = 0;
    this.$controls.classList.remove("audioControls__playPause--isPlaying");
    this.playing = false;
  }

  playPauseKeyHandler(e) {
    const pressed = e.keyCode === 13 || e.keyCode === 32;
    if (pressed) {
      this.playPause();
    }
  }
  stopPlayBackKeyHandler(e) {
    const pressed = e.keyCode === 13 || e.keyCode === 32;
    if (pressed) {
      this.stopPlayBack();
    }
  }
}
