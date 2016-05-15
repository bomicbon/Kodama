var game = new Phaser.Game(3280,720, Phaser.AUTO, '', 
	{preload: preload, create: create, update: update});

function preload() {
	game.stage.backgroundColor = '#85b5e1';
	game.load.image('box', 'assets/box.png');
	game.load.image('blob', 'assets/blob.png');
	game.load.image('ground', 'assets/platform.png');

}

var ground;
var player;
var cursors;
var followerSystem;
//var platforms;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = game.input.keyboard.createCursorKeys();
	game.world.setBounds(0,0, 3800, 720);
	//game.add.tileSprite(0,0, 1920, 720, 'blob');
	player = game.add.sprite(0,10, 'blob');
	game.physics.arcade.enable(player);
	player.scale.setTo(0.2, 0.2);
	game.camera.follow(player);
	player.body.bounce.y = 0.1;
	player.body.gravity.y = 200;
	player.body.collideWorldBounds = true;
	ground = game.add.physicsGroup();
	//ground.create(600, 330, 'ground');
	//ground.create(200, 500, 'ground');
	//ground.create(1000, 500, 'ground');
	for (var i = 0; i < 12; i++) {
		ground.create(300 * i, 670, 'ground');
		ground.create(700 * i, 500, 'ground');
	}
	ground.setAll('body.immovable', true);
	//
//	ground = game.add.group();
//	ground.enableBody = true;
//	var g = ground.create(0, game.world.height - 10, 'box');
//	g.scale.setTo(100,2);
//	g.body.immovable = true;
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
	
	if(cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
		player.body.velocity.y = -250;
	}
	
	followerSystem.update();
}
