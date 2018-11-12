
//Creation&Computation
//sends the X Y value of the cursor to arduino 
//the coordinates are mapped as led brightness values
//led1 is mapped to the x coordinate
//led2 is mapped to the y coordinate
//requires p5send_arduino.ino to be running on your arduino


var serial;       //variable to hold the serial port object


var ardSend = {}; //uses {} to define it as a JSON variable

var sendVal1;     //variables to hold the values to send to arduino 
//var sendVal2;

var serialPortName = "/dev/cu.usbmodem1421";      //FOR PC it will be COMX on mac it will be something like "/dev/cu.usbmodemXXXX"
                                    //Look at P5 Serial to see the available ports
var input1;

var sendRate = 100;               //use this with setInterval to stablize the data sending to arduino


var fontSize;
var lineWidth = 2; 



let snowflakes = []; // array to hold snowflake objects

function setup() {
  // The background image must be the same size as the parameters
  // into the createCanvas() method. In this program, the size of
  // the image is 900x500 pixels.
    bg = loadImage("winter.jpg");
    createCanvas(1440, 960);
  fill(240);
  noStroke();

  //Setting up the serial port
  serial = new p5.SerialPort();     //create the serial port object
  serial.open(serialPortName); //open the serialport. determined 
  serial.on('open',ardCon);         //open the socket connection and execute the ardCon callback
  serial.on('data',dataReceived);   //when data is received execute the dataReceived function
}

//map(sendVal1,0,1023,0,200);

function draw() {
  background(bg);
  let t = frameCount / 60; // update time

  // create a random number of snowflakes each frame
  for (var i = 0; i < map(sendVal1,0,1023,0.1,5); i++) {
    snowflakes.push(new snowflake()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
}

// snowflake class
function snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, map(sendVal1,0,1023,4,7));

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
}


function dataReceived()   //this function is called every time data is received
{
  
var rawData = serial.readStringUntil('\r\n'); //read the incoming string until it sees a newline
    console.log(rawData);                   //uncomment this line to see the incoming string in the console     
    if(rawData.length>1)                      //check that there is something in the string
    {                                         
      
      sendVal1 = JSON.parse(rawData).s2;       //the parameter value .s1 must match the parameter name created within the arduino file
      //sensor2 = JSON.parse(rawData).s2; 
    }
}

function ardCon()
{
  console.log("connected to the arduino!! Listen UP");
}


