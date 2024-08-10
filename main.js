import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";

import { getCamera, drawVideo } from "./camera.js";
const camera = document.getElementById("camera");
const takePhoto = document.getElementById("take-photo");

const videos = {
  happy: [
    "https://www.youtube.com/embed/LjhCEhWiKXk",

    "https://www.youtube.com/embed/Y66j_BUCBMY",

    "https://www.youtube.com/embed/iPUmE-tne5U",

    "https://www.youtube.com/embed/nfWlot6h_JM",

    "https://www.youtube.com/embed/wsdy_rct6uo",

    "https://www.youtube.com/embed/ru0K8uYEZWw",

    "https://www.youtube.com/embed/Pw-0pbY9JeU",

    "https://www.youtube.com/embed/hT_nvWreIhg",
  ],

  sad: [
    "https://www.youtube.com/embed/YQHsXMglC9A",
    "https://www.youtube.com/embed/hLQl3WQQoQ0",
    "https://www.youtube.com/embed/RBumgq5yVrA",
    "https://www.youtube.com/embed/6EEW-9NDM5k",
    "https://www.youtube.com/embed/0G3_kG5FFfQ",

    "https://www.youtube.com/embed/VT1-sitWRtY",

    "https://www.youtube.com/embed/HLphrgQFHUQ",

    "https://www.youtube.com/embed/koJlIGDImiU",

    "https://www.youtube.com/embed/My2FRPA3Gf8",
  ],
};

//
camera.addEventListener(
  "click",

  async () => {
    const video = await getCamera();

    takePhoto.style.display = "inline";
    drawVideo(video);
  }
);

takePhoto.addEventListener("click", async () => {
  const canvas = document.getElementById("canvas");
  const meme = document.getElementById("moody-canvas");

  meme.width = canvas.width;
  meme.height = canvas.height;
  const context = meme.getContext("2d");

  context.drawImage(canvas, 0, 0, meme.width, meme.height);
  context.font = "bold 48px serif";
  context.fillStyle = "#fff";

  const modelURL = "./model/";

  console.log(modelURL);
  const model = await tmImage.load(
    modelURL + "model.json",
    modelURL + "metadata.json"
  );

  const image = new Image();

  image.src = meme.toDataURL();

  image.onload = async () => {
    const prediction = await model.predict(image);

    console.log(prediction);

    const max = prediction.reduce((acc, val) =>
      val.probability > acc.probability ? val : acc
    );
    let emotion = max.className;

    if (emotion === "neutral") {
      emotion = "sad";
    }

    if (emotion === "sad") {
      context.font = "bold 250px serif"; // Larger size for sad emoji

      context.fillText("😔", 250, 250);
    } else if (emotion === "happy") {
      context.font = "bold 250px serif";
      context.fillText("😄", 250, 250);
    }

    // Announce the detected emotion
    const utterance = new SpeechSynthesisUtterance(
      `Hey ${emotion} folk, feel these videos!`
    );
    window.speechSynthesis.speak(utterance);

    // Shuffle the array and select the first 3 videos
    const shuffledVideos = videos[emotion].sort(() => 0.5 - Math.random());
    const selectedVideos = shuffledVideos.slice(0, 3);

    // Clear previous iframes
    const parentIframe = document.getElementById("iframe");
    parentIframe.innerHTML = ""; // Clear any previous videos

    // Embed the selected videos
    selectedVideos.forEach((videoUrl) => {
      const iframe = document.createElement("iframe");
      iframe.src = videoUrl;
      iframe.width = "450";
      iframe.height = "315";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.style.display = "block";
      iframe.style.marginBottom = "10px"; // Optional: add some spacing between iframes
      parentIframe.appendChild(iframe);
    });
    // const selectedVideo =
    //   videos[emotion][Math.floor(Math.random() * videos[emotion].length)];
    // // Embed the selected video
    // const iframe = document.getElementById("video-player");
    // iframe.src = selectedVideo;
    // iframe.style.display = "block"; // Ensure the iframe is visible
  };
});
