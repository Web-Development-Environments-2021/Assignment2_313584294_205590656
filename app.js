var context;
var shape = new Object();
shape.i = null;
shape.j = null;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var durationOfGame;
var extraTime;
var blocked;

var numOfMonsters;
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
monster1.id = 111;
monster2.id = 112;
monster3.id = 113;
monster4.id = 114;
monster1.behind = false;
monster2.behind = false;
monster3.behind = false;
monster4.behind = false;
var intervalMonsters;

var points_50 = new Object();
var points_50_Game;
var intervalPoints_50;
points_50.notSeen = 0;
points_50.id = 50;

var isMeut = false;
var backgroundMusic = new Audio('./resources/pacmanMusic.mp3');
var loseSound;
var winSound;
var encounterSound;

var numOfBalls;
var ballsLeftToEat;
var colorBalls_5;
var colorBalls_15;
var colorBalls_25;

var keyUp;
var keyDown;
var keyRight;
var keyLeft;
var direction;
var lives;

var disapeerBoom = new Object();
disapeerBoom.i = null;
disapeerBoom.j = null;
var intervalBoom;




// $(document).ready(function() {
// 	canvas = document.getElementById("canvas");
// 	context = canvas.getContext("2d");
// 	Start();
// });

/************************** mute or umute  *************************/
function mute(){
	backgroundMusic.pause();
	loseSound.pause();
	encounterSound.pause();
	$("#mute").hide();
	$("#unmute").show();
	isMeut = true;	
}
function unmute (){
	backgroundMusic.play();
	loseSound.play();
	encounterSound.play();
	$("#unmute").hide();
	$("#mute").show();	
	isMeut = false;	
}

/************************** new game  *************************/
function newGame(){
	backgroundMusic.currentTime = 0;
	window.clearInterval(interval);
	window.clearInterval(intervalMonsters);
	window.clearInterval(intervalPoints_50);
	window.clearInterval(intervalBoom);
	Start();
}

function Start() {
	if(!isMeut){
		backgroundMusic.play();
	}
	
	canvas = document.getElementById("canvas");	
	context = canvas.getContext("2d");

	loseSound = new Audio('./resources/loseSound.mp3');
	winSound = new Audio('./resources/winSound.mp3');
	encounterSound = new Audio('./resources/encounterSound.mp3');
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = numOfBalls;
	ballsLeftToEat = numOfBalls;
	var food_5 = Math.floor(numOfBalls*0.6);
	var food_15 = Math.floor(numOfBalls*0.3);
	var food_25 = Math.floor(numOfBalls*0.1);
	var numOfMonstersLeftArrangeOnBoard = numOfMonsters;
	var serialNumberOfMonsters=111 //start from 111
	var pacman_remain = 1;
	start_time = new Date();
	keyUp = $("#up_key").val();
	keyDown = $("#down_key").val();
	keyRight = $("#right_key").val();
	keyLeft = $("#left_key").val();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		for (var j = 0; j < 8; j++) {
			// place of monsters
			if(((i == 0 && j == 0) || (i == 0 && j == 7) || (i == 9 && j == 0) || (i == 9 && j == 7)) && numOfMonstersLeftArrangeOnBoard > 0){
				board[i][j] = serialNumberOfMonsters;
				serialNumberOfMonsters++;
				numOfMonstersLeftArrangeOnBoard--;
			}
			// walls
			else if((i == 4 && j == 1) || (i == 4 && j == 2) || (i == 1 && j == 2) || (i == 7 && j == 2) ||
			(i==7 && j==3) || (i==6 && j==2) || (i==5 && j==5) || (i==5 && j==6) || (i==2 && j==6) || (i==2 && j==7) ){
				board[i][j] = 4;
			}
			//Moving score
			else if(i == 4 && j == 0){
				board[i][j] = 50;
				//star.i = i;
				//star.j =j;
			}
			//balls , pacman , empty
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) { //balls
					food_remain--;
					var num = Math.random();
					if(num < 0.6 && food_5 > 0){
						food_5--;
						board[i][j] = 5;
					}
					else if(num < 0.9 && food_15 > 0){
						food_15--;
						board[i][j] = 15;
					}
					else if (food_25 > 0){
						food_25--;
						board[i][j] = 25;
					};
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) { //pacman
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 999;
				} else { //empty
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var findEmptyCell = findRandomEmptyCell(board);
		food_remain--;
		var num = Math.random();
		if(num < 0.6 && food_5 > 0){
			food_5_remain--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 5;
		}
		else if(num < 0.9 && food_15 > 0){
			food_15_remain--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 15;
		}
		else if (food_25_remain > 0){
			food_25--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 25;
		}
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 10);
	var j = Math.floor(Math.random() * 8);
	while (board[i][j] != 0) {	
		i = Math.floor(Math.random() * 10);
		j = Math.floor(Math.random() * 8);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keyUp]) {
		direction = "up";
		return 1;
	}
	if (keysDown[keyDown]) {
		direction = "down";
		return 2;
	}
	if (keysDown[keyRight]) {
		direction = "right";
		return 3;
	}
	if (keysDown[keyLeft]) {
		direction = "left";
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 8; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 999) { //place of pacman
				context.beginPath();
				if(direction === "up"){//pacman move up
					context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle up   
				}
				else if(direction === "down"){//pacman move down
					context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle down
				}
				else if(direction === "left"){//pacman move left
					context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle left
				}
				else {//pacman move right	
					context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle right
				}
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				if(direction === "up"){//pacman move up
					context.arc(center.x + 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
				}
				else if(direction === "down"){//pacman move down
					context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
				}
				else if(direction === "left"){//pacman move left
					context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				}
				else {//pacman move right
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				}
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 5) { // place of ball 5
				context.beginPath();
				context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_5; //color of 5
				context.fill();
			}
			else if (board[i][j] == 15) { // place of ball 15
				context.beginPath();
				context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_15; //color of 15
				context.fill();
			}
			else if (board[i][j] == 25) { // place of ball 25
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_25; //color of 25
				context.fill();
			}else if (board[i][j] == 4) {
				var wallImg = new Image;
				wallImg.src="./resources/wallwhite.png"
				context.beginPath();
				context.drawImage(wallImg,center.x - 30, center.y - 30, 60, 60 * wallImg.height / wallImg.width);
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

function GhostEatPacman(){
	board[shape.i][shape.j] = 700;
	if(!isMeut){
		encounterSound.play();
	}
	lives--;
	score = score - 10;
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[shape.i][shape.j] = 2;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
}
