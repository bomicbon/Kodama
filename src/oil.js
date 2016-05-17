function oilGroup(game, player) {
    this.p = player;
    this.g = game;
    
    this.oils = this.g.add.group();
    
    this.counter = 0;
    this.stepTime = 20;
    
    this.create = function() {
        this.add(400,585, 5, 1);
    }
    
    //loops through the oil group and checks for overlap with a player
    this.update = function() {
        this.oils.forEach(function(object) {
            this.overlapping(object);
        }, this);
    }
    
    //add an oil slick given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var oil = this.oils.create(x,y, 'oil');       
        oil.scale.setTo(width, heigth) 
    }
    
    //overlap function called from the update function 
    //also halves the players movement speed
    this.overlapping = function(body) {
        if(Phaser.Rectangle.intersects(this.p.body.sprite.getBounds(),body.getBounds())) {
            ++this.counter;
            this.p.body.velocity.y /= 4;
            if(this.counter > this.stepTime * 2) {
                this.counter = 0;
            }
            else if(this.counter >= this.stepTime) {
                this.p.body.velocity.x /= 2;
            }
            else {
                this.p.body.velocity.x = 0;
            }
            
        }
        else {
            this.counter = 0;
        }
    }
}