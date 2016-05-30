function slimeGroup(game, player, ground) {
    this.p = player;
    this.g = game;
    this.ground = ground;
    
    this.enemyGroup = this.g.add.group();
    
    this.counter = 0;
    this.stepTime = 20;
    this.gravity = 1000;
    this.damage = 0.5; // formerly 0.2
    this.health = 10; // formerly 20
    
    this.aliveRange = 1000;
    
    this.slimeSpeed = 50; // Speed of slime 
    this.slimeDelay = 30; // Time in between slime steps
    this.slimeBounce = 0.6; // bounciness
    this.slimeStepCount = 0; // Counts the steps
    this.slimeStepMax = 90; // Max number of steps in one direction
    this.slimeTimer = 0;
    this.slimeJump = 0; // jump height
    jumpHeight = -200;
    var s_jump = null;
    var s_explosion =  null;
    var s_p_hurt = game.add.audio('p_hurt');
    
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
        s_jump = this.g.add.audio('slimejump');
        s_jump.allowMultiple = true;
        
        s_explosion = this.g.add.audio('explosion');
        s_jump.allowMultiple = true;
    }
    
    //loops through the slime group and checks for overlap with a player
    this.update = function() {
        //this var prevents multiple damages when multiple slimes overlap
        this.damaged = false;
        
        for(var i = 0; i < this.enemyGroup.length; ++i) {
           var object = this.enemyGroup.getAt(i);
           if(object.health <= 0) {
                object.destroy();
                --i;
                 // var explosion = game.add.sprite(object.body.x - 20, object.body.y - 46, 'kaboom');
               // explosion.animations.add('kaboom');
                //explosion.animations.play('kaboom', 30, false, true);
                
                /* what to make happen:
    			1. slime technically dies
    			2. check if slime is touching ground
    			3. if slime is touching ground, kill slime object and play slime_die animation */
                var slime_die = game.add.sprite(object.body.x, object.body.y, 'slime');
                slime_die.animations.add('slime_die', [4,5,6,7,8,9,10,11,12,13,14], 25, false, true); 
                slime_die.animations.play('slime_die');
                
                
                
                s_explosion.play();

           }
           this.overlapping(object, this);
           this.movement(object); // Movement Code
           
           //this destroys slimes that are outside of the alive Range from the player position
           //it helps prevent high memory usage, aka lag
           if(Math.abs(object.x - this.p.x) > this.aliveRange) {
               object.destroy();
               --i;
           }
        }
    }
    
    //add an slime slick given x, y, width, height
    this.add = function(x, y, width, height) {
        var slime = this.enemyGroup.create(x,y, 'slime');   
        slime.animations.add('slime', [0,1,2,3,2,1], 15, true);
    	/* what to make happen:
    	1. slime technically dies
    	2. check if slime is touching ground
    	3. if slime is touching ground, kill slime object and play slime_die animation */
		slime.animations.play('slime');    
		width += Math.random() / 2; // VARIABLE SLIME SIZES
		height = width;
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
    this.overlapping = function(enemy, top) {
        if(Phaser.Rectangle.intersects(this.p.body.sprite.getBounds(), enemy.getBounds())) {
            enemy.counter += 1;
            this.p.body.velocity.y /= 4;

            //subtract player health when touched
            if(top.damaged == false) {
                this.p.health -= enemy.damage;
                top.damaged = true;
            }
            //console.log(this.p.health);
            
            //make slime take slight dmg as well
            enemy.health -= 0.15;

            if(enemy.counter > enemy.stepTime * 2) {
                enemy.counter = 0;
            }
            else if(enemy.counter >= enemy.stepTime) {
                this.p.body.velocity.x /= 2;
            }
            else {
                this.p.body.velocity.x = 0;
            }
            //change player tint to red and lower alpha
            this.p.tint = 0xFF0000;
            this.p.alpha = 0.8;
            //add a timer event half a second later to revert back to original settings
            this.g.time.events.add(Phaser.Timer.SECOND / 2, function() {
                this.p.tint = 0xFFFFFF;
                this.p.alpha = 1;
            }, this);
            // HURT SOUND
            s_p_hurt.play('',0,1,false,false);
        }
        else {
            enemy.counter = 0;
        }
    }
    
    this.movement = function(enemy) {
        this.g.physics.arcade.collide(enemy, this.ground);
        enemy.body.collideWorldBounds = true; // Collisions
        
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
        //RANDOMIZING JUMP HEIGHT
        // HIGHER THAN USU
        if (Math.random() > 0.5) {
            this.slimeJump = jumpHeight + Math.random()*200;
        }
        // LOWER THAN USU
        else {
            this.slimeJump = jumpHeight - Math.random()*200;
        }
        // IF GROUNDED
        if(enemy.body.touching.down) {
            // MOVE THE SLIME
            if (Math.random() > 0.25) {
                enemy.body.velocity.x = enemy.direction * 150 * Math.random();
            }
            //this is where the slime jumps?
            // RE: YEUHHHHHHH
            // MAKE IT JUMP
            if (Math.random() > 0.5) {
                enemy.body.velocity.y = this.slimeJump;
                s_jump.play('',0,1,false, false);
            }
        }
        else {
       
        }
    }
}

function slimeSpawner(game, player, slime, water) {
    this.g = game;
    //spawner health
    this.health = 50;
    
    //time between spawns
    this.spawnTime = 60 * 0.4; // formerly 60 * 3
    
    this.spawnRange = 500;
    this.maxSlimeCount = 50;
    
    this.spawnerGroup = game.add.group();
    
    this.s_clang = null; // CLANG SOUND
    var s_bd = game.add.audio('barreldeath');
    
    this.create = function() {
        this.add(700, 552, -1);
        this.add(2000, 436, -1);
        this.add(2920, 552, 1);
        this.add(3440, 436, -1);
        this.s_clang = this.g.add.audio('clang');
    }
    
    this.add = function(x,y, direction) {
        var spawner = this.spawnerGroup.create(x,y,'spill');
        spawner.animations.add('spill', [0], 15, true);
        spawner.animations.play('spill');
        game.physics.arcade.enable(spawner);
        spawner.counter = 0;
        spawner.anchor.setTo(0.5);
        spawner.health = this.health;
        spawner.body.setSize(75, 70, 43, 0);
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
                //now prevents slime spawn when too many are on screen, prevents lag
                if(spawner.counter > this.spawnTime && slime.enemyGroup.length < this.maxSlimeCount) {
                    spawner.counter = 0;
                    var slimeSprite = slime.add(spawner.x, spawner.y, 1, 1);
                    slimeSprite.direction = spawner.direction;
                }
                //destory if health less 0 lol destory
                if(spawner.health <= 0) {
                    spawner.destroy();
                    --i;
                    var spawner_die = game.add.sprite(spawner.body.x-90, spawner.body.y, 'spill');
              		spawner_die.animations.add('spill_die', [1,1,2,2,3,3,4,4,5,5,6,7,7,8,9,10,10,11,12,13], 25, false); // spawner death animation
                	spawner_die.animations.play('spill_die');
                	s_bd.play();
                }
            }
        }
    }
    
    //called when water hits the spawner
    this.damage = function(spawner, waterBody) {
        spawner.health -= waterBody.damage;
        water.hitCollision(waterBody, null);
        this.s_clang.play();
    }
}