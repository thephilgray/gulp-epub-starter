// import $ from "sizzle";
import "nodelist-foreach-polyfill"; // to support ADE on Android, use polyfill or Array.from, polyfill provided by babel
import AudioPlayer from "./components/AudioPlayer";
import Modal from "./components/Modal";
import WriteInLong from "./components/WriteInLong";

document.querySelectorAll(".audioPlayer").forEach(el => new AudioPlayer(el));

document.querySelectorAll(".modal").forEach(el => new Modal(el));

document.querySelectorAll(".writeInLong").forEach(el => new WriteInLong(el));
