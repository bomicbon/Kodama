var theGame = function(game){
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
	
	jumpVelocity = -475;
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
	levelI = 110; //space between levels
	level0 = 690;
	level1 = level0-levelI;
	level2 = level1-levelI;
	level3 = level2-levelI;
	level4 = level3-levelI;
	level5 = level4-levelI;
	level6 = level5-levelI;
}

theGame.prototype = {
  	create: function(){
  		
  		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		number = Math.floor(Math.random()*10);
		player = this.game.add.sprite(playerX,playerY,"player");
		player.anchor.setTo(0.5,0.5);
		cursors = this.game.input.keyboard.createCursorKeys();
		this.game.world.setBounds(0, 0, worldWidth, worldHeight);
		this.game.physics.arcade.enable(player);
		player.scale.setTo(1.3, 1.3);
		this.game.camera.follow(player);
		player.body.bounce.y = 0.1;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;

		player.health = playerHealth;
		
		
	// Ground Code
		ground = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			ground.create(300 * i, level0, 'ground'); // ground
		}
		
		//platforms before wall 1
		ground.create(600, level1, 'platformM'); //up arrow jump tutorial image next to this, also space image to attack first monster 

		ground.create(820, level2, 'platformM'); 
		ground.create(1000, level1, 'platformL'); 
		ground.create(1300, level2, 'platformL'); 
		ground.create(1900, level2, 'platformM'); 
		ground.create(2200, level1, 'platformL'); 
		ground.create(2450, level2, 'platformM'); 
		ground.create(2850, level1, 'platformS'); 
		ground.create(3400, level2, 'platformS'); 
		
		ground.setAll('body.immovable', true);
	
		
		// Animal Code
		animal = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			animal.create(800+1500*i, 470, 'animal');
		}
		
		//Follower Code
		followerSystem = new FollowerSystem(this.game, player, jumpVelocity, ground);
		followerSystem.create();
		
		//watering can melee code
		wcMelee = new wateringcanMelee(this.game, player, ground);
		wcMelee.create();

  	    //watering can shooter code
		wcShooter = new wateringcanShooter(this.game, player, ground);
		wcShooter.create();
		
		//oils group
		oilG = new oilGroup(this.game, player, ground);
		oilG.create();
		
		//gas Group
		gasG = new gasGroup(this.game, player);
		gasG.create();
		
		//tree Group
		treeG = new treeGroup(this.game, player, wcShooter, ground);
		treeG.create();

  	    //damage system code
		enemyGroup.push(oilG);
		enemyGroup.push(gasG);
		projGroup.push(wcShooter);
		projGroup.push(wcMelee);
		dmgSystem = new DamageSystem(this.game, player, enemyGroup, projGroup);
		
		//enemy code
		enemies = new enemy(this.game, ground);
		enemies.create();
		
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
		temperature_reading.setText(temperature);
        //E: used fixedToCamera instead
		//temperature_reading.x = this.game.camera.x + 550;
		//temperature_reading.y = this.game.camera.y + 50;
		
		
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
		oilG.update();
		gasG.update();
		followerSystem.update();
		wcShooter.update();
		wcMelee.update();
		enemies.update();
		treeG.update();
		dmgSystem.update();
	}
	
}