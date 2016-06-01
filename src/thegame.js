var theGame = function(game){
	background = null;
	background_music = null;
	
	p = null;
	player = null;
	score = 0;
	pollution_timer = 0;
	temperature_reading = null;
	startingTemp = null;
	
	ground = null;
	flower = null;
	animal = null;
	
	sun = null;
	smoke = null;
	
	sweatS = null;

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
	
	// Sounds
	sound_shoot = null;
	sound_shootM = null;
	sound_shootL = null;
	sound_shootXL = null;
	sound_footstep = null;
	sound_tree_healed = null;
	s_hithurt = null;
	s_slimejump = null;
	
	//Health Bar
	this.myHealthBar = null;
	barConfig = null;
	health_bar_border = null;
	
	// Toxicity Bar
	this.myToxicityBar = null;
	t_barConfig = null;
	
	// Message Boxes
	m_feedme = null;
	
	// BGM
	var background_music = null;
}


theGame.prototype = {
  	create: function(){
		  
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
  		
  		//This background_music submission is licensed by author under CC Attribution Noncommercial No Derivative Works (BY-NC-ND)
  		background_music = this.game.add.audio('background_music');
  		background_music.play();
  		
  		backgroundsky = this.game.add.tileSprite(0, 0, 4200, 720, "backgroundsky");
		  
		//Sun
		sun = this.game.add.sprite(50, 60, "water");
		sun.anchor.setTo(0.5);
		sun.fixedToCamera = true;
		
  		background = this.game.add.tileSprite(0, 0, 4200, 720, "background");
  		backgroundbldgs = this.game.add.tileSprite(0, 0, 4200, 720, "backgroundbldgs");
  		background1 = this.game.add.tileSprite(0, 0, 4200, 720, "background1");
		  
		
  		startingTemp = 75;
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
		
		p = new Player(this.game, temperature_reading);
		p.create();
		player = p.sprite;
		
		
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
		this.add.sprite(2448, level2-15,"platformIS");
		ground.create(2450, level2, 'platformS'); 
		this.add.sprite(2828, level1-15,"platformIM");
		ground.create(2830, level1, 'platformM'); 
		this.add.sprite(3348, level2-15,"platformIM");
		ground.create(3350, level2, 'platformM'); 
		this.add.sprite(3578, level1-15,"platformIS");
		ground.create(3580, level1, 'platformS'); 
		this.add.sprite(3678, level2-15, "platformIS");
		ground.create(3680, level2, 'platformS');
		
		ground.setAll('body.immovable', true);
		ground.setAll('body.checkCollision.down', false);
		ground.setAll('body.checkCollision.left', false);
		ground.setAll('body.checkCollision.right', false);
		
		// animation testing area -lxhart
		/*
		pipesmoke = this.add.sprite(250, level2, 'factorypipe');
		pipesmoke.animations.add('pipesmoke', [0,1,2,3,4,5,6,7], 17, true);
        pipesmoke.animations.play('pipesmoke');  */

		//player sweat system
		sweatS = new sweatSystem(this.game, player);
		
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
		gasG = new gasGroup(this.game, player, temperature_reading);
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
		//sound_tree_healed = this.game.add.audio('tree_healed');
		
		//s_hithurt = this.game.add.audio('hithurt');
		//s_slimejump = this.game.add.audio('slimejump');
		
		//smoke amount ui
		smoke = this.game.add.sprite(this.game.width/2, 60, "smoke");
		smoke.anchor.setTo(0.5);
		smoke.scale.setTo(1.2, 0.6);
		smoke.alpha = 0;
		smoke.fixedToCamera = true;
		
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
    	
    	// Text
    	m_feedme = this.game.add.bitmapText(410, 610, 'pixely_font', '', 12);
		
		
		
		
	},
	update: function() {
		
		//this.game.stage.backgroundColor =  8762849 + pollution_timer + 10*temperature;
	    this.game.physics.arcade.collide(player, ground);
		
		//player update
		p.update();
		if(player.health < 1) {
			background_music.destroy();
		}	
		
		//Enemies update needs to be before the follower update
		
		slimeG.update();
		slimeSystem.update();
		gasG.update();
		gasSystem.update();
		//followerSystem.update();
		wcShooter.update();
		//wcMelee.update();
		//enemies.update();
		treeG.update(boss);
		dmgSystem.update();
		
		boss.update();
		
		
		pollution_timer++;
		if (pollution_timer == 300) {
			temperature_reading.temp += 1;
			pollution_timer = 0;
			
		}
		//call more sweat
		if(temperature_reading.temp >= 70) {
				sweatS.update(true);
		}
		//stop making more sweat
		if(temperature_reading.temp < 70) {
				sweatS.update(false);
		}
		temperature_reading.setText(temperature_reading.temp);
		
		//Background Parallax
		var camera = this.game.camera;
		
		background.tilePosition.x = camera.x - 1 * camera.x / 16;
		background1.tilePosition.x = camera.x - 1 * camera.x / 3;
		backgroundbldgs.tilePosition.x = camera.x - 1 * camera.x / 8;
		backgroundsky.tilePosition.x = camera.x;
		
		//determines which heat stage its on
		var tempStage = parseInt( (temperature_reading.temp - 50) / 10);
		var hexColor = 0xFFFFFF;
		//depending on heat stage, tint color changes to more and more red
		switch (tempStage) {
			case 0:
				hexColor = 0xFFFFFF;
				break;
			case 1:
				hexColor = 0xFFCCCC;
				break;
			case 2:
				hexColor = 0xFF9999;
				break;
			case 3:
				hexColor = 0xFF6666;
				break;
			default:
				hexColor = 0xFF6666;
				break;
		}
		 
		background.tint = hexColor;
		background1.tint = hexColor;
		backgroundbldgs.tint = hexColor;
		backgroundsky.tint = hexColor;
		
		//increase sun scale as temp gets higher
		sun.scale.setTo(temperature_reading.temp / 70);
		//min scale
		if(sun.scale.x < 0.8) {
			sun.scale.setTo(0.8);
		}
		//max scale
		if(sun.scale.x > 3) {
			sun.scale.setTo(3);
		}
		
		//change smoke alpha depending on temp
		//max out at 100 degrees, min is 60 degrees
		smoke.alpha = (temperature_reading.temp - 60) / 40;
		if(smoke.alpha < 0) {
			smoke.alpha = 0;
		}
		if(smoke.alpha > 1) {
			smoke.alpha = 1;
		}
		
		// Updating Bars
		this.myHealthBar.setPercent(player.health);
		this.myToxicityBar.setPercent(100*temperature_reading.temp/80);
		
		// FEED ME Request
		if (player.body.x > 100) {
			m_feedme.setText('FEED ME');
		}
		else {
			m_feedme.setText('');
		}
		// FEED ME Completed
		if (treeG.firstHealed) {
			if (m_feedme.alpha < 0.1) {
				m_feedme.alpha = 0;
				m_feedme.setText('');
			}
			else {
				m_feedme.setText('THANK YOU');
				m_feedme.alpha -= 0.01;
				//m_feedme.body.y -= 1;
			}
		}
	}
    
}