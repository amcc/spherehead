let video;
let poseNet;
let poses = [];
let checkbox;
let videoTexture = false;
let noseRot = 0;
let eyeRot = 0;

let pos = {
  nose: {
    x: 0,
    y: 0,
  },
  rEye: {
    x: 0,
    y: 0,
  },
  lEye: {
    x: 0,
    y: 0,
  },
};

lerpSpeed = 0.05;
confNeeded = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  checkbox = createCheckbox("SEE YOURSELF!", false);
  checkbox.position(10, 10);
  checkbox.changed(myCheckedEvent);
}

function myCheckedEvent() {
  if (checkbox.checked()) {
    videoTexture = true;
  } else {
    videoTexture = false;
  }
}

function modelReady() {
  // model is loaded
}

function draw() {
  background(255);

  text(video.width, 20, 100)
  let locX = mouseX - height / 2;
  let locY = mouseY - width / 2;
   // ambientLight(10, 10, 10);
   // pointLight(255, 255, 255, locX, locY, 700);
  // image(video, width, height)
  // We can call both functions to draw all keypoints and the skeletons
  if (poses[0]) {
    let nose = poses[0].pose.nose;
    let rightEye = poses[0].pose.rightEye;
    let leftEye = poses[0].pose.leftEye;
    if (nose.confidence > confNeeded) {
      pos.nose.x = lerp(pos.nose.x, nose.x, lerpSpeed);
      pos.nose.y = lerp(pos.nose.y, nose.y, lerpSpeed);
    }
    if (rightEye.confidence > confNeeded) {
      pos.rEye.x = lerp(pos.rEye.x, rightEye.x, lerpSpeed);
      pos.rEye.y = lerp(pos.rEye.y, rightEye.y, lerpSpeed);
    }
    if (leftEye.confidence > confNeeded) {
      pos.lEye.x = lerp(pos.lEye.x, leftEye.x, lerpSpeed);
      pos.lEye.y = lerp(pos.lEye.y, leftEye.y, lerpSpeed);
    }

    let noseSize = dist(pos.rEye.x, pos.rEye.y, pos.lEye.x, pos.lEye.y);
    normalMaterial();
    if (videoTexture) {
      texture(video);
    }

    push();

    translate(pos.nose.x - width / 2, pos.nose.y - height / 2, noseSize * 1.5);
    rotateY(PI);
    rotateX(noseRot);
    sphere(100);
    pop();

    push();
    translate(pos.rEye.x - width / 2, pos.rEye.y - height / 2, noseSize * 2.0);
    rotateY(PI - eyeRot);
    sphere(50);
    pop();

    push();
    translate(pos.lEye.x - width / 2, pos.lEye.y - height / 2, noseSize * 2.0);
    rotateY(PI + eyeRot);
    sphere(50);
    pop();
  }
  // noseRot += 0.01;
  // eyeRot += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
