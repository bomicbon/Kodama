var stage_cleared = function(game){}

stage_cleared.prototype = {
	init: function(score){
	},
  	create: function(){
  		var stageClearedTitle = this.game.add.sprite(320,160,"stagecleared");
		stageClearedTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(320,320,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		var quitButton = this.game.add.button(320, 380, "quit", this.quitTheGame, this);
		quitButton.anchor.setTo(0.5, 0.5);
	},
	playTheGame: function(){
		this.game.state.start("TheGame");
	},
	quitTheGame: function() {
		this.game.state.start("GameTitle");
	},
}