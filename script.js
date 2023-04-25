//   Model trained on teachablemachine.withgoogle.com

//      Data to display final text on DOM
const poses = [
  {
    class: "Rock",
    emoji: "🪨",
    opp: "Paper",
  },
  {
    class: "Paper",
    emoji: "📜",
    opp: "Scissor",
  },
  {
    class: "Scissor",
    emoji: "✂️",
    opp: "Rock",
  },
];

const main = document.querySelector("main");

//           Adding the Play button
let btn = document.createElement("button");
btn.innerText = "Play";
document.querySelector("#container").append(btn);

btn.addEventListener("click", run);

let model, webcam, labelContainer, maxPredictions;

const boxes = document.querySelector("#boxes");

// Load the image model and setup the webcam
async function run() {
  btn.innerText = "Loading...";

  btn.style.display = "none";
  const modelURL = "model.json";
  const metadataURL = "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(window.innerWidth, window.innerHeight, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.querySelector("#video-container").appendChild(webcam.canvas);
  labelContainer = document.querySelector("#container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

const p = document.createElement("p");
p.style.fontSize = "4em";
boxes.append(p);

const opp = document.createElement("p");
opp.style.fontSize = "4em";

boxes.append(opp);

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);

  //       	console.log(JSON.stringify(prediction));

  //             Getting the most probable class
  let mostProbable = prediction.reduce(function (prev, current) {
    return prev.probability > current.probability ? prev : current;
  });

  //          Adding values to the DOM

  let emoji = poses.find((pose) => pose.class === mostProbable.className).emoji;

  let oppPose = poses.find((pose) => pose.class === mostProbable.className).opp;

  let oppPoseEmoji = poses.find((pose) => pose.class === oppPose).emoji;

  p.innerHTML = `YOU<br/>${emoji}`;

  opp.innerHTML = `BOT<br/>${oppPoseEmoji}`;
}
