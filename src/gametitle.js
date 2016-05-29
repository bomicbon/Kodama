var gameTitle = function(game){
	p = null;
	player = null;
	temperature_reading = null;
	startingTemp = 65;
	w = 640;
	h = 320;
	ground = null;
	var groundLength = 15;
	wc = null;
	
	// Sounds
	sound_shoot = null;
	sound_shootM = null;
	sound_shootL = null;
	sound_shootXL = null;
	
	// Message Boxes
	//m_arrowkeys = null;
	//m_space = null;
	
	//GAME COORDINATES
	var playerX = 10;
	var playerY = 650;
}

gameTitle.prototype = {
  	create: function(){
  		// GAME TITLE
		var gameTitle = this.game.add.sprite(320,360,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		
		//BACKGROUND
    	var background = this.game.add.tileSprite(0, 0, 4200, 720, "background");
    	
		// CREDITS PAGE
		var Title = this.game.add.bitmapText(w+20, h, 'pixely_font', 'CREDITS', 24);
    	var LCN = this.game.add.bitmapText(w+20, h+40, 'pixely_font', 'LUCIENNE LEE', 40);
    	var ETN = this.game.add.bitmapText(w+20, h+100, 'pixely_font', 'ETHAN WONG', 40);
    	var JAY = this.game.add.bitmapText(w+20, h+160, 'pixely_font', 'JAY PATEL', 40);
    	var UUU = this.game.add.bitmapText(w+20, h+220, 'pixely_font', 'URIAN LEE', 40);
    	
    	//BACKGROUND 1
  		var background1 = this.game.add.tileSprite(0, 0, 4200, 720, "background1");
  		
    	// GIVE PHYSICS
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	
    	// TEMPERATURE BECAUSE IT IS NEEDED TO CREATE PLAYER 
		temperature_reading = this.game.add.text(this.game.camera.x+550, this.game.camera.y+50, startingTemp, {
  			font: "1px Arial", //TOXICITY BAR
  			fill: "000000",
  			align: "center"
  		});
		temperature_reading.temp = startingTemp;
		temperature_reading.nTemp = startingTemp;
		temperature_reading.anchor.setTo(0.5, 0.5);
		temperature_reading.fixedToCamera = true;
		
		// PLAYER CREATION
		p = new Title_Player(this.game, temperature_reading);
		p.create();
		player = p.sprite;
		
		// GROUND EXISTS
		ground = this.game.add.physicsGroup();
		//E: use ground length to determine how far the ground goes
		var groundLength = 8;
		for (var i = 0; i < groundLength; i++) {
			ground.create(300 * i, level0, 'ground'); // ground
			this.add.sprite(300 * i, level0-groundLength,"groundI");
		}
		ground.setAll('body.immovable', true);
		ground.setAll('body.checkCollision.down', false);
		ground.setAll('body.checkCollision.left', false);
		ground.setAll('body.checkCollision.right', false);
		
		//WATERING CAN 
		wc = new wateringcanShooter(this.game, player, ground, temperature_reading);
		wc.create();
		
		// shoot sounds
		sound_shoot = this.game.add.audio('shoot');
		sound_shootM = this.game.add.audio('shootM');
		sound_shootL = this.game.add.audio('shootL');
		sound_shootXL = this.game.add.audio('shootXL');
		
		// Text
    	m_arrowkeys = this.game.add.bitmapText(50, 580, 'pixely_font', 'ARROW KEYS TO MOVE', 12);
    	m_space = this.game.add.bitmapText(50, 600, 'pixely_font', 'SPACE TO SHOOT', 12);
    	m_start = this.game.add.bitmapText(1180, 550, 'pixely_font', 'START HERE', 12);
    	
    	
    	
    	
    	
	},
	update: function() {
		
		this.game.physics.arcade.collide(player, ground); //PLAYER TOUCHES GROUND
		p.update(); // PLAYER UPDATE
		wc.update(); // WATERING CAN UPDATE
		
		// ARROW KEYS TUTORIAL
		if (p.didL && p.didU && p.didR) {
			if (m_arrowkeys.alpha < 0.2) {
				m_arrowkeys.alpha = 0;
				m_arrowkeys.setText('');
			}
			else {
				m_arrowkeys.setText('PROPS BRAH NOW YOU KNOW HOW TO MOVE');
				m_arrowkeys.alpha -= 0.005;
				//m_arrowkeys.scale += 0.5;
			}
			
		}

		// SPACE BAR Completed
		if (wc.didShoot) {
			if (m_space.alpha < 0.1) {
				m_space.alpha = 0;
				m_space.setText('');
			}
			else {
				m_space.setText('GOOD JOB! YOU KNOW HOW TO SHOOT NOW LOL'); // NO RLY THOUGH WAT IS THIS DOING HERE
				//															RE: WHY DON'T YOU CONFRONT PEOPLE
				// 																AND STOP COMMUNICATING ALL PASSIVE AGGRESSIVE
				//																VIA COMMENTED CODE LIKE A SOCIALLY
				//																DISABLED PERSON
				m_space.alpha -= 0.005;
				//m_space.scale += 0.5;
			}
		}
		if (player.body.x >= 1200) {
			this.game.state.start("TheGame");
			
		}
	},
}