function oilGroup(game, player, ground) {
    this.p = player;
    this.g = game;
    this.ground = ground;
    
    this.enemyGroup = this.g.add.group();
    this.removeList = [];
    
    this.counter = 0;
    this.stepTime = 20;
    this.gravity = 1000;
    this.damage = 0.2;
    this.health = 20;
    
    this.oilSpeed = 50; // Speed of Oil 
    this.oilDelay = 30; // Time in between Oil steps
    this.oilBounce = 0.3; // bounciness
    this.oilStepCount = 0; // Counts the steps
    this.oilStepMax = 90; // Max number of steps in one direction
    this.oilTimer = 0;
    
    this.create = function() {
        this.add(400,400, 1, 1); // U: I set it to normal dimensions...
        this.add(300, 0,1,1);
        this.add(600, 0, 1, 1);
        this.add(700, 0, 1, 1);
        this.add(1200, 400, 1, 1);
        this.add(1500, 0, 1, 1);
        this.add(1600, 0, 1, 1);
        this.add(2000, 0, 1, 1);
        this.add(2600, 0, 1, 1);
        this.add(3050, 0, 1, 1);
        for(var i = 0; i < 5; ++i) {
            this.add(3600+ i*20, 0, 1, 1);
        }        
    }
    
    //loops through the oil group and checks for overlap with a player
    this.update = function() {
        this.removeList = [];
        this.enemyGroup.forEach(function(object) {
           if(object.health <= 0) {
                this.removeList.push(object);
           }
           this.overlapping(object);
           this.movement(object); // Movement Code
           
        }, this);
        for(var i = 0; i < this.removeList.length; ++i) {
            this.enemyGroup.removeChild(this.removeList[i]);
        }
    }
    
    //add an oil slick given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var oil = this.enemyGroup.create(x,y, 'oil');       
        oil.scale.setTo(width, heigth) 
        this.g.physics.arcade.enable(oil);
        oil.body.gravity.y = this.gravity;
        oil.damage = this.damage;
        oil.health = this.health;
        oil.counter = this.counter;
        oil.stepTime = this.stepTime;
    }
    
    //overlap function called from the update function 
    //also halves the players movement speed
    this.overlapping = function(body) {
        if(Phaser.Rectangle.intersects(this.p.body.sprite.getBounds(),body.getBounds())) {
            body.counter += 1;
            this.p.body.velocity.y /= 4;

            //subtract player health when touched
            this.p.health -= body.damage;
            //console.log(this.p.health);

            if(body.counter > body.stepTime * 2) {
                body.counter = 0;
            }
            else if(body.counter >= body.stepTime) {
                this.p.body.velocity.x /= 2;
            }
            else {
                this.p.body.velocity.x = 0;
            }
            
        }
        else {
            body.counter = 0;
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