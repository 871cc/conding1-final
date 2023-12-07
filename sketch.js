//define global variables for the context
let cnv;
let root;
let walker;
let font;
let textOut = [];
let charIn = [];

//parameters for the model
const temperature = 0.5;
const seed = 'Feminism';
const maxCharCount = 2000;

//load ml5 charRNN model
const charRNN = ml5.charRNN('models/woolf/', modelReady);

function preload(){
  font = loadFont("font/NotoSansMono-Light.ttf");
}

function setup() {
  //set up p5 canvas
  root = createDiv();
  root.id('root');
  cnv = createCanvas(1000, 1000);
  cnv.parent(root);
  root.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  pixelDensity(4);

  //quote under the canvas
  let quote = createDiv("I am rooted, but I flow");
  quote.parent(root);
  quote.style('font-weight',600);
  quote.style('font-size','24px');

  //set up drawing agent
  walker = new Walker(createVector(0, height), createVector(width, -height), createVector(4, 0));

  //default p5 drawing setting
  background(0);
  fill(255);
  noStroke();
  textFont(font);
  textSize(20);

}

function draw() {
  //no p5 draw loop needed
}

//callback for loading the model
//start drawing right after model loaded
async function modelReady() {
  console.log('Model loaded');
  charRNN.reset();
  charRNN.feed(seed);
  drawLoop();
}

//main drawing loop
async function drawLoop() {
  while (textOut.length < maxCharCount) {
    await drawNext();
  }
}

//predict and draw each character
async function drawNext() {
  let nextChar;
  //use user input as the first letter of the next word if available
  if (charIn.length > 0 && textOut.slice(-1) == ' ') {
    nextChar = charIn.shift();
    //change drawing setting for user input letter
    push();
    textSize(24);
    strokeWeight(2);
    stroke('#880606');
    fill('#880606');
    walker.update(nextChar);
    pop();
  }
  //use charRNN to predict
  else {
    const next = await charRNN.predict(temperature);
    nextChar = next.sample;
    walker.update(nextChar);
  }
  //feed the character back to the model
  await charRNN.feed(nextChar);
  textOut.push(nextChar);
  

}

//keep track of keyboard input
function keyPressed() {
  if (keyCode > 64 && keyCode < 91)
    charIn.push(key);
  if (keyCode === 13)
    saveCanvas("word-tree-" + textOut.length);
}
