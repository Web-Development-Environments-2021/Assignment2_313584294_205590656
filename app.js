//Functionality of the game

var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var durationOfGame;
var extraTime;
var blocked;
var typeOfGender;
var lives;

//Monsters
var numOfMonsters;
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
monster1.id = 111;
monster2.id = 112;
monster3.id = 113;
monster4.id = 114;
monster1.notSeen = 0;
monster2.notSeen = 0;
monster3.notSeen = 0;
monster4.notSeen = 0;
var intervalMonsters;

//points_50
var points_50 = new Object();
var points_50_Game;
var intervalPoints_50;
points_50.notSeen = 0;
points_50.id = 50;

//Music
var isMute = false;
var backgroundMusic = new Audio('./resources/pacmanMusic.mp3');
var loseSound;
var winSound;
var encounterSound;

//balls
var numOfBalls;
var ballsLeftToEat;
var colorBalls_5;
var colorBalls_15;
var colorBalls_25;

//direction
var keyUp;
var keyDown;
var keyRight;
var keyLeft;
var direction;

//collision with monsters = boom
var disapeerBoom = new Object();
disapeerBoom.i = null;
disapeerBoom.j = null;
var intervalBoom;
shape.i = null;
shape.j = null;

/************************** Identify objects in the game  *************************/
/*
empty cell - 0
walls - 4
extra time - clock -10
extra life - heart - 20
extra 50 points - 50
balls of 5 points - 5
balls of 15 points - 15
balls of 25 points - 25
monsters - 111,112,113,114
collision with monsters - 700
position pacman - 999
 */

/************************** new game  *************************/
function newGame(){
	backgroundMusic.currentTime = 0;
	window.clearInterval(interval);
	window.clearInterval(intervalMonsters);
	window.clearInterval(intervalPoints_50);
	window.clearInterval(intervalBoom);
	Start();
}

/************************** mute or umute  *************************/
function mute(){ // Turns from unmute to mute
	backgroundMusic.pause();
	loseSound.pause();
	encounterSound.pause();
	$("#mute").hide();
	$("#unmute").show();
	isMute = true;	
}
function unmute (){ //// Turns from mute to unmute
	backgroundMusic.play();
	loseSound.play();
	encounterSound.play();
	$("#unmute").hide();
	$("#mute").show();	
	isMute = false;	
}

/************************** start - initialization of the game  *************************/
function Start() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 140;
	var food_remain = numOfBalls;
	ballsLeftToEat = numOfBalls;

	//Distribution of the balls
	var food_5 = Math.floor(numOfBalls*0.6);
	var food_15 = Math.floor(numOfBalls*0.3);
	var food_25 = Math.floor(numOfBalls*0.1);

	var numOfMonstersLeftArrangeOnBoard = numOfMonsters;
	var serialNumberOfMonsters=111 //start from 111
	var pacman_remain = 1;
	start_time = new Date();
	extraTime = 0;
	lives = 5;
	points_50_Game =true;
	 
	//gender
	typeOfGender = $("#typeOfGender").val();
	var div1 = document.getElementById('male');
	div1.style.visibility="hidden";
	var div2 = document.getElementById('female');
	div2.style.visibility="hidden";
	if(typeOfGender=='Male'){
		div1.style.visibility = "visible";
	}
	else{
		div2.style.visibility = "visible";
	}	
	

	if(!isMute){
		backgroundMusic.play();
	}
	loseSound = new Audio('./resources/loseSound.mp3');
	winSound = new Audio('./resources/winSound.mp3');
	encounterSound = new Audio('./resources/encounterSound.mp3');
	
	//direction from user
	keyUp = $("#up_key").val();
	keyDown = $("#down_key").val();
	keyRight = $("#right_key").val();
	keyLeft = $("#left_key").val();

	//Divide the game board by the identifiers of the objects
	for (var i = 0; i < 14; i++) {
		board[i] = new Array();
		for (var j = 0; j < 8; j++) {
			// place of monsters
			if(((i == 0 && j == 0) || (i == 0 && j == 7) || (i == 13 && j == 0) || (i == 13 && j == 7)) && numOfMonstersLeftArrangeOnBoard > 0){
				board[i][j] = serialNumberOfMonsters;
				serialNumberOfMonsters++;
				numOfMonstersLeftArrangeOnBoard--;
			}
			// walls
			else if((i == 4 && j == 1) || (i == 11 && j == 2) || (i == 1 && j == 2) || (i == 7 && j == 2) ||
			(i==7 && j==3) || (i==6 && j==2) || (i==5 && j==5) || (i==5 && j==6) || (i==12 && j==5) || (i==9 && j==4)||
			(i==12 && j==6) || (i==13 && j==6) || (i==2 && j==6) || (i==7 && j==6) || (i==12 && j==1)){
				board[i][j] = 4;
			}
			//Moving score - 50 point
			else if(i == 4 && j == 0){
				board[i][j] = 50;
				points_50.i = i;
				points_50.j =j;
			}
			//balls , pacman , empty
			else {
				var randomNum = Math.random();
				//balls
				if (randomNum <= (1.0 * food_remain) / cnt) { 
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
				//pacman
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt  ) { 
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 999;
				} 
				//empty
				else { 
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}

	//If there are more balls scatter on the game board
	while (food_remain > 0) {
		var findEmptyCell = findRandomEmptyCell(board);
		food_remain--;
		var num = Math.random();
		if(num < 0.6 && food_5 > 0){
			food_5--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 5;
		}
		else if(num < 0.9 && food_15 > 0){
			food_15--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 15;
		}
		else if (food_25 > 0){
			food_25--;
			board[findEmptyCell[0]][findEmptyCell[1]] = 25;
		}
	}

	// add clock , extra time
	var findEmptyCell = findRandomEmptyCell(board);
	board[findEmptyCell[0]][findEmptyCell[1]] = 10;

	// add heart , extra life
	var findEmptyCell = findRandomEmptyCell(board);
	board[findEmptyCell[0]][findEmptyCell[1]] = 20;
	
	//direction
	keysDown = {};
	addEventListener("keydown",	function(e) {
		if(e.key == keyUp)
		keysDown[keyUp] = true;
		if(e.key == keyDown)
		keysDown[keyDown] = true;
		if(e.key == keyRight)
		keysDown[keyRight] = true;
		if(e.key == keyLeft)
		keysDown[keyLeft] = true;
	},
	false
	);
	addEventListener("keyup",function(e) {
		keysDown[e.keyCode] = false;
	},
	false
	);

	//intervals
	interval = setInterval(UpdatePosition, 5);
	intervalMonsters = setInterval(monsters_Move, 700);
	intervalPoints_50 = setInterval(Points_50_Move, 650);
	intervalBoom = setInterval(Boom_Move,1500);
}

//Finds an empty cell on the game board
function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 14);
	var j = Math.floor(Math.random() * 8);
	while (board[i][j] != 0) {	
		i = Math.floor(Math.random() * 14);
		j = Math.floor(Math.random() * 8);
	}
	return [i, j];
}

//Returns the direction of the Pacman movement
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

/************************** Draw *********************************/
//Draws the objects on the game board according to the identifiers of the objects
function Draw() {
	canvas.width = canvas.width; //clean board
	showScore.value = score;
	showTime.value = time_elapsed;
	for (var i = 0; i < 14; i++) {
		for (var j = 0; j < 8; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			//place of pacman
			if (board[i][j] == 999) { 
				context.beginPath();
				context.fillStyle = pac_color; //color
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
				//context.stroke();
				context.beginPath();
				context.fillStyle = "black"; //color
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
				context.stroke();
			}
			// place of ball 5 points
			else if (board[i][j] == 5) { 
				context.beginPath();
				context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_5; //color of 5 points
				context.fill();
			}
			// place of ball 15 points
			else if (board[i][j] == 15) { 
				context.beginPath();
				context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_15; //color of 15 points
				context.fill();
			}
			// place of ball 25 points
			else if (board[i][j] == 25) { 
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBalls_25; //color of 25 points
				context.fill();
			}
			//monster1
			else if(board[i][j] == 111){ 
				var monster1Img = new Image;
				monster1.i = i;
				monster1.j = j;
				monster1Img.src = "./resources/redGhose.png";
				context.beginPath();
				context.drawImage(monster1Img,center.x - 30, center.y - 30, 60, 60 * monster1Img.height / monster1Img.width);	
			} 
			//monster2
			else if(board[i][j] == 112){ 
				var monster2Img = new Image;
				monster2.i = i;
				monster2.j = j;
				monster2Img.src = "./resources/greenGhose.png";
				context.beginPath();
				context.drawImage(monster2Img,center.x - 30, center.y - 30, 60, 60 * monster2Img.height / monster2Img.width);
			} 
			//monster3
			else if(board[i][j] == 113){ 
				var monster3Img = new Image;
				monster3.i = i;
				monster3.j = j;
				monster3Img.src = "./resources/orgGhose.png";
				context.beginPath();
				context.drawImage(monster3Img,center.x - 30, center.y - 30, 60, 60 * monster3Img.height / monster3Img.width);
			} 
			//monster4
			else if(board[i][j] == 114){
				var monster4Img = new Image;
				monster4.i = i;
				monster4.j = j;
				monster4Img.src = "./resources/blueGhose.png";
				context.beginPath();
				context.drawImage(monster4Img,center.x - 30, center.y - 30, 60, 60 * monster4Img.height / monster4Img.width);
			}
			//wall
			else if (board[i][j] == 4) {
				var wallImg = new Image;
				wallImg.src="./resources/wallwhite.PNG"
				context.beginPath();
				context.drawImage(wallImg,center.x - 30, center.y - 30, 60, 60 * wallImg.height / wallImg.width);
			}
			//clock
			else if (board[i][j] == 10) {
				var clockImg = new Image;
				clockImg.src="./resources/clock.png"
				context.beginPath();
				context.drawImage(clockImg,center.x - 30, center.y - 30, 60, 60 * clockImg.height / clockImg.width);
			}
			//heart
			else if (board[i][j] == 20) {
				var heartImg = new Image;
				heartImg.src="./resources/life.png"
				context.beginPath();
				context.drawImage(heartImg,center.x - 30, center.y - 30, 60, 60 * heartImg.height / heartImg.width);
			}
			//point_50
			else if(board[i][j] == 50 && points_50_Game){
				var point50Img = new Image;
				point50Img.src = "./resources/50points.png";
				context.beginPath();
				context.drawImage(point50Img,center.x - 30, center.y - 30, 60, 60 * point50Img.height / point50Img.width);
			}
			//boom
			else if (board[i][j] == 700){
				var boom = new Image;
				boom.src = "./resources/boom.png";		
				context.beginPath();
				context.drawImage(boom,center.x - 30, center.y - 30, 60, 60 * boom.height / boom.width);
				disapeerBoom.i = i;
				disapeerBoom.j = j;	
			}
		}
	}
}

/*************************************** move intervals *****************************************/
function monsters_Move() {
	if (numOfMonsters == 1) {
		if (UpdateMonsterLocation(monster1) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			GhostEatPacman();
			board[0][0] = 111;
		}
	}
	else if (numOfMonsters == 2) {
		if (UpdateMonsterLocation(monster1) == false || UpdateMonsterLocation(monster2) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			GhostEatPacman();
			board[0][0] = 111;
			board[0][7] = 112;
		}
	}
	else if (numOfMonsters == 3) {
		if (UpdateMonsterLocation(monster1) == false || UpdateMonsterLocation(monster2) == false || UpdateMonsterLocation(monster3) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			GhostEatPacman();
			board[0][0] = 111;
			board[0][7] = 112;
			board[13][0] = 113;
		}
	}
	else if (numOfMonsters == 4) {
		if (UpdateMonsterLocation(monster1) == false || UpdateMonsterLocation(monster2) == false || UpdateMonsterLocation(monster3) == false || UpdateMonsterLocation(monster4) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			board[monster4.i][monster4.j] = monster4.notSeen;
			GhostEatPacman();
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
	if(points_50_Game && UpdateExtraPointLocation(points_50) == false){ //pacman eat 50 points
		board[points_50.i][points_50.j] = 0;
		points_50_Game = false;
		score = score +50 +points_50.notSeen;
		points_50.notSeen = 0;
	}
}

/*************************************** Update Positions *****************************************/
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
		monsters_Move();
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
	else if(board[shape.i][shape.j] == 20){ //extra life
		lives+= 1;
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

	//lose or win
	if(lives == 0){ //lose
		backgroundMusic.pause();
		backgroundMusic.currentTime = 0;
		if(!isMute){
			loseSound.play();
		}
		window.alert("Loser!");
		window.clearInterval(interval);
		window.clearInterval(intervalMonsters);
		window.clearInterval(intervalPoints_50);
		window.clearInterval(intervalBoom);
	}
	else if (time_elapsed <= 0.00){
		if (score < 100){ //lose
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0;
			if(!isMute){
				loseSound.play();
			}
			window.alert("You are better than " + score + " points!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalPoints_50);
			window.clearInterval(intervalBoom);
		}
		else{ //win
			backgroundMusic.pause();
			backgroundMusic.currentTime = 0;
			if(!isMute){
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

//Lowering lives and points due to collisions with a monster
function GhostEatPacman(){
	board[shape.i][shape.j] = 700;
	if(!isMute){
		encounterSound.play();
	}
	lives--;
	score = score - 10;
	var findEmptyCell = findRandomEmptyCell(board);
	shape.i = findEmptyCell[0];
	shape.j = findEmptyCell[1];
	board[shape.i][shape.j] = 999;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
}


function UpdateMonsterLocation(monster){	
	var position_i = monster.i;
	var position_j = monster.j;
	var distance_minimum = 100;
	var distance;
	//check left move
	// can not move if there is : end of board, wall, other monster, clock, heart, 50 coin 
	if(monster.i > 0 && board[monster.i-1][monster.j] != 4 && board[monster.i-1][monster.j] != 10 && board[monster.i-1][monster.j] != 20 && board[monster.i-1][monster.j] < 50
		 && board[monster.i-1][monster.j] < 111 && board[monster.i-1][monster.j] < 112 && board[monster.i-1][monster.j] < 113 && board[monster.i-1][monster.j] < 114){
		distance =  Math.sqrt( Math.pow(monster.i-1-shape.i,2) + Math.pow(monster.j-shape.j,2));
		if(distance < distance_minimum){
			distance_minimum = distance;
			position_i=monster.i-1;
			position_j=monster.j;
		}
	}
	//check right move
	if(monster.i < 13 && board[monster.i+1][monster.j] != 4 && board[monster.i+1][monster.j] != 10 && board[monster.i+1][monster.j] != 20 && board[monster.i+1][monster.j] != 50
		&& board[monster.i+1][monster.j] != 111 && board[monster.i+1][monster.j] != 112 && board[monster.i+1][monster.j] != 113 && board[monster.i+1][monster.j] != 114){
		distance =  Math.sqrt( Math.pow(monster.i+1-shape.i,2) + Math.pow(monster.j-shape.j,2));
		if(distance < distance_minimum){
			distance_minimum = distance;
			position_i=monster.i+1;
			position_j=monster.j;
		}
	}
	//check up move
	if(monster.j > 0 && board[monster.i][monster.j-1] != 4 && board[monster.i][monster.j-1] != 10 && board[monster.i][monster.j-1] != 20  && board[monster.i][monster.j-1] !=50
		&& board[monster.i][monster.j-1] != 111  && board[monster.i][monster.j-1] != 112  && board[monster.i][monster.j-1] != 113  && board[monster.i][monster.j-1] != 114){
		distance =  Math.sqrt( Math.pow(monster.i-shape.i,2) + Math.pow(monster.j-1-shape.j,2));
		if(distance < distance_minimum){
			distance_minimum = distance;
			position_i=monster.i;
			position_j=monster.j-1;
		}
	}
	//check down move
	if(monster.j < 7 && board[monster.i][monster.j+1] != 4 && board[monster.i][monster.j+1] != 10 && board[monster.i][monster.j+1] != 20 &&  board[monster.i][monster.j+1] != 50 &&
		board[monster.i][monster.j+1] != 111 && board[monster.i][monster.j+1] != 112 && board[monster.i][monster.j+1] != 113&& board[monster.i][monster.j+1] != 114){
		distance =  Math.sqrt( Math.pow(monster.i-shape.i,2) + Math.pow(monster.j+1-shape.j,2));
		if(distance < distance_minimum){
			distance_minimum = distance;
			position_i=monster.i;
			position_j=monster.j+1;
		}
	}	
	board[monster.i][monster.j] = monster.notSeen;
	//update new position
	monster.i = position_i;
	monster.j = position_j;
	if (board[monster.i][monster.j] == 999) {	//pacman and monster meet
		return false; 
	}
	else if (board[monster.i][monster.j] == 0 || board[monster.i][monster.j] == 5 || board[monster.i][monster.j] == 15 || board[monster.i][monster.j] == 25) {	
		monster.notSeen = board[monster.i][monster.j];
	}
	board[monster.i][monster.j] = monster.id;
	return true;
}


//extra points coin moves away from pacman by this algorithm
//we think that this way is more challenging then regular random move 
function UpdateExtraPointLocation(points_50){	
	var position_i = points_50.i;
	var position_j = points_50.j;
	var distance_maximum = 0;
	var distance;
	//check left move
	// can not move if there is : end of board, wall, other monster, clock, heart, 50 coin 
	if(points_50.i > 0 && board[points_50.i-1][points_50.j] != 4 && board[points_50.i-1][points_50.j] != 10 && board[points_50.i-1][points_50.j] != 20 && board[points_50.i-1][points_50.j] < 50
		 && board[points_50.i-1][points_50.j] < 111 && board[points_50.i-1][points_50.j] < 112 && board[points_50.i-1][points_50.j] < 113 && board[points_50.i-1][points_50.j] < 114){
		distance =  Math.sqrt( Math.pow(points_50.i-1-shape.i,2) + Math.pow(points_50.j-shape.j,2));
		if(distance > distance_maximum){
			distance_maximum = distance;
			position_i=points_50.i-1;
			position_j=points_50.j;
		}
	}
	//check right move
	if(points_50.i < 13 && board[points_50.i+1][points_50.j] != 4 && board[points_50.i+1][points_50.j] != 10 && board[points_50.i+1][points_50.j] != 20 && board[points_50.i+1][points_50.j] != 50
		&& board[points_50.i+1][points_50.j] != 111 && board[points_50.i+1][points_50.j] != 112 && board[points_50.i+1][points_50.j] != 113 && board[points_50.i+1][points_50.j] != 114){
		distance =  Math.sqrt( Math.pow(points_50.i+1-shape.i,2) + Math.pow(points_50.j-shape.j,2));
		if(distance > distance_maximum){
			distance_maximum = distance;
			position_i=points_50.i+1;
			position_j=points_50.j;
		}
	}
	//check up move
	if(points_50.j > 0 && board[points_50.i][points_50.j-1] != 4 && board[points_50.i][points_50.j-1] != 10 && board[points_50.i][points_50.j-1] != 20  && board[points_50.i][points_50.j-1] !=50
		&& board[points_50.i][points_50.j-1] != 111  && board[points_50.i][points_50.j-1] != 112  && board[points_50.i][points_50.j-1] != 113  && board[points_50.i][points_50.j-1] != 114){
		distance =  Math.sqrt( Math.pow(points_50.i-shape.i,2) + Math.pow(points_50.j-1-shape.j,2));
		if(distance > distance_maximum){
			distance_maximum = distance;
			position_i=points_50.i;
			position_j=points_50.j-1;
		}
	}
	//check down move
	if(points_50.j < 7 && board[points_50.i][points_50.j+1] != 4 && board[points_50.i][points_50.j+1] != 10 && board[points_50.i][points_50.j+1] != 20 &&  board[points_50.i][points_50.j+1] != 50 &&
		board[points_50.i][points_50.j+1] != 111 && board[points_50.i][points_50.j+1] != 112 && board[points_50.i][points_50.j+1] != 113&& board[points_50.i][points_50.j+1] != 114){
		distance =  Math.sqrt( Math.pow(points_50.i-shape.i,2) + Math.pow(points_50.j+1-shape.j,2));
		if(distance > distance_maximum){
			distance_maximum = distance;
			position_i=points_50.i;
			position_j=points_50.j+1;
		}
	}	
	board[points_50.i][points_50.j] = points_50.notSeen;
	//update new position
	points_50.i = position_i;
	points_50.j = position_j;
	if (board[points_50	.i][points_50.j] == 999) {	//pacman eat point 50 coin
		return false; 
	}
	else if (board[points_50.i][points_50.j] == 0 || board[points_50.i][points_50.j] == 5 || board[points_50.i][points_50.j] == 15 || board[points_50.i][points_50.j] == 25) {	
		points_50.notSeen = board[points_50.i][points_50.j];
	}
	board[points_50.i][points_50.j] = points_50.id;
	return true;
}


function isMonster(monster){
	if(monster.id == 101 || monster.id == 102 || monster.id == 103 || monster.id == 104){
		return true;
	}
	return false;
}
		

