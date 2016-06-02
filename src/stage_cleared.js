var stage_cleared = function(game){}

stage_cleared.prototype = {
	init: function(score){
	},
  	create: function(){
		var yousaved = this.game.add.bitmapText(100, 130, 'pixely_font', 'YOU SAVED', 48);
		var the_enviro = this.game.add.bitmapText(60, 190, 'pixely_font', 'THE ENVIRONMENT', 32);
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