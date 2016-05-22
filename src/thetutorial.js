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
    	
    	// World Settings
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, worldWidth, worldHeight);
		number = Math.floor(Math.random()*10);
		
		// Player Attributes
		player = this.game.add.sprite(playerX,playerY,"player");
		this.game.physics.arcade.enable(player);
		this.game.camera.follow(player);
		player.anchor.setTo(0.5,0.5);
		player.scale.setTo(1.3, 1.3);
		player.body.bounce.y = 0.1;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;
		player.health = playerHealth;
		
		cursors = this.game.input.keyboard.createCursorKeys();
		
		// Ground Code
		ground = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			ground.create(300 * i, level0, 'ground'); // ground
		}
		ground.setAll('body.immovable', true);
		
		//watering can melee code
		wcMelee = new wateringcanMelee(this.game, player, ground);
		wcMelee.create();

  	    //watering can shooter code
		wcShooter = new wateringcanShooter(this.game, player, ground);
		wcShooter.create();
		
		//tree Group
		treeG = new treeGroup(this.game, player, wcShooter);
		treeG.create();
		
		temperature_reading = this.game.add.text(this.game.camera.x+550, this.game.camera.y+50, temperature, {
  			font: "65px Arial",
  			fill: "000000",
  			align: "center"
  		});
		temperature_reading.anchor.setTo(0.5, 0.5);
		temperature_reading.fixedToCamera = true;
    },
    update: function() {
        pollution_timer++;
		if (pollution_timer == 500) {
			temperature += 1;
			pollution_timer = 0;
		}
		temperature_reading.setText(temperature-treeG.delta);
        //E: used fixedToCamera instead
		//temperature_reading.x = this.game.camera.x + 550;
		//temperature_reading.y = this.game.camera.y + 50;
		if(treeG.all_watered) {
			treeG.all_watered = false;
			this.game.state.start("StageCleared", true, false, score);
		}
		
		
		//this.game.stage.backgroundColor =  8762849 + pollution_timer + 10*temperature;
	    this.game.physics.arcade.collide(player, ground);
		player.body.velocity.x = 0;
		if(cursors.left.isDown && cursors.right.isDown) {
			//
		}
		else if(cursors.left.isDown) {
			player.body.velocity.x = -playerSpeed;
			faceRight = false;
		}
		else if(cursors.right.isDown) {
			player.body.velocity.x = playerSpeed;
			faceRight = true;
		}
		else {
			//put idle animation in here
		}
		
		if (cursors.up.isDown && player.body.touching.down) {
			player.body.velocity.y = jumpVelocity;
		}

		if (player.health <= 0) {
			this.game.state.start("GameOver", true, false, score);
		    //this.game.state.start("GameTitle");
		}
		
		//Enemies update needs to be before the follower update
		//oilG.update();
		//gasG.update();
		//followerSystem.update();
		wcShooter.update();
		wcMelee.update();
		//enemies.update();
		treeG.update();
		//dmgSystem.update();
    },
}