var game = new Phaser.Game(1280,720, Phaser.AUTO, '', 
	{preload: preload, create: create, update: update});

function preload() {
	game.load.image('box', 'assets/box.png');
	game.load.image('blob', 'assets/blob.png');
	
}

var ground;
var player;
var cursors;
var followerSystem;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = game.input.keyboard.createCursorKeys();
	game.world.setBounds(0,0, 1920, 720);
	game.add.tileSprite(0,0, 1920, 720, 'blob');
	
	player = game.add.sprite(0,10, 'blob');
	game.physics.arcade.enable(player);
	player.scale.setTo(0.2, 0.2);
	game.camera.follow(player);
	
	player.body.bounce.y = 0.1;
	player.body.gravity.y = 500;
	player.body.collideWorldBounds = true;	
	
	ground = game.add.group();
	ground.enableBody = true;
	
	var g = ground.create(0, game.world.height - 10, 'box');
	g.scale.setTo(100,2);
	g.body.immovable = true;
	
	followerSystem = new FollowerSystem(game, player, ground);
	followerSystem.create();
	
}

function update() {
	
	game.physics.arcade.collide(player, ground);
	
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
	
	if(cursors.up.isDown && player.body.touching.down) {
		player.body.velocity.y = -250;
	}
	
	followerSystem.update();
}
