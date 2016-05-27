var credits = function(game){}

credits.prototype = {
  	create: function(){
    	var Title = this.game.add.bitmapText(20, 90, 'pixely_font', 'CREDITS', 24);
    	var LCN = this.game.add.bitmapText(20, 130, 'pixely_font', 'LUCIENNE LEE', 40);
    	var ETN = this.game.add.bitmapText(20, 190, 'pixely_font', 'ETHAN WONG', 40);
    	var JAY = this.game.add.bitmapText(20, 250, 'pixely_font', 'JAY PATEL', 40);
    	var UUU = this.game.add.bitmapText(20, 310, 'pixely_font', 'URIAN LEE', 40);

		var backBTN = this.game.add.button(50, 50, "back", this.mainMenu, this);
		backBTN.anchor.setTo(0.5, 0.5);
	},
	mainMenu: function() {
		this.game.state.start("GameTitle");
	},
}