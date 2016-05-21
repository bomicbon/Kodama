var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){
		var gameTitle = this.game.add.sprite(300,160,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(300,320,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		var tutorialButton = this.game.add.button(500, 100, "tutorial", this.doTutorial, this);
		tutorialButton.anchor.setTo(0.5, 0.5);
		var level1Button = this.game.add.button(500, 145, "level1", this.gotoLevel1, this);
		level1Button.anchor.setTo(0.5, 0.5);
		var level2Button = this.game.add.button(500, 195, "level2", this.gotoLevel2, this);
		level2Button.anchor.setTo(0.5, 0.5);
		var godModeButton = this.game.add.button(500, 235, "godmode", this.beginGodMode, this);
		godModeButton.anchor.setTo(0.5, 0.5);
	},
	playTheGame: function(){
		this.game.state.start("TheGame");
	},
	doTutorial: function() {
		this.game.state.start("TheTutorial");
	},
	gotoLevel1: function(){
		this.game.state.start("level1"); // level1 is state 'name' level_One is function name
	},
	gotoLevel2: function(){
		this.game.state.start("level2"); // level2 is state 'name', level_Two is function name
	},
	beginGodMode: function() {
		this.game.state.start("GodMode");
	},
}