import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { Button } from "./Button.js";
import { intersectsCircle, pointInRectangle } from "./util.js";

var gameObjects = null;

var start_button = null;
var replay_button = null;

var canvas = null;
var context = null;

var paddle1 = null;
var paddle2 = null;
var ball = null;

var KEYCODE = {
    W : 87,
    S : 83,
    UP : 38,
    DOWN : 40
};

var paddleVelocity = 0.01;

var gameStarted = false;
var gameFinished = false;

var redrawInterval = null;

function initialize(){

    gameStarted = false;

    canvas = document.getElementById("gameui");
    context = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    
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

    // canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onMouseClick);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    start_button = new Button("Start", {
        x: 0.4,
        y: 0.45,
        width: 0.2,
        height: 0.1
    });

    start_button.draw();
}

initialize();

function start(){
    gameStarted = true;
    gameFinished = false;
    redrawInterval = setInterval(update, 17); // 60 fps
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

function redraw(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    paddle1.draw();

    paddle2.draw();

    ball.draw();
}

function handleMotion(){

    paddle1.y += paddle1.velocity;

    var paddle1_top = paddle1.y;
    var paddle1_bottom = paddle1.y + paddle1.height;

    if(paddle1_top < 0){
        paddle1.y = 0;
    }
    else if(paddle1_bottom > 1){
        paddle1.y = 1-paddle1.height;
    }
    
    paddle2.y += paddle2.velocity;

    var paddle2_top = paddle2.y;
    var paddle2_bottom = paddle2.y + paddle2.height;

    if(paddle2_top < 0){
        paddle2.y = 0;
    }
    else if(paddle2_bottom > 1){
        paddle2.y = 1-paddle2.height;
    }

    ball.x += ball.vx;
    ball.y += ball.vy;
}

function handleCollisions(){

    /////////////////////////////////////////////////////////////////
    // Ball with walls
    /////////////////////////////////////////////////////////////////

    var ball_top = ball.y - ball.radius;
    var ball_bottom = ball.y + ball.radius;

    if (ball_top <= 0.01 || ball_bottom >= 0.99){
        ball.vy *= -1;
    }

    /////////////////////////////////////////////////////////////////
    // Ball with paddles
    /////////////////////////////////////////////////////////////////

    var ball_center = [ball.x, ball.y];

    var paddle1_left_A = [paddle1.x+paddle1.width, paddle1.y];
    var paddle1_left_B = [paddle1.x+paddle1.width, paddle1.y+paddle1.height];

    var paddle2_left_A = [paddle2.x+paddle2.width, paddle2.y];
    var paddle2_left_B = [paddle2.x+paddle2.width, paddle2.y+paddle2.height];

    var paddle1_collide = pointInRectangle(ball_center, paddle1.rect) ||
        ( intersectsCircle(paddle1_left_A, paddle1_left_B, ball_center, ball.radius) && 
          ball_top > paddle1.y && ball_bottom < paddle1.y+paddle1.height);

    var paddle2_collide = pointInRectangle(ball_center, paddle2.rect) ||
          ( intersectsCircle(paddle2_left_A, paddle2_left_B, ball_center, ball.radius) && 
            ball_top > paddle2.y && ball_bottom < paddle2.y+paddle2.height);

    if(paddle1_collide || paddle2_collide){
        ball.vx *= -1;
    }

    
    
}

function onMouseClick(event){

    var mousex = event.clientX - canvas.offsetLeft;
    var mousey = event.clientY - canvas.offsetTop;

    if (!gameStarted && start_button.hasCursor(mousex, mousey)){
        start();
    }
    else if (gameFinished && replay_button.hasCursor(mousex, mousey)){
        initialize();
    }
}

function keyDown(event){    
    var code = event.keyCode;
    switch (code) {
        case KEYCODE.W : 
            paddle1.velocity = -paddleVelocity;
            break;
        case KEYCODE.S : 
            paddle1.velocity = paddleVelocity;
            break;
        case KEYCODE.UP:
            paddle2.velocity = -paddleVelocity; 
            break;
        case KEYCODE.DOWN: 
            paddle2.velocity = paddleVelocity; 
            break;
    }
}

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

function handleVictory(player_num){

    gameFinished = true;

    clearInterval(redrawInterval);

    var banner = new Button(`Player ${player_num} wins!`, {
        x: 0.375,
        y:0,
        width : 0.25,
        height : 0.1 
    });

    replay_button = new Button(`Play again?`, {
        x: 0.4,
        y: 0.45,
        width: 0.2,
        height: 0.1
    });

    banner.draw();

    replay_button.draw();
}