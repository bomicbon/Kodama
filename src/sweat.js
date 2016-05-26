function sweatSystem(game, player) {
    
    this.sweatGroup = game.add.group();
    this.range = 30;
    
    //sweat time is how fast the player will sweat
    this.sweatTime = 30;
    this.sweatCounter = 0;
    
    this.create = function() {
        
    }
    
    //adds sweat at a random x and add it the the sweat group
    //uses offsetX to tell the update function where to place the sprite
    this.addSweat = function() {
        var randX = Math.random() - 0.5;
        var randY = Math.random() - 0.5;

        var playerMidX = player.x;
        var playerMidY = player.y - player.height / 4;
        var sweat = this.sweatGroup.create(playerMidX + randX * this.range, playerMidY + randY * 5, 'waterDrop');
        sweat.offsetX = randX * this.range;
        sweat.offsetY = randY * 5;
        sweat.anchor.setTo(0.5);
        sweat.scale.setTo(0.2);

    }
    
    this.update = function(keepSweat) {
        //goes through each sprite and makes it "fall"
        for(var i = 0; i < this.sweatGroup.length; ++i) {
            var sweat = this.sweatGroup.getAt(i);
            sweat.x = player.x + sweat.offsetX;
            sweat.y = player.y - player.height/4 + sweat.offsetY;  
            
            sweat.offsetY += 1;
            //destroy it when it travels down a certain amount
            if(sweat.offsetY > 20) {
                sweat.destroy();
                --i;
            } 
        }
        
        //this is called only when the functino is passed true
        //call it only when the temperature is high enough
        if(keepSweat) {
            ++this.sweatCounter;
            if(this.sweatCounter >= this.sweatTime) {
                this.sweatCounter = 0;
                this.addSweat();
            }
        }
        
    }
}