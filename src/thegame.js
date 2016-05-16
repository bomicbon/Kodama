var theGame = function(game){
	player = null;
	score = 0;
	cursors = null;
	ground = null;
	followerSystem = null;
	flower = null;
	animal = null;

	jumpVelocity = -450;
	//jumpV should be -435 on first heatup so that bonus platforms cannot be reached
	
	gravity = 1000;
	worldWidth = 3800;
	worldHeight = 720;

	playerSpeed = 250;
	playerX = 10;
	playerY = 650;

	wcShooter = null;
	
	
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
		
	// Ground Code
		ground = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			ground.create(300 * i, level0, 'ground'); // ground
			
		}
		//platforms before wall 1
		ground.create(300, level1, 'platformL'); 
		ground.create(150, level2, 'platformS'); 
		ground.create(50, level3, 'platformS'); 
		ground.create(180, level4, 'platformL'); 
		ground.create(40, level6+80, 'platformS'); //bonus
		ground.create(580, level3, 'platformM'); //put tree on this platform
		ground.create(480, level5, 'platformM'); 
		ground.create(600, level6, 'platformS'); 
		ground.create(700, level5+35, 'platformWall');
		//platforms before wall 2
		ground.create(800, level6, 'platformM'); 
		ground.create(1000, level5, 'platformM'); 
		ground.create(1250, level6-10, 'platformS'); //bonus
		ground.create(820, level4, 'platformS'); 
		ground.create(1000, level3, 'platformS'); 
		ground.create(820, level2, 'platformM'); 
		ground.create(1000, level1, 'platformL'); 
		ground.create(1300, level2, 'platformL'); 
		ground.create(1650, level3, 'platformS'); 
		ground.create(1350, level4, 'platformL');
		ground.create(1650, level5, 'platformM');
		ground.create(1600, level6, 'platformS');
		ground.create(1900, level5+35, 'platformWall');
		//platforms before wall 3
		ground.create(1900, level4, 'platformL'); 
		ground.create(1900, level2-10, 'platformM'); //bonus
		ground.create(2200, level1, 'platformL'); 
		ground.create(2450, level2, 'platformM'); 
		ground.create(2550, level3, 'platformS');
		ground.create(2400, level4, 'platformM');  
		ground.create(2250, level5, 'platformS'); 
		ground.create(2400, level6-10, 'platformL'); 
		
		ground.setAll('body.immovable', true);
		
		// Flower Code - no collisions yet
		flower = this.game.add.physicsGroup();
		flower.scale.setTo(0.3, 0.3);
		for(var i = 0; i < 13; i++) {
			flower.create(3000*i, 2180, 'flower');
			flower.create(400+4600*i, 1600, 'flower');
		}
		flower.setAll('body.immovable', true);
		
		// Animal Code
		animal = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			animal.create(800+1500*i, 470, 'animal');
		}
		
		//Follower Code
		followerSystem = new FollowerSystem(this.game, player, jumpVelocity, ground);
		followerSystem.create();

  	    //watering can shooter code
		wcShooter = new wateringcanShooter(this.game, player, ground);
		wcShooter.create();
		
	},
	update: function() {
	    this.game.physics.arcade.collide(player, ground);

		player.body.velocity.x = 0;
		if(cursors.left.isDown && cursors.right.isDown) {
			//
		}
		else if(cursors.left.isDown) {
			player.body.velocity.x = -playerSpeed;
		}
		else if(cursors.right.isDown) {
			player.body.velocity.x = playerSpeed;
		}
		else {
			//put idle animation in here
		}
		
		if (cursors.up.isDown && player.body.touching.down) {
			player.body.velocity.y = jumpVelocity;
		}
		
		followerSystem.update();
		wcShooter.update();
	}
	
	//this.game.state.start("GameOver", true, false, score);
}