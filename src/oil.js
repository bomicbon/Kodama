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
        /*
        this.add(400,400, 1, 1); // U: I set it to normal dimensions...
       // this.add(300, 0,1,1);
        this.add(600, 0, 1, 1);
        this.add(700, 0, 1, 1);
        this.add(1200, 400, 1, 1);
        this.add(1500, 0, 1, 1);
        this.add(1600, 0, 1, 1);
        this.add(2000, 0, 1, 1);
        this.add(2600, 0, 1, 1);
        this.add(3050, 0, 1, 1);
        */
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
        oil.body.bounce.setTo(this.oilBounce, this.oilBounce)
        //direction tells which way the oil will go (used in spawner)
        oil.direction = -1;
        return oil;
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
        
        //Ethan: bounciness should only be set once unless your changing it over time.
        //body.body.bounce.setTo(this.oilBounce, this.oilBounce); // Bounciness
        
        /*
        ++this.oilTimer; // Times duration of movement
        if (this.oilTimer > this.oilDelay) { // Resets the timer
            this.oilTimer = 0;
        }
        if (this.oilTimer > 0.5*this.oilDelay) {
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
        */
        
        //changing code to test for slime hitting tree
        if(body.body.touching.down) {
            body.body.velocity.x = 50 * body.direction;
        }
    }
}

function oilSpawner(game, player, slime, water) {
    //spawner health
    this.health = 50;
    
    //time between spawns
    this.spawnTime = 60 * 3;
    
    this.spawnerGroup = game.add.group();
    
    this.create = function() {
        this.add(700, 495, -1);
        this.add(1800, 400, -1);
        this.add(2800, 495, 1);
    }
    
    this.add = function(x,y, direction) {
        var spawner = this.spawnerGroup.create(x,y,'follower');
        game.physics.arcade.enable(spawner);
        spawner.counter = 0;
        spawner.anchor.setTo(0.5);
        spawner.health = this.health;
        spawner.body.immovable = true;
        //negative direction spawns oil moving left, positive is right
        spawner.direction = direction;
        return spawner;
        
    }
    
    this.update = function() {
        game.physics.arcade.collide(this.spawnerGroup, water.projList, this.damage, null, this);
        
        for(var i = 0; i < this.spawnerGroup.length; ++i) {
            var spawner = this.spawnerGroup.getAt(i);
            spawner.counter += 1;
            //spawns a oil at the spawner after the timer is up
            if(spawner.counter > this.spawnTime) {
                spawner.counter = 0;
                var slimeSprite = slime.add(spawner.x, spawner.y, 1, 1);
                slimeSprite.direction = spawner.direction;
            }
            //destory if health less 0
            if(spawner.health <= 0) {
                spawner.destroy();
                --i;
            }
        }
    }
    
    //called when water hits the spawner
    this.damage = function(spawner, waterBody) {
        spawner.health -= waterBody.damage;
        
        water.hitCollision(waterBody, null);
    }
}