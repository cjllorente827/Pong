///////////////////////////////////////////////////////////////////////////////
// Import some useful tools from other files
///////////////////////////////////////////////////////////////////////////////
import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { Button } from "./Button.js";
import { intersectsCircle, pointInRectangle } from "./util.js";

///////////////////////////////////////////////////////////////////////////////
// Set up global variables that represent different game objects
///////////////////////////////////////////////////////////////////////////////
var start_button = null;
var replay_button = null;

var canvas = null;
var context = null;

var paddle1 = null;
var paddle2 = null;
var ball = null;


///////////////////////////////////////////////////////////////////////////////
// Detect key input
///////////////////////////////////////////////////////////////////////////////
var KEYCODE = {
    W : 87,
    S : 83,
    UP : 38,
    DOWN : 40
};

///////////////////////////////////////////////////////////////////////////////
// Controls how fast the paddles move
///////////////////////////////////////////////////////////////////////////////
var paddleVelocity = 0.01;

///////////////////////////////////////////////////////////////////////////////
// These determine the current game state
///////////////////////////////////////////////////////////////////////////////
var gameStarted = false;
var gameFinished = false;

///////////////////////////////////////////////////////////////////////////////
// Holds the interval id for the canvas update function
///////////////////////////////////////////////////////////////////////////////
var updateInterval = null;


///////////////////////////////////////////////////////////////////////////////
// Set the game up and get ready to start
///////////////////////////////////////////////////////////////////////////////
function initialize(){

    // Set game state booleans to false
    gameStarted = false;
    gameFinished = false;

    // grab the canvas and canvas context
    canvas = document.getElementById("gameui");
    context = canvas.getContext('2d');

    // set the canvas dimensions
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // instantiate all game objects
    paddle1 = new Paddle({
        x : 0.1,
        y : 0.4,
        width : 0.01,
        height : 0.2
    });

    paddle2 = new Paddle({
        x : 0.89,
        y : 0.4,
        width : 0.01,
        height : 0.2
    });

    ball = new Ball({
        x : 0.5,
        y : 0.5,
        vx : -0.01,
        vy : -0.005,
        radius : 0.01
    });


    // add event listeners for key presses and mouse clicks
    // canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onMouseClick);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);


    // create start button
    start_button = new Button("Start", {
        x: 0.4,
        y: 0.45,
        width: 0.2,
        height: 0.1
    });

    // draw the start button
    start_button.draw();
};

// call initialize when the script has loaded
initialize();

/////////////////////////////////////////////////////////////////
// Start the game
/////////////////////////////////////////////////////////////////
function start(){
    gameStarted = true;
    gameFinished = false;

    //every 17ms call the update function
    updateInterval = setInterval(update, 17); // 60 fps
}

function update(){

    handleMotion();

    handleCollisions();

    redraw();

    /////////////////////////////////////////////////////////////////
    // Handle win condition
    /////////////////////////////////////////////////////////////////

    if(ball.x < 0){
        handleVictory(2);
        return;
    }

    if(ball.x > 1){
        handleVictory(1);
        return;
    }
    
}

/////////////////////////////////////////////////////////////////
// Clear canvas and redraw all game objects
/////////////////////////////////////////////////////////////////
function redraw(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    paddle1.draw();

    paddle2.draw();

    ball.draw();
}

/////////////////////////////////////////////////////////////////
// Handle motion of game objects
/////////////////////////////////////////////////////////////////
function handleMotion(){

    // move the first paddle
    paddle1.y += paddle1.velocity;

    // figure out where the paddle's top and bottom are
    var paddle1_top = paddle1.y;
    var paddle1_bottom = paddle1.y + paddle1.height;

    // dont allow the paddle to pass through the ceiling
    if(paddle1_top < 0){
        paddle1.y = 0;
    } // or the floor
    else if(paddle1_bottom > 1){
        paddle1.y = 1-paddle1.height;
    }
    
    // same thing with paddle 2
    paddle2.y += paddle2.velocity;

    var paddle2_top = paddle2.y;
    var paddle2_bottom = paddle2.y + paddle2.height;

    if(paddle2_top < 0){
        paddle2.y = 0;
    }
    else if(paddle2_bottom > 1){
        paddle2.y = 1-paddle2.height;
    }

    // move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;
}

/////////////////////////////////////////////////////////////////
// Handle collisions between the ball and other objects
/////////////////////////////////////////////////////////////////
function handleCollisions(){

    /////////////////////////////////////////////////////////////////
    // Ball with walls
    /////////////////////////////////////////////////////////////////

    //figure out where the ball top and bottom are
    var ball_top = ball.y - ball.radius;
    var ball_bottom = ball.y + ball.radius;

    // figure out where the paddle's top and bottom are
    var paddle1_top = paddle1.y;
    var paddle1_bottom = paddle1.y + paddle1.height;

    var paddle2_top = paddle2.y;
    var paddle2_bottom = paddle2.y + paddle2.height;

    // if the ball hits a vertical boundary, turn it around
    if (ball_top <= 0.01 || ball_bottom >= 0.99){
        ball.vy *= -1;
    }

    /////////////////////////////////////////////////////////////////
    // Ball with paddles
    /////////////////////////////////////////////////////////////////

    // get ball center as a vector
    var ball_center = [ball.x, ball.y];

    // get paddle 1 right edge as 2 vectors
    var paddle1_right_A = [paddle1.x+paddle1.width, paddle1.y];
    var paddle1_right_B = [paddle1.x+paddle1.width, paddle1.y+paddle1.height];

    // get paddle 2 left edge as 2 vectors
    var paddle2_left_A = [paddle2.x, paddle2.y];
    var paddle2_left_B = [paddle2.x, paddle2.y+paddle2.height];

    // if the line between the two edge points intersects the ball 
    // AND
    // the ball is between the top and bottom of the paddle
    // then a collision has occurred
    var paddle1_collide = ( 
        ball_bottom > paddle1_top && ball_top < paddle1_bottom &&
        intersectsCircle(paddle1_right_A, paddle1_right_B, ball_center, ball.radius) 
    );

    var paddle2_collide = ( 
        ball_bottom > paddle2_top && ball_top < paddle2_bottom &&
        intersectsCircle(paddle2_left_A, paddle2_left_B, ball_center, ball.radius) 
    );

    // if a collision occurs, turn the ball around
    if(paddle1_collide || paddle2_collide){
        ball.vx *= -1;
    }
}

/////////////////////////////////////////////////////////////////
// Handle mouse clicks
/////////////////////////////////////////////////////////////////
function onMouseClick(event){

    // Grab the mouse x and y position from the event
    var mousex = event.clientX - canvas.offsetLeft;
    var mousey = event.clientY - canvas.offsetTop;

    // if the game has not been started and the start button was clicked, 
    // start the game
    if (!gameStarted && start_button.hasCursor(mousex, mousey)){
        start();
    }

    // if a game was just finished and the replay button was clicked, 
    // reset the game
    if (gameFinished && replay_button.hasCursor(mousex, mousey)){
        initialize();
    }
}

/////////////////////////////////////////////////////////////////
// Handle key presses
/////////////////////////////////////////////////////////////////
function keyDown(event){    

    // get the key code
    var code = event.keyCode;
    switch (code) {
        case KEYCODE.W : //if W was pressed, paddle 1 go up
            paddle1.velocity = -paddleVelocity;
            break;
        case KEYCODE.S : //if S was pressed, paddle 1 go down
            paddle1.velocity = paddleVelocity;
            break;
        case KEYCODE.UP: //if UP was pressed, paddle 2 go up
            paddle2.velocity = -paddleVelocity; 
            break;
        case KEYCODE.DOWN: //if DOWN was pressed, paddle 2 go down
            paddle2.velocity = paddleVelocity; 
            break;
    }
}

// once the button is released, set the velocity back to zero
function keyUp(event){
    var code = event.keyCode;
    switch (code) {
        case KEYCODE.W : 
            paddle1.velocity = 0;
            break;
        case KEYCODE.S : 
            paddle1.velocity = 0;
            break;
        case KEYCODE.UP:
            paddle2.velocity = 0; 
            break;
        case KEYCODE.DOWN: 
            paddle2.velocity = 0; 
            break;
    }
}

/////////////////////////////////////////////////////////////////
// What happens when someone wins?
/////////////////////////////////////////////////////////////////
function handleVictory(player_num){

    // set game state boolean
    gameFinished = true;

    // stop updating the screen
    clearInterval(updateInterval);

    // create a congratulatory banner
    var banner = new Button(`Player ${player_num} wins!`, {
        x: 0.375,
        y:0,
        width : 0.25,
        height : 0.1 
    });

    // create a replay button
    replay_button = new Button(`Play again?`, {
        x: 0.4,
        y: 0.45,
        width: 0.2,
        height: 0.1
    });

    // draw both 
    banner.draw();
    replay_button.draw();
}