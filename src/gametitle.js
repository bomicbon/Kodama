var gameTitle = function(game){
	title_p = null;
	title_player = null;
	title_temperature_reading = null;
	title_startingTemp = 65;
	title_w = 640;
	title_h = 320;
	title_ground = null;
	var groundLength = 15;
	level0 = 690;
	title_wc = null;
	
	// Sounds
	sound_shoot = null;
	sound_shootM = null;
	sound_shootL = null;
	sound_shootXL = null;
	
	// Message Boxes
	//m_arrowkeys = null;
	//m_space = null;
}

gameTitle.prototype = {
  	create: function(){
  		
		
		//BACKGROUND
    	var background = this.game.add.tileSprite(0, 0, 4200, 720, "background");
    	// GAME TITLE
		var gameTitle = this.game.add.bitmapText(160, 380, 'pixely_font', 'H TO O', 64);
    	
		// CREDITS PAGE
		var Title = this.game.add.bitmapText(title_w+20, title_h, 'pixely_font', 'CREDITS', 24);
    	var LCN = this.game.add.bitmapText(title_w+20, title_h+40, 'pixely_font', 'LUCIENNE LEE', 40);
    	var ETN = this.game.add.bitmapText(title_w+20, title_h+100, 'pixely_font', 'ETHAN WONG', 40);
    	var JAY = this.game.add.bitmapText(title_w+20, title_h+160, 'pixely_font', 'JAY PATEL', 40);
    	var UUU = this.game.add.bitmapText(title_w+20, title_h+220, 'pixely_font', 'URIAN LEE', 40);
    	
    	//BACKGROUND 1
  		var background1 = this.game.add.tileSprite(0, 0, 4200, 720, "background1");
  		
    	// GIVE PHYSICS
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	
    	// TEMPERATURE BECAUSE IT IS NEEDED TO CREATE PLAYER 
		title_temperature_reading = this.game.add.text(this.game.camera.x+550, this.game.camera.y+50, title_startingTemp, {
  			font: "1px Arial", //TOXICITY BAR
  			fill: "000000",
  			align: "center"
  		});
		title_temperature_reading.temp = title_startingTemp;
		title_temperature_reading.nTemp = title_startingTemp;
		title_temperature_reading.anchor.setTo(0.5, 0.5);
		title_temperature_reading.fixedToCamera = true;
		
		// PLAYER CREATION
		title_p = new Title_Player(this.game, title_temperature_reading);
		title_p.create();
		title_player = title_p.sprite;
		
		// GROUND EXISTS
		title_ground = this.game.add.physicsGroup();
		//E: use ground length to determine how far the ground goes
		var groundLength = 8;
		for (var i = 0; i < groundLength; i++) {
			title_ground.create(300 * i, level0, 'ground'); // ground
			this.add.sprite(300 * i, level0-groundLength,"groundI");
		}
		title_ground.setAll('body.immovable', true);
		title_ground.setAll('body.checkCollision.down', false);
		title_ground.setAll('body.checkCollision.left', false);
		title_ground.setAll('body.checkCollision.right', false);
		
		//WATERING CAN 
		title_wc = new wateringcanShooter(this.game, title_player, title_ground, title_temperature_reading);
		title_wc.create();
		
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
		
		this.game.physics.arcade.collide(title_player, title_ground); //PLAYER TOUCHES GROUND
		title_p.update(); // PLAYER UPDATE
		title_wc.update(); // WATERING CAN UPDATE
		
		// ARROW KEYS TUTORIAL
		if (title_p.didL && title_p.didU && title_p.didR) {
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
		if (title_wc.didShoot) {
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
		if (title_player.body.x >= 1200) {
			this.game.camera.reset();
			this.game.state.start("TheGame");
			
		}
	},
}