var boot = function(game){
	console.log("%cStarting game", "color:white; background:red");
};
  
boot.prototype = {
	preload: function(){
          this.game.load.image("loading","assets/img/loading.png");
          this.game.stage.backgroundColor = '#85b5e1';
	},
  	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.setScreenSize();
		this.game.state.start("Preload");
	}
}