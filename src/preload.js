var preload = function(game){}

preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(300,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);
		
		// 
		this.game.load.image("gametitle", "assets/gametitle.png");
		this.game.load.image("play", "assets/play.png");
		this.game.load.image("player", "assets/player.png");
		this.game.load.image("ground", "assets/platform.png");
		this.game.load.image("follower", "assets/follower.png");
		this.game.load.image("flower", "assets/flower.png");
		this.game.load.image("animal", "assets/squirrel.png");
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}