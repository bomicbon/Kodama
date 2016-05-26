var theGame = function(game){
	player = null;
	pipesmoke = null;
	score = 0;
	pollution_timer = 0;
	temperature_reading = null;
	startingTemp = 65;
	
	cursors = null;
	ground = null;
	followerSystem = null;
	flower = null;
	animal = null;
	faceRight = true;
	
	jumpVelocity = -500;
	
	gravity = 1000;
	worldWidth = 4200;
	worldHeight = 720;

	playerSpeed = 250;
	playerX = 10;
	playerY = 650;
	playerHealth = 100;

	wcShooter = null;
	
	slimeG = null;
	slimeSystem = null;
	gasG = null;
	gasSystem = null;
	treeG = null;
	dmgSystem = null;
	projGroup = [];
	enemyGroup = [];
	
	boss = null;
	
	//platform y values
	levelI = 115; //space between levels
	level0 = 690;
	level1 = level0-levelI;
	level2 = level1-levelI;
	
	// Tutorial Arrows
	R_arrow = null;
	L_arrow = null;
	U_arrow = null;
	arrow_x = 150;
	arrow_y = 600;
	arrow_alpha = 1.0; // how transparent when they appear (1.0 is max)
	
	// Sounds
	sound_shoot = null;
	sound_shootM = null;
	sound_shootL = null;
	sound_shootXL = null;
	sound_footstep = null;
	sound_tree_healed = null;
	
	//Health Bar
	this.myHealthBar = null;
	barConfig = null;
	health_bar_border = null;
	
	// Toxicity Bar
	this.myToxicityBar = null;
	t_barConfig = null;
}

theGame.prototype = {
  	create: function(){
  		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		number = Math.floor(Math.random()*10);
		player = this.game.add.sprite(playerX,playerY,'player');
		player.anchor.setTo(0.5,0.5);
		cursors = this.game.input.keyboard.createCursorKeys();
		this.game.world.setBounds(0, 0, worldWidth, worldHeight);
		this.game.physics.arcade.enable(player);
		player.scale.setTo(1, 1);
		player.body.syncBounds = false;
		this.game.camera.follow(player);
		player.body.bounce.y = 0.1;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;
		player.health = playerHealth;
		
		this.setAnimations();
		
		temperature_reading = this.game.add.text(this.game.camera.x+550, this.game.camera.y+50, startingTemp, {
  			font: "1px Arial", //TOXICITY BAR
  			fill: "000000",
  			align: "center"
  		});
		//.temp is the current temp
		temperature_reading.temp = startingTemp;
		//nTemp is used for getting the initial temperature when temp_reading is passed to a function
		temperature_reading.nTemp = startingTemp;
		temperature_reading.anchor.setTo(0.5, 0.5);
		temperature_reading.fixedToCamera = true;
		
		
	// Ground Code
		ground = this.game.add.physicsGroup();
		//E: use ground length to determine how far the ground goes
		var groundLength = 15;
		for (var i = 0; i < groundLength; i++) {
			ground.create(300 * i, level0, 'ground'); // ground
			this.add.sprite(300 * i, level0-groundLength,"groundI");
		}
		
		//"real" platform is the center image, its background image surrounds it
		this.add.sprite(598, level1-15,"platformIM");
		ground.create(600, level1, 'platformM'); //up arrow jump tutorial image next to this, also space image to attack first monster 
		this.add.sprite(818, level2-15,"platformIM");
		ground.create(820, level2, 'platformM'); 
		this.add.sprite(1098, level1-15,"platformIS");
		ground.create(1100, level1, 'platformS'); 
		this.add.sprite(1298, level2-15,"platformIS");
		ground.create(1300, level2, 'platformS'); 
		this.add.sprite(1898, level2-15,"platformIM");
		ground.create(1900, level2, 'platformM'); 
		this.add.sprite(2198, level1-15,"platformIL");
		ground.create(2200, level1, 'platformL'); 
		this.add.sprite(2448, level2-15,"platformIM");
		ground.create(2450, level2, 'platformM'); 
		this.add.sprite(2848, level1-15,"platformIS");
		ground.create(2850, level1, 'platformS'); 
		this.add.sprite(3398, level2-15,"platformIS");
		ground.create(3400, level2, 'platformS'); 
		
		ground.setAll('body.immovable', true);
		ground.setAll('body.checkCollision.down', false);
		ground.setAll('body.checkCollision.left', false);
		ground.setAll('body.checkCollision.right', false);
		
		//pipe smoke
		/*
		pipesmoke = this.add.sprite(200, level1, 'pipesmoke');
		pipesmoke.animations.add('pipesmoke', true);
        pipesmoke.animations.play('pipesmoke');    */

  	    //watering can shooter code
		wcShooter = new wateringcanShooter(this.game, player, ground, temperature_reading);
		wcShooter.create();
		
		//slimes group
		slimeG = new slimeGroup(this.game, player, ground);
		slimeG.create();
		
		//slime Syste
		slimeSystem = new slimeSpawner(this.game, player, slimeG, wcShooter);
		slimeSystem.create();
		
		//gas Group
		gasG = new gasGroup(this.game, player);
		gasG.create();
		
		//gas system
		gasSystem = new gasSpawnerSystem(this.game, gasG, wcShooter);
		gasSystem.create();
		
		//tree Group
		treeG = new treeGroup(this.game, player, wcShooter, slimeG.enemyGroup, gasG.enemyGroup, temperature_reading);
		treeG.create();

  	    //damage system code
		enemyGroup.push(slimeG);
		enemyGroup.push(gasG);
		projGroup.push(wcShooter);
		//projGroup.push(wcMelee);
		dmgSystem = new DamageSystem(this.game, player, enemyGroup, projGroup);
		
		//enemy code
		//enemies = new enemy(this.game, ground);
		//enemies.create();
		
		//boss code
		boss = new Boss(this.game, player, wcShooter, gasSystem, slimeG, treeG);
		
		// Sounds
		sound_footstep = this.game.add.audio('footstep');
		sound_shoot = this.game.add.audio('shoot');
		sound_shootM = this.game.add.audio('shootM');
		sound_shootL = this.game.add.audio('shootL');
		sound_shootXL = this.game.add.audio('shootXL');
		sound_tree_healed = this.game.add.audio('tree_healed');
		
		// Tutorial Arrows
		R_arrow = this.game.add.sprite(arrow_x, arrow_y, 'right_arrow');
		L_arrow = this.game.add.sprite(arrow_x, arrow_y, 'left_arrow');
		U_arrow = this.game.add.sprite(arrow_x, arrow_y, 'up_arrow');
		R_arrow.scale.setTo(1.0, 1.0);
		L_arrow.scale.setTo(1.0, 1.0);
		U_arrow.scale.setTo(1.0, 1.0);
		R_arrow.anchor.setTo(0.5, 0.5);
		L_arrow.anchor.setTo(0.5, 0.5);
		U_arrow.anchor.setTo(0.5, 0.5);
		R_arrow.alpha = 0;
		L_arrow.alpha = 0;
		U_arrow.alpha = 0;
		
		// Health Bar border
		health_bar_border = this.game.add.sprite(this.game.camera.x+140, this.game.camera.y+30, 'health_bar_border');
		health_bar_border.scale.setTo(0.95, 0.4);
		health_bar_border.anchor.setTo(0.5, 0.5);
		health_bar_border.alpha = 0.9;
		health_bar_border.fixedToCamera = true;
		
		//Health Bar Configurations
		var barConfig = {
			x: this.game.camera.x+140, 
			y: this.game.camera.y+30,
			width: 250,
		    height: 8,
		    bg: {
		      color: '#A3A3A3'
		    },
		    bar: {
		      color: '#5CD683'
		    },
		    animationDuration: 200,
		    flipped: false
			
		};
		
		// Health Bar Initializations
    	this.myHealthBar = new HealthBar(this.game, barConfig);
    	this.myHealthBar.setPercent(player.health);
    	this.myHealthBar.setFixedToCamera(true);
    	
    	// Toxicity Bar Configurations
    	var t_barConfig = {
    		x: this.game.camera.x+510,
    		y: this.game.camera.y+30,
    		width: 200,
    		height: 7,
    		bg: {
    			color: '#A3A3A3'
    		},
    		bar: {
    			color: '#CC2F2F'
    		},
    		animationDuration: 200,
    		flipped: true
    	};
    	this.myToxicityBar = new HealthBar(this.game, t_barConfig);
    	this.myToxicityBar.setPercent(100*temperature_reading.temp/80);
    	this.myToxicityBar.setFixedToCamera(true);
	},
	update: function() {
		
		//this.game.stage.backgroundColor =  8762849 + pollution_timer + 10*temperature;
	    this.game.physics.arcade.collide(player, ground);
		
		//player.knocked is used to stop the player from moving while in the "knocked" state
		//set knocked to true when it gets hurt and generate knockback with like velocity
		if(player.body.touching.down) {
			player.knocked = false;
		}
		if(player.knocked == false) {
			player.body.velocity.x = 0;
			var minSpeed = boss.speed + 10;
			if(cursors.left.isDown && cursors.right.isDown) {
			
			}
			else if(cursors.left.isDown) {
				player.body.velocity.x = -playerSpeed + (temperature_reading.temp - startingTemp) * 2;
				if(player.body.velocity.x > -minSpeed) {
					player.body.velocity.x = -minSpeed;
				}
				faceRight = false;
				player.animations.play('walk_left'); 
				L_arrow.alpha = arrow_alpha; // Tutorial Arrow
				
			}
			else if(cursors.right.isDown) {
				player.body.velocity.x = playerSpeed - (temperature_reading.temp - startingTemp) * 2;
				if(player.body.velocity.x < minSpeed) {
					player.body.velocity.x = minSpeed;
				}
				faceRight = true;
        		player.animations.play('walk_right'); 
        		R_arrow.alpha = arrow_alpha; // Tutorial Arrow
			}
			else {
				//put idle animation in here
				// Tutorial Arrows
				R_arrow.alpha = 0;
				L_arrow.alpha = 0;
			}
			
			if (cursors.up.isDown && player.body.touching.down) {
				player.body.velocity.y = jumpVelocity;
			}
			
			// Tutorial Arrows
			if(player.body.y<620) {
				U_arrow.alpha = arrow_alpha;
			}
			else {
				U_arrow.alpha = 0;
			}
		}
		
		if(player.body.x > boss.startPosition - 200) {
			boss.create();
		}

		if (player.health < 1) {
			this.game.state.start("GameOver", true, false, score);
		    //this.game.state.start("GameTitle");
		}
		
		
		if (faceRight && !cursors.left.isDown && !cursors.right.isDown)
			player.animations.play('idle_right'); 
		else if (!faceRight && !cursors.left.isDown && !cursors.right.isDown)
			player.animations.play('idle_left'); 
		//Enemies update needs to be before the follower update
		
		slimeG.update();
		slimeSystem.update();
		gasG.update();
		gasSystem.update();
		//followerSystem.update();
		wcShooter.update();
		//wcMelee.update();
		//enemies.update();
		treeG.update();
		dmgSystem.update();
		
		boss.update();
		
		pollution_timer++;
		if (pollution_timer == 300) {
			temperature_reading.temp += 1;
			pollution_timer = 0;
		}
		temperature_reading.setText(temperature_reading.temp);
		
		
		
		// Sound
		if (temperature_reading.temp<temperature_reading.nTemp && temperature_reading.temp > 45) {
			if(wcShooter.shot == true) {
				sound_shootM.play();
			}
		}
		else if (temperature_reading.temp < 45 && temperature_reading.temp > 25) {
			if (wcShooter.shot) {
				sound_shootL.play();
			}
		}
		else if (temperature_reading.temp < 25 && temperature_reading.temp > 5) {
			if (wcShooter.shot) {
				sound_shootXL.play()
			}
		}
		else if (wcShooter.shot) {
			sound_shoot.play();
		}
		//Urian i cant take this shot noise
		//if (wcShooter.shot == true) {
	//		sound_shoot.play();
//		}
		//Also this should go under the tree class
		
		// RE: THIS is the tree Healed sound. 
		// For some reason I haven't been able to fit the sound code in their respective js files
		// Thats why they are here.
		
		if (treeG.tree_healed) {
			sound_tree_healed.play();
			sound_delay++;
			if (sound_delay > sound_length) {
				treeG.tree_healed = false;
			}
		}
		// Updating Bars
		this.myHealthBar.setPercent(player.health);
		this.myToxicityBar.setPercent(100*temperature_reading.temp/80);
		
	},
	
	
	 setAnimations: function() {
        // Animations
        player.animations.add('walk_right', [0, 1, 2, 3, 2, 1], 15, true); 
        player.animations.add('idle_right', [4, 5, 6, 7, 6, 5, 4], 10, true); 
        player.animations.add('walk_left', [12, 13, 14, 15, 14, 13], 15, true); 
        player.animations.add('idle_left', [8, 9, 10, 11, 10, 9], 10, true); 
    },
    
}