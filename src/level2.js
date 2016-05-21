var level_Two = function(game) {
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
	worldWidth = 600*2;
	worldHeight = 480;
	playerSpeed = 250;
	playerX = 10;
	playerY = 300;
	playerHealth = 100;
	wcShooter = null;
	oilG = null;
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
level_Two.prototype = {
    create: function() {
        // World Settings
        this.game.physics.startSystem(Phaser.Physics.ARCADE); 
        this.game.world.setBounds(0, 0, worldWidth, worldHeight);
		
		// Player Attributes
		player = this.game.add.sprite(playerX,playerY,"player");
		this.game.camera.follow(player); // Camera
		this.game.physics.arcade.enable(player); // Physics
		player.anchor.setTo(0.5,0.5); // Center 
		player.scale.setTo(1.3, 1.3); // Scale
		player.body.bounce.y = 0.1; // Bounciness
		player.body.gravity.y = gravity; // Gravity
		player.body.collideWorldBounds = true; // Collision
		player.health = playerHealth; // Health
		
		// Player Input
		cursors = this.game.input.keyboard.createCursorKeys();
		number = Math.floor(Math.random()*10);
		
		// Flower Code
		for (var i = 0; i < 12; i++) {
		    flower = this.game.add.sprite(100*i, 560, 'flower');
		    flower.anchor.setTo(0.5, 0.5);
		    flower.scale.setTo(2.0, 2.0);
		}
		// Flower Code
		for (var i = 0; i < 12; i++) {
		    flower = this.game.add.sprite(100*i, 560, 'flower');
		    flower.anchor.setTo(0.5, 0.5);
		    flower.scale.setTo(1.0, 1.0);
		}
		// Grounds
		ground = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			ground.create(300 * i, level0, 'ground'); // ground
		}
		ground.setAll('body.immovable', true);
    },
    update: function() {
        
        // Player Movement
        this.game.physics.arcade.collide(player, ground);
        player.body.velocity.x = 0; // doesn't slide
		if(cursors.left.isDown && cursors.right.isDown) {} // Do Nothing
		// Move Left
		if(cursors.left.isDown) {
			player.body.velocity.x = -playerSpeed;
			faceRight = false;
		}
		// Move Right
		else if(cursors.right.isDown) {
			player.body.velocity.x = playerSpeed;
			faceRight = true;
		}
		// IDLE ANIMATION
		else {}
		// Jump
		if (cursors.up.isDown && player.body.touching.down) {
			player.body.velocity.y = jumpVelocity;
		}
		// Death
		if (player.health <= 0) {
			this.game.state.start("GameOver", true, false, score);
		    //this.game.state.start("GameTitle");
		}
    },
}