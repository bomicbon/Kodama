var boot = function(game){
	console.log("%cStarting game", "color:white; background:red");
};
  
boot.prototype = {
	preload: function(){
          this.game.load.image("loading","assets/img/loading.png");
          this.game.stage.backgroundColor = '#c0efff';
          this.game.load.bitmapFont('pixely_font', 'assets/font/font.png', 'assets/font/font.fnt');
	},
  	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setScreenSize(true);
		this.game.state.start("Preload");
	}
}