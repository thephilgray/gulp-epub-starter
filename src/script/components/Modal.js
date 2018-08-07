import getRootNode from "get-root-node-polyfill";

export default class Modal {
  constructor(el) {
    Object.assign(this, {
      $wrapper: el,
      show: false,
      $target: el.id
    });

    this.$document = getRootNode.call(this.$wrapper);
    this.$body = this.$document.querySelector("body");
    this.$modals = this.$document.querySelectorAll(".modal");
    this.$backdrops = this.$document.querySelectorAll(".backdrop");
    this.$activators = this.$document.querySelectorAll(
      `[data-toggle='modal'][data-target="${this.$target}"]`
    );
    this.$dismissers = this.$document.querySelectorAll(
      `[data-dismiss='modal'][data-target="${this.$target}"]`
    );
    this.$backdrop = this.$document.createElement("div");
    this.$backdrop.setAttribute("class", "backdrop");

    Array.from(this.$activators).forEach(
      activator => (activator.onclick = () => this.open())
    );
    Array.from(this.$dismissers).forEach(
      dismisser => (dismisser.onclick = () => this.close())
    );
    this.$backdrop.onclick = () => this.close();
  }

  open() {
    // if (localStorage.getItem("modalOpened")) {
    //   const currentCount = JSON.parse(localStorage.getItem("modalOpened")) + 1;
    //   localStorage.setItem("modalOpened", currentCount);
    // } else {
    //   localStorage.setItem("modalOpened", 1);
    // }
    this.$backdrops = this.$document.querySelectorAll(".backdrop");

    if (this.$backdrops.length > 0) {
      this.$backdrop = this.$backdrops[0];
    } else {
      this.$body.appendChild(this.$backdrop);
    }

    Array.from(this.$modals).forEach(modal =>
      modal.classList.remove("modal--isOpen")
    );
    this.show = true;
    this.$backdrop.classList.add("backdrop--isOpen");
    this.$wrapper.classList.add("modal--isOpen");
  }

  close() {
    this.show = false;
    this.$backdrop.classList.remove("backdrop--isOpen");
    Array.from(this.$modals).forEach(modal =>
      modal.classList.remove("modal--isOpen")
    );
  }
}
