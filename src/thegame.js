var theGame = function(game){
	player = null;
	score = 0;
	cursors = null;
	ground = null;
	followerSystem = null;
}

theGame.prototype = {
  	create: function(){
  		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		number = Math.floor(Math.random()*10);
		player = this.game.add.sprite(160,240,"player");
		player.anchor.setTo(0.5,0.5);
		cursors = this.game.input.keyboard.createCursorKeys();
		this.game.world.setBounds(0, 0, 3800, 720);
		this.game.physics.arcade.enable(player);
		player.scale.setTo(1.0, 1.0);
		this.game.camera.follow(player);
		player.body.bounce.y = 0.1;
		player.body.gravity.y = 200;
		player.body.collideWorldBounds = true;
		ground = this.game.add.physicsGroup();
		for (var i = 0; i < 13; i++) {
			ground.create(300 * i, 670, 'ground');
			ground.create(700 * i, 500, 'ground');
		}
		ground.setAll('body.immovable', true);
		//followerSystem = new FollowerSystem(game, player, ground);
		//followerSystem.create();
		
	},
	update: function() {
		this.game.physics.arcade.collide(player, ground); 
		player.body.velocity.x = 0;
		if(cursors.left.isDown && cursors.right.isDown) {
			//
		}
		else if(cursors.left.isDown) {
			player.body.velocity.x = -200;
		}
		else if(cursors.right.isDown) {
			player.body.velocity.x = 200;
		}
		else {
			//put idle animation in here
		}
		
		if(cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
			player.body.velocity.y = -250;
		}
		
		//followerSystem.update();
	}
	
	//this.game.state.start("GameOver", true, false, score);
}