var gameOver = function(game){
}

gameOver.prototype = {
	init: function(score){
		//alert("You scored: "+score)
	},
  	create: function(){
  		//var s = 'YOU GOT' + score;
  		var gameTitle = this.game.add.bitmapText(60, 130, 'pixely_font', 'THE ENVIRONMENT', 32);
  		gameTitle.align = 'center';
  		//gameTitle.anchor.setTo(0.5, 0.5);
  		var isRuined = this.game.add.bitmapText(170, 180, 'pixely_font', 'IS DOOMED', 32);
  		isRuined.allign = 'center';
  		//isRuined.anchor.setTo(0.5, 0.5);
  		//var gameOverTitle = this.game.add.sprite(320,160,"gameover");
		//gameOverTitle.anchor.setTo(0.5,0.5);
		
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