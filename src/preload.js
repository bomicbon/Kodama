var preload = function(game){}

preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(320,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);
		
		// Images
		this.game.load.image("gametitle", "assets/img/gametitle.png");
		this.game.load.image("play", "assets/img/play.png");
		this.game.load.image("background", "assets/img/background.png");
		this.game.load.image("background1", "assets/img/background1.png");
		this.game.load.spritesheet('player', 'assets/img/player.png', 44, 65, 16);
		this.game.load.spritesheet('tree', 'assets/img/tree.png', 150, 210, 10);
		this.game.load.spritesheet('factorypipe', 'assets/img/factorypipe.png', 70, 255, 8);
		this.game.load.image("platformL", "assets/img/platformL.png");
		this.game.load.image("platformM", "assets/img/platformM.png");
		this.game.load.image("platformS", "assets/img/platformS.png");
		this.game.load.image("platformIL", "assets/img/platformIL.png");
		this.game.load.image("platformIM", "assets/img/platformIM.png");
		this.game.load.image("platformIS", "assets/img/platformIS.png");

		this.game.load.spritesheet('gas', 'assets/img/gas.png', 369, 324, 15);
		this.game.load.image("ground", "assets/img/ground.png");
		this.game.load.image("groundI", "assets/img/groundI.png");
		this.game.load.image("pipe", "assets/img/pipe.png");
		this.game.load.image("water", "assets/img/water.png");
		this.game.load.spritesheet('splash', 'assets/img/splash.png', 24, 24, 10);
		this.game.load.spritesheet('slime', 'assets/img/slime.png', 50, 36, 4);
		this.game.load.spritesheet('kaboom', 'assets/img/explode.png', 128, 128, 16);
		
		this.game.load.image("tutorial", "assets/img/tutorial.png");
		this.game.load.image("level1", "assets/img/level1.png");
		this.game.load.image("level2", "assets/img/level2.png");
		this.game.load.image("godmode", "assets/img/godmode.png");
		this.game.load.image("gameover", "assets/img/gameover.png");
		this.game.load.image("quit", "assets/img/quit.png");
		this.game.load.image("stagecleared", "assets/img/stage_cleared.png");
		
		this.game.load.image("blob", "assets/img/blob.png");
		this.game.load.image("blobL", "assets/img/blobLeftArm.png");
		this.game.load.image("blobR", "assets/img/blobRightArm.png");
		this.game.load.spritesheet("blobSheet", "assets/img/blobSS.png", 350, 328, 8);
		
		this.game.load.image("orb", "assets/img/greenOrb.png");
		this.game.load.image("waterDrop", "assets/img/waterDroplet.png");
		this.game.load.image("shield", "assets/img/shield.png");
		this.game.load.image("spill", "assets/img/spill.png");
		this.game.load.image("leaf", "assets/img/leaf.png");
		this.game.load.image("right_arrow", "assets/img/right_arrow.png");
		this.game.load.image("left_arrow", "assets/img/left_arrow.png");
		this.game.load.image("up_arrow", "assets/img/up_arrow.png");
		this.game.load.image("health_bar_border", "assets/img/health_bar_border.png");
		this.game.load.image("feedme", "assets/img/feedme.png");
		this.game.load.image("thankyou", "assets/img/thankyou.png");
		this.game.load.image("back", "assets/img/back.png");
		this.game.load.image("credits", "assets/img/credits.png");
		
		// SOUND
		this.game.load.audio('background_music', 'assets/sound/background_music.wav');
		this.game.load.audio('footstep', 'assets/sound/footstep.wav');
		this.game.load.audio('shoot', 'assets/sound/shoot.wav');
		this.game.load.audio('tree_healed', 'assets/sound/tree_healed.wav');
		this.game.load.audio('shootM', 'assets/sound/shootM.wav');
		this.game.load.audio('shootL', 'assets/sound/shootL.wav');
		this.game.load.audio('shootXL', 'assets/sound/shootXL.wav');
		this.game.load.audio('water_splash', 'assets/sound/splat.wav');
		
		this.game.load.audio('leaf1', 'assets/sound/leafBuildUp.wav');
		this.game.load.audio('leaf2', 'assets/sound/leafShoot.wav');
		this.game.load.audio('jump', 'assets/sound/jump.wav');
		this.game.load.audio('explosion', 'assets/sound/explosion.wav');
		this.game.load.audio('healthUp', 'assets/sound/healthUp.wav');
		this.game.load.audio('hithurt', 'assets/sound/hithurt.wav');
		this.game.load.audio('slimejump', 'assets/sound/slimeJump.wav');
		
		// FONT
		this.game.load.bitmapFont('pixely_font', 'assets/font/font.png', 'assets/font/font.fnt');

	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}