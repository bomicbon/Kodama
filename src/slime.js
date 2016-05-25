function slimeGroup(game, player, ground) {
    this.p = player;
    this.g = game;
    this.ground = ground;
    
    this.enemyGroup = this.g.add.group();
    
    this.counter = 0;
    this.stepTime = 20;
    this.gravity = 1000;
    this.damage = 0.2;
    this.health = 20;
    
    this.slimeSpeed = 50; // Speed of slime 
    this.slimeDelay = 30; // Time in between slime steps
    this.slimeBounce = 0.3; // bounciness
    this.slimeStepCount = 0; // Counts the steps
    this.slimeStepMax = 90; // Max number of steps in one direction
    this.slimeTimer = 0;
    
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
    
    //loops through the slime group and checks for overlap with a player
    this.update = function() {
        for(var i = 0; i < this.enemyGroup.length; ++i) {
           var object = this.enemyGroup.getAt(i);
           if(object.health <= 0) {
                object.destroy();
                --i;
                
                var explosion = game.add.sprite(object.body.x, object.body.y, 'kaboom');
                explosion.animations.add('kaboom');
                explosion.animations.play('kaboom', 30, false, true);

           }
           this.overlapping(object);
           this.movement(object); // Movement Code
           
        }
    }
    
    //add an slime slick given x, y, width, height
    this.add = function(x, y, width, height) {
        var slime = this.enemyGroup.create(x,y, 'slime');   
        slime.animations.add('slime');
        slime.animations.play('slime', 15, true);    
        slime.scale.setTo(width, height);
        slime.anchor.setTo(0.5);
        this.g.physics.arcade.enable(slime);
        slime.body.gravity.y = this.gravity;
        slime.damage = this.damage;
        slime.health = this.health;
        slime.counter = this.counter;
        slime.stepTime = this.stepTime;
        slime.body.bounce.setTo(this.slimeBounce, this.slimeBounce)
        //direction tells which way the slime will go (used in spawner)
        slime.direction = -1;
        return slime;
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
        //body.body.bounce.setTo(this.slimeBounce, this.slimeBounce); // Bounciness
        
        /*
        ++this.slimeTimer; // Times duration of movement
        if (this.slimeTimer > this.slimeDelay) { // Resets the timer
            this.slimeTimer = 0;
        }
        if (this.slimeTimer > 0.5*this.slimeDelay) {
            body.body.velocity.x = this.slimeSpeed;
        }
        else {
            body.body.velocity.x = 0;
            this.slimeStepCount++;

        }
        if(this.slimeStepCount == this.slimeStepMax) {
            this.slimeSpeed = this.slimeSpeed * -1;
            this.slimeStepCount = 0;
        }
        */
        
        //changing code to test for slime hitting tree
        if(body.body.touching.down) {
            body.body.velocity.x = 50 * body.direction;
        }
    }
}

function slimeSpawner(game, player, slime, water) {
    //spawner health
    this.health = 50;
    
    //time between spawns
    this.spawnTime = 60 * 3;
    
    this.spawnRange = 800;
    
    this.spawnerGroup = game.add.group();
    
    this.create = function() {
        this.add(700, 495, -1);
        this.add(2000, 400, -1);
        this.add(2900, 495, 1);
        this.add(3300, 495, -1);
    }
    
    this.add = function(x,y, direction) {
        var spawner = this.spawnerGroup.create(x,y,'follower');
        game.physics.arcade.enable(spawner);
        spawner.counter = 0;
        spawner.anchor.setTo(0.5);
        spawner.health = this.health;
        spawner.body.immovable = true;
        //negative direction spawns slime moving left, positive is right
        spawner.direction = direction;
        return spawner;
        
    }
    
    this.update = function() {
        game.physics.arcade.collide(this.spawnerGroup, water.projList, this.damage, null, this);
        
        for(var i = 0; i < this.spawnerGroup.length; ++i) {
            var spawner = this.spawnerGroup.getAt(i);
            if(game.physics.arcade.distanceBetween(spawner,player) < this.spawnRange) {
                spawner.counter += 1;
                //spawns a slime at the spawner after the timer is up
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
    }
    
    //called when water hits the spawner
    this.damage = function(spawner, waterBody) {
        spawner.health -= waterBody.damage;
        
        water.hitCollision(waterBody, null);
    }
}