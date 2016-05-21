var preload = function(game){}

preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(300,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);
		
		// 
		this.game.load.image("gametitle", "assets/img/gametitle.png");
		this.game.load.image("play", "assets/img/play.png");
		this.game.load.image("player", "assets/img/player.png");
		this.game.load.image("platformL", "assets/img/platformL.png");
		this.game.load.image("platformM", "assets/img/platformM.png");
		this.game.load.image("platformS", "assets/img/platformS.png");
		this.game.load.image("platformWall", "assets/img/platformWall.png");
		this.game.load.image("ground", "assets/img/ground.png");
		this.game.load.image("follower", "assets/img/follower.png");
		this.game.load.image("flower", "assets/img/flower.png");
		this.game.load.image("animal", "assets/img/squirrel.png");
		this.game.load.image("oil", "assets/img/oil.png");
		this.game.load.image("water", "assets/img/water.png");
		this.game.load.spritesheet('splash', 'assets/img/splash.png', 24, 24, 10);
		this.game.load.image("enemy", "assets/img/box.png");
		this.game.load.image("tutorial", "assets/img/tutorial.png");
		this.game.load.image("level1", "assets/img/level1.png");
		this.game.load.image("level2", "assets/img/level2.png");
		this.game.load.image("godmode", "assets/img/godmode.png");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}