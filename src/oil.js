function oilGroup(game, player, ground) {
    this.p = player;
    this.g = game;
    this.ground = ground;
    
    this.oils = this.g.add.group();
    
    this.counter = 0;
    this.stepTime = 20;
    this.gravity = 1000;
    
    this.oilSpeed = 50; // Speed of Oil 
    this.oilDelay = 30; // Time in between Oil steps
    this.oilBounce = 0.3; // bounciness
    this.oilStepCount = 0; // Counts the steps
    this.oilStepMax = 90; // Max number of steps in one direction
    this.oilTimer = 0;
    
    
    this.create = function() {
        this.add(400,400, 1, 1); // U: I set it to normal dimensions...
    }
    
    //loops through the oil group and checks for overlap with a player
    this.update = function() {
        this.oils.forEach(function(object) {
            this.overlapping(object);
            this.movement(object); // Movement Code
        }, this);
    }
    
    //add an oil slick given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var oil = this.oils.create(x,y, 'oil');       
        oil.scale.setTo(width, heigth) 
        this.g.physics.arcade.enable(oil);
        oil.body.gravity.y = this.gravity;
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
    
    this.movement = function(body) {
        this.g.physics.arcade.collide(body, this.ground);
        body.body.collideWorldBounds = true; // Collisions
        body.body.bounce.setTo(this.oilBounce, this.oilBounce); // Bounciness
        ++this.oilTimer; // Times duration of movement
        if (this.oilTimer > this.oilDelay) { // Resets the timer
            this.oilTimer = 0;
        }
        if (this.oilTimer > 0.5*this.oilDelay ) {
            body.body.velocity.x = this.oilSpeed;
        }
        else {
            body.body.velocity.x = 0;
            this.oilStepCount++;
        }
        if(this.oilStepCount == this.oilStepMax) {
            this.oilSpeed = this.oilSpeed * -1;
            this.oilStepCount = 0;
        }
    }
}