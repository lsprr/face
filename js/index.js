const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const MODELS_URL = './models';

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL),
  faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
]).then(webcam);

function webcam() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: true
      })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .then(facialRecognition)
      .catch(function (error) {
        console.error(error);
      });
  }
}

function facialRecognition() {
  const displaySize = {
    width: video.width,
    height: video.height
  };

  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async function () {
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }, 100);

}