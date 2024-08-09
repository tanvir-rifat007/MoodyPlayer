export async function getCamera() {
  const video = document.createElement("video");
  video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
  await video.play();

  return video;
}

export function drawVideo(video) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  // Flip the image horizontally
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  function drawFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
  return canvas;
}
