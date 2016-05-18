/*function flowerGroup(game, player, wcShooter, oilG){
    this.g = game;
    this.p = player;
    this.ground = ground;
    this.oil = oilG;
    this.flowers = this.g.add.group();
    
    
    this.create = function() {
        this.add(400,400, 1, 1); 
    }
    
    //loops through the oil group and checks for overlap with a player
    this.update = function() {
        this.oils.forEach(function(object) {
            this.overlapping(object);
        }, this);
    }
    
    //add an oil slick given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var flower = this.flowers.create(x,y, 'flower_black');       
        oil.scale.setTo(width, heigth) 
        this.g.physics.arcade.enable('flower_black');
        flower.body.gravity.y = this.gravity;
    }
    
    //overlap function called from the update function 
    //also halves the players movement speed
    this.overlapping = function(body) {
        if(Phaser.Rectangle.intersects(this.flowers.body.sprite.getBounds(),body.getBounds())) {
            
        }
        else {
        }
    }
}

*/