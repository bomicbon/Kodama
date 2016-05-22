var theTutorial = function(game) {
    player = null;
	score = 0;
	temperature = 60;
	pollution_timer = 0;
	temperature_reading = null;
	cursors = null;
	ground = null;
	followerSystem = null;
	flower = null;
	animal = null;
	faceRight = true;
	attackDelay = true; //prevent spamming different type of attacks
	jumpVelocity = -450;
	//jumpV should be -435 on first heatup so that bonus platforms cannot be reached
	gravity = 1000;
	worldWidth = 3800;
	worldHeight = 720;
	playerSpeed = 250;
	playerX = 10;
	playerY = 650;
	playerHealth = 100;
	wcShooter = null;
	oilG = null;
	gasG = null;
	treeG = null;
	dmgSystem = null;
	projGroup = [];
	enemyGroup = [];
	//platform y values
	levelI = 90; //space between levels
	level0 = 690;
	level1 = level0-levelI;
	level2 = level1-levelI;
	level3 = level2-levelI;
	level4 = level3-levelI;
	level5 = level4-levelI;
	level6 = level5-levelI;
}
theTutorial.prototype = {
    create: function() {
        
    },
    update: function() {
        
    },
}