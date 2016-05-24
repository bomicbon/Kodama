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
		player.scale.setTo(1, 1);
		player.body.syncBounds = false;
		this.game.camera.follow(player);
		player.body.bounce.y = 0.1;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;
		
		temperature = 60;

		player.health = playerHealth;
		
		
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
	
		
		// Animal Code
		/*
		animal = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			animal.create(800+1500*i, 470, 'animal');
		}
		*/
		
		//Follower Code
		//followerSystem = new FollowerSystem(this.game, player, jumpVelocity, ground);
		//followerSystem.create();
		
		//watering can melee code
		//wcMelee = new wateringcanMelee(this.game, player, ground);
		//wcMelee.create();

  	    //watering can shooter code
		wcShooter = new wateringcanShooter(this.game, player, ground, temperature);
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
		treeG = new treeGroup(this.game, player, wcShooter, slimeG.enemyGroup, temperature);
		treeG.create();

  	    //damage system code
		enemyGroup.push(slimeG);
		enemyGroup.push(gasG);
		projGroup.push(wcShooter);
		//projGroup.push(wcMelee);
		dmgSystem = new DamageSystem(this.game, player, enemyGroup, projGroup);
		
		//enemy code
		enemies = new enemy(this.game, ground);
		enemies.create();
		
		//boss code
		boss = new Boss(this.game, player, wcShooter, gasSystem, slimeG, treeG.treeGroup);
		
		temperature_reading = this.game.add.text(this.game.camera.x+550, this.game.camera.y+50, temperature, {
  			font: "65px Arial",
  			fill: "000000",
  			align: "center"
  		});
		temperature_reading.anchor.setTo(0.5, 0.5);
		temperature_reading.fixedToCamera = true;
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
			//
			}
			else if(cursors.left.isDown) {
				player.body.velocity.x = -playerSpeed + (temperature - 60) * 2;
				if(player.body.velocity.x > -minSpeed) {
					player.body.velocity.x = -minSpeed;
				}
				faceRight = false;
			}
			else if(cursors.right.isDown) {
				player.body.velocity.x = playerSpeed - (temperature - 60) * 2;
				if(player.body.velocity.x < minSpeed) {
					player.body.velocity.x = minSpeed;
				}
				faceRight = true;
			}
			else {
				//put idle animation in here
			}
			
			if (cursors.up.isDown && player.body.touching.down) {
				player.body.velocity.y = jumpVelocity;
			}
		}
		
		if(player.body.x > boss.startPosition - 200) {
			boss.create();
		}

		if (player.health < 1) {
			this.game.state.start("GameOver", true, false, score);
		    //this.game.state.start("GameTitle");
		}
		
		if (faceRight == true)
			player.loadTexture('player');
		else
			player.loadTexture('player_left');
		//Enemies update needs to be before the follower update
		
		slimeG.update();
		slimeSystem.update();
		gasG.update();
		gasSystem.update();
		//followerSystem.update();
		wcShooter.update();
		//wcMelee.update();
		enemies.update();
		treeG.update();
		dmgSystem.update();
		
		boss.update();
		
		pollution_timer++;
		if (pollution_timer == 500) {
			temperature += 1;
			pollution_timer = 0;
		}
		temperature_reading.setText(temperature);
		
		
	}
	
}