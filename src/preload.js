var preload = function(game){}

preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(300,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);
		
		// 
		this.game.load.image("gametitle", "assets/img/gametitle.png");
		this.game.load.image("play", "assets/img/play.png");
		this.game.load.spritesheet('player', 'assets/img/player.png', 44, 65, 16);
		this.game.load.image("platformL", "assets/img/platformL.png");
		this.game.load.image("platformM", "assets/img/platformM.png");
		this.game.load.image("platformS", "assets/img/platformS.png");
		this.game.load.image("platformIL", "assets/img/platformIL.png");
		this.game.load.image("platformIM", "assets/img/platformIM.png");
		this.game.load.image("platformIS", "assets/img/platformIS.png");
		this.game.load.image("platformWall", "assets/img/platformWall.png");
		this.game.load.image("gas", "assets/img/gas.png");
		this.game.load.image("ground", "assets/img/ground.png");
		this.game.load.image("groundI", "assets/img/groundI.png");
		this.game.load.image("follower", "assets/img/follower.png");
		this.game.load.image("flower", "assets/img/flower.png");
		this.game.load.image("pipe", "assets/img/pipe.png");
		this.game.load.image("water", "assets/img/water.png");
		this.game.load.spritesheet('splash', 'assets/img/splash.png', 24, 24, 10);
		this.game.load.spritesheet('slime', 'assets/img/slime.png', 50, 36, 4);
		this.game.load.image("enemy", "assets/img/box.png");
		this.game.load.image("tutorial", "assets/img/tutorial.png");
		this.game.load.image("level1", "assets/img/level1.png");
		this.game.load.image("level2", "assets/img/level2.png");
		this.game.load.image("godmode", "assets/img/godmode.png");
		this.game.load.image("gameover", "assets/img/gameover.png");
		this.game.load.image("quit", "assets/img/quit.png");
		this.game.load.image("flower_black", "assets/img/flower_black.png");
		this.game.load.image("stagecleared", "assets/img/stage_cleared.png");
		
		this.game.load.image("blob", "assets/img/blob.png");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}