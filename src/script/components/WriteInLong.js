import isEmpty from "lodash/isEmpty";
export default class WriteInLong {
  constructor(el) {
    this.$wrapper = el;
    this.$id = el.id;
    this.$input = this.$wrapper.querySelector("[contenteditable='true']");
    this.$userContent = () =>
      JSON.parse(localStorage.getItem("userContent")) || {};
    this.$value = !isEmpty(this.$userContent())
      ? this.$userContent()[this.$id]
      : "";
    this.$input.textContent = this.$value;
    this.$input.oninput = e => this.setValue();
    const that = this;
    function setContenteditable() {
      that.$input.setAttribute("contenteditable", true);
    }

    setTimeout(setContenteditable, 200);
  }

  setValue() {
    this.$value = this.$input.textContent;
    localStorage.setItem(
      "userContent",
      JSON.stringify({
        ...this.$userContent(),
        [this.$id]: this.$value
      })
    );
    console.log(this.$userContent(), this.$value);
  }
}
