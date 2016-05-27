var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){
		var gameTitle = this.game.add.sprite(320,160,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(320,320,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		var creditsBTN = this.game.add.button(320,380, "credits", this.credits, this);
		creditsBTN.anchor.setTo(0.5, 0.5);
	},
	playTheGame: function(){
		this.game.state.start("TheGame");
	},
	credits: function() {
		this.game.state.start("Credits");
	},
}