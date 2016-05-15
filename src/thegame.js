var theGame = function(game){
	player = null;
	score = 0;
	cursors = null;
	ground = null;
	followerSystem = null;
	flower = null;

	jumpVelocity = -250;
	gravity = 300;
	worldWidth = 3800;
	worldHeight = 720;

	playerSpeed = 250;
	playerX = 160;
	playerY = 240;
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
		player.scale.setTo(1.0, 1.0);
		this.game.camera.follow(player);
		player.body.bounce.y = 0.1;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;
		
		// Ground Code
		ground = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			ground.create(300 * i, 670, 'ground'); // level 1
			ground.create(700 * i, 500, 'ground'); // ground
		}
		ground.setAll('body.immovable', true);
		
		// Flower Code - not yet complete
		flower = this.game.add.physicsGroup();
		flower.scale.setTo(0.3, 0.3);
		for(var i = 0; i < 13; i++) {
			flower.create(3000*i, 2180, 'flower');
			flower.create(400+4600*i, 1600, 'flower');
		}
		flower.setAll('body.immovable', true);
		
		//Follower Code
		followerSystem = new FollowerSystem(this.game, player, jumpVelocity, ground);
		followerSystem.create();
		
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
	}
	
	//this.game.state.start("GameOver", true, false, score);
}