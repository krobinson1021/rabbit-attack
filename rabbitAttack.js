"use strict";

onload = function myGame(){

	// creating canvas
	let canvas = document.getElementsByTagName("canvas")[0];
	let ctx = canvas.getContext("2d");
	let canvasWidth = 700;
	let canvasHeight = 450;

	// creating knight
	let playerSprite = new Image();
	playerSprite.src = "knightSprite.png";

	// creating array of killer rabbits
	let enemySpeed = 5;
	let allEnemySprites = [];
	for (let i = 0; i < 5; i++) {
		let enemySprite = new Image();
		enemySprite.src = "whiteRabbitSprite.png";
		allEnemySprites.push({object:enemySprite, x:0, y:0});
	}
	
	// preparing for demise
	let murderCountdown = 0;
	let jumpScareScream;
	let rabbitCarnage = new Image();
	rabbitCarnage.src = "rabbit.jpg";

	// tracking mouse position
	let mouseX;
	let mouseY;
	canvas.addEventListener("mousemove", function(event){
		mouseX = event.x - 15; // subtracting 15 gets mouse closer to knight's head
		mouseY = event.y - 15;
	});

	// randomizing rabbits' initial positions
	for (let i = 0; i < allEnemySprites.length; i++) {
		allEnemySprites[i].x = Math.floor((Math.random() * canvasWidth) + 1);
		allEnemySprites[i].y = Math.floor((Math.random() * canvasHeight) + 1);
	}

	// helper function to display display endgame screen
	let displayDeathScreen = function(position) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		ctx.font = "bold 40px Helvetica";
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.fillText("YOU DIED", canvas.width/2, canvas.height/2-100); 

		ctx.font = "20px Helvetica";
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.fillText("It was not a flesh wound.", canvas.width/2, canvas.height/2+80); 

		ctx.drawImage(rabbitCarnage,canvas.width/2-105,canvas.height/2-80);
		jumpScareScream = new Audio("wilhelmScream.mp3");
		jumpScareScream.play();
	};

	// helper function to clear canvas
	let clearCanvas = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.drawImage(playerSprite,mouseX,mouseY,50,126);
	};

	// function that updates positions, checks for collisions, and redraws all sprites
	let draw = function(){
		clearCanvas();

		for (let i = 0; i < allEnemySprites.length; i++) {
			// update position (randomizer minimizes clustering of rabbits)
			let randomizer = Math.floor((Math.random() * 3) - 5);
			if (allEnemySprites[i].x < mouseX) {
				allEnemySprites[i].x += (enemySpeed + randomizer);
			} else {
				allEnemySprites[i].x -= (enemySpeed + randomizer);
			}
			if (allEnemySprites[i].y < mouseY) {
				allEnemySprites[i].y += (enemySpeed + randomizer);
			} else {
				allEnemySprites[i].y -= (enemySpeed + randomizer);
			}

			// update jumpscare "timer"
			murderCountdown++;
			if (murderCountdown > (3000 + Math.floor(Math.random()*2000))) {
				enemySpeed = 30;
			}

			// redraw sprites
			ctx.drawImage(allEnemySprites[i].object, allEnemySprites[i].x, allEnemySprites[i].y);

			// detect collisions
			let distance = Math.sqrt(Math.pow(mouseX-allEnemySprites[i].x,2)) + Math.pow(mouseY-allEnemySprites[i].y,2);
			if (distance < 4) {
				displayDeathScreen();
				return;
			}
		}
		window.requestAnimationFrame(draw);
	};
	window.requestAnimationFrame(draw);
};