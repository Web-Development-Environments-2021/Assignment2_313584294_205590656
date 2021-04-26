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
	var food_25 = food_remain-food_5-food_15;
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
				points_50.i = i;
				points_50.j =j;
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
<<<<<<< HEAD

	// add clock
	var findEmptyCell = findRandomEmptyCell(board);
	board[findEmptyCell[0]][findEmptyCell[1]] = 10;

=======
>>>>>>> c7dfc5e8067fa8e9d6caedde4dbcfb82c0e501aa
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

<<<<<<< HEAD
/*************************************** move interval *****************************************/
function monsters_Move() {
	if (numOfMonsters == 1) {
		if (UpdateNextStepMonster(monster1) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			GhostEatMe();
			board[0][0] = 111;
		}
	}
	else if (numOfMonsters == 2) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			GhostEatMe();
			board[0][0] = 111;
			board[0][7] = 112;
		}
	}
	else if (numOfMonsters == 3) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false || UpdateNextStepMonster(monster3) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			GhostEatMe();
			board[0][0] = 111;
			board[0][7] = 112;
			board[13][0] = 113;
		}
	}
	else if (numOfMonsters == 4) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false || UpdateNextStepMonster(monster3) == false || UpdateNextStepMonster(monster4) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			board[monster4.i][monster4.j] = monster4.notSeen;
			GhostEatMe();
			board[0][0] = 111;
			board[0][7] = 112;
			board[13][0] = 113;
			board[13][7] = 114;
		}
	}
}
function Boom_Move() {
	if (disapeerBoom.i != null && disapeerBoom.j!=null){
		board[disapeerBoom.i][disapeerBoom.j] = 0;
	}
}
function Points_50_Move(){
	if(points_50_Game && UpdateNextStepMonster(points_50) == false){ //pacman eat 50 points
		board[points_50.i][points_50.j] = 0;
		points_50_Game = false;
		score = score +50 +points_50.notSeen;
		points_50.notSeen = 0;
	}
}
function UpdatePosition() {
	if(shape.i != null && shape.j != null){
		board[shape.i][shape.j] = 0;
	}

	var x = GetKeyPressed();
	if (x == 1) { //up
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) { //down
		if (shape.j < 7 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) { //right
		if (shape.i < 13 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
		
	}
	if (x == 4) { //left
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (board[shape.i][shape.j] == 5) { //5 points
		score+= 5;
		board[shape.i][shape.j] = 0;
		ballsLeftToEat--;
	}
	else if(board[shape.i][shape.j] == 15){ // 15 points
		score+= 15;
		board[shape.i][shape.j] = 0;
		ballsLeftToEat--;
	}
	else if(board[shape.i][shape.j] == 25){ //25 points
		score+= 25;
		board[shape.i][shape.j] = 0;
		ballsLeftToEat--;
	}
	else if(board[shape.i][shape.j] == 111 || board[shape.i][shape.j] == 112 || board[shape.i][shape.j] == 113 || board[shape.i][shape.j] == 114){ //Collision with a monster
		monstersMove();
		board[shape.i][shape.j]=700; //Collision
	}
	else if(board[shape.i][shape.j] == 50){ //50 points
		score+= 50;
		board[shape.i][shape.j] = points_50.notSeen;
		points_50_Game = false;
	}
	else if(board[shape.i][shape.j] == 10){ //extra time
		extraTime = 20;
		board[shape.i][shape.j] == 0;
	}	

	board[shape.i][shape.j] = 999;
	var currentTime = new Date();
	time_elapsed = durationOfGame + extraTime - (currentTime - start_time) / 1000;
	time_elapsed = time_elapsed.toFixed(2);
	document.getElementById('showTime').innerHTML = time_elapsed;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
	keysDown[keyUp] = false;
	keysDown[keyDown] = false;
	keysDown[keyRight] = false;
	keysDown[keyLeft] = false;

	if(lives == 0){
		backgroundMusic.pause();
		backgroundMusic.currentTime = 0;
		if(!isMeut){
			loseSound.play();
		}
		window.alert("Loser!");
		window.clearInterval(interval);
		window.clearInterval(intervalMonsters);
		window.clearInterval(intervalPoints_50);
		window.clearInterval(intervalBoom);
	}
	else if (time_elapsed <= 0.00){
		if (score < 100){
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0;
			if(!isMeut){
				loseSound.play();
			}
			window.alert("You are better than " + score + " points!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalPoints_50);
			window.clearInterval(intervalBoom);
		}
		else{
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0;
			if(!isMeut){
				winSound.play();
			}
			window.alert("Winner!!!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalPoints_50);
			window.clearInterval(intervalBoom);
		}
	}
	else {
		Draw();
	}
}

=======
>>>>>>> c7dfc5e8067fa8e9d6caedde4dbcfb82c0e501aa
function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 14; i++) {
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
	var findEmptyCell = findRandomEmptyCell(board);
	shape.i = findEmptyCell[0];
	shape.j = findEmptyCell[1];
	board[shape.i][shape.j] = 2;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
}
