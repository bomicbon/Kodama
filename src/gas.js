function gasGroup(game, player) {
    this.p = player;
    this.g = game;
    
    this.enemyGroup = this.g.add.group();
    
    this.health = 10; // formerly 40
    this.maxhealth = this.health;
    this.damage = 0.5; // formerly 0.2
    this.speed = 75;
    this.gravity = 0;
   
    
    //determines how long gas lives until destroy
    this.lifetime = 300;
    
    //Testing timer & scale variables.
    //this.timer = 0;
    //this.scale = 0;
    this.s_death = null;
    this.currentScale = null;
    var s_p_hurt = game.add.audio('p_hurt');
    
    this.create = function() {
        /*
        for (var i = 0; i < 5; i++) {
            this.add(150+Math.random()*500, 150+Math.random()*200,1,1);
        }
        */
        this.s_death = this.g.add.audio('gasdeath');
        this.s_death.allowMultiple = true;
    }
    
    this.update = function() {
        //this var prevents multiple damage in one update
        var overlapOne = false;
        for(var i = 0; i < this.enemyGroup.length; ++i) {
            object = this.enemyGroup.getAt(i);
            if(overlapOne == false && 
                this.g.physics.arcade.overlap(object, this.p, this.overlapping, null, this)) {
                overlapOne = true;
            }
            this.movement(object);
            // Health
            if(object.health <= 0){
                this.s_death.play(); // DEATH SOUND
                object.destroy();
                --i;
                var gas_die = game.add.sprite(object.body.x, object.body.y, 'gas');
                gas_die.animations.add('gas_die', [12,13,14,15,16,17,18,19,20,21], 20, false, true); 
                gas_die.alpha = object.alpha;
                gas_die.scale.setTo(object.scaleValue, object.scaleValue);
                gas_die.animations.play('gas_die');
      
            }
            // Scale Testing
            object.timer++;
            //E: changed object timer to work with lifetime
            if (object.timer%5 == 0) {
                this.currentScale = object.scaleValue += 0.01; // formerly 0.0005 i think
                object.scale.setTo(object.scaleValue, object.scaleValue);
                object.alpha -= 0.015; // formerly 0.01 i think
                //object.timer = 0;
            }
            
            if(object.timer > this.lifetime) {
                this.s_death.play(); // DEATH SOUND
                object.destroy();
                --i;
                
                var gas_fade = game.add.sprite(object.body.x, object.body.y, 'gas');
                gas_fade.animations.add('gas_fade', [5, 6, 7, 8, 9, 10, 11, 21], 25, false, true); 
                gas_fade.scale.setTo(object.scaleValue, object.scaleValue);
                gas_fade.alpha = object.alpha;
                gas_fade.animations.play('gas_fade');
            }
            //object.scale.setTo(1.0+this.scale, 1.0+this.scale);
            
        }
    }
    
    //add an gas given x, y, width, height
    this.add = function(x, y, width, height) {
        var gas = this.enemyGroup.create(x,y - 50, 'gas');            
       
        gas.animations.add('gas_idle', [0,1,2,3,4,3,2,1], 15, true);
        gas.animations.play('gas_idle');   
        
        gas.scale.setTo(0.1);
        gas.scaleValue = 0.1;
        gas.anchor.setTo(0.5);
        gas.timer = 0;
        this.g.physics.arcade.enable(gas);
        gas.body.gravity.y = this.gravity;
        gas.damage = this.damage;
        gas.health = this.health;
        return gas;
    }
    
    //overlap function called from the update function 
    //also halves the players movement speed
    this.overlapping = function(gas, player) {
            //subtract player health when touched
        this.p.health -= gas.damage;
            
        this.p.body.velocity.x /= 2;
        //change enemy tint to red and lower alpha
        this.p.tint = 0xFF0000;
        this.p.alpha = 0.8;
        //add a timer event half a second later to revert back to original settings
        this.g.time.events.add(Phaser.Timer.SECOND / 2, function() {
            this.p.tint = 0xFFFFFF;
            this.p.alpha = 1;
        }, this);
        s_p_hurt.play('',0,1,false,false); // HURT SOUND
            
    }
    
    this.movement = function(object) {
        //if the gas enemy is too far, move toward the player
        if(this.g.physics.arcade.distanceBetween(object, this.p.body) > 10) {
            this.g.physics.arcade.moveToObject(object, this.p.body, this.speed);
        }
        //if the gas enemy is on the player, set gas velocity to 0
        else{
            object.body.velocity.x = 0;
            object.body.velocity.y = 0;
        }
    }
}

function gasSpawnerSystem(game, gasClass, water) {
    this.g = game;
    //spawner health
    this.health = 80;
    
    this.spawnerGroup = this.g.add.group();
    this.gClass = gasClass;
    
    //spawn time rate
    this.spawnTime = 60 * 0.35; // formerly 60 * 4
    this.spawnRange = 600;
    restTime = this.spawnTime * 3;
    restCounter = 0;
    var s_collapse = game.add.audio('collapse');
    
    this.create = function() {
        this.add(1348, 330);
        this.add(2498, 330);
    }
    
    this.add = function(x,y) {
        var sprite = this.spawnerGroup.create(x, y, "factorypipe");
        sprite.animations.add('factorypipe', [0,1,2,3,4,5,6,7], 17, true);
        sprite.animations.play('factorypipe');    
        this.g.physics.arcade.enable(sprite);
        sprite.counter = 0;
        sprite.anchor.setTo(0.5, 0.5);
        sprite.health = this.health;
        sprite.body.setSize(35, 115, 0, 55); // hitbox
        sprite.body.immovable = true;
        return sprite;
        
    }
    
    this.update = function() {
        game.physics.arcade.overlap(this.spawnerGroup, water.projList, this.damage, null, this);
        for(var i = 0; i < this.spawnerGroup.length; ++i) {
            var spawner = this.spawnerGroup.getAt(i);
            if(game.physics.arcade.distanceBetween(spawner,player) < this.spawnRange) {
                ++restCounter;
                if (restCounter > restTime) {
                    spawner.counter += 1;
                    //spawns a gas at the spawner when the timer is up
                    if(spawner.counter > this.spawnTime) {
                        spawner.counter = 0;
                        gasClass.add(spawner.x, spawner.y, 0.1, 0.1);
                    }
                    if(restCounter == 2 * restTime + 5) {
                        restCounter = 0;
                    }
                    
                }
                    
                //if the spawner dies, destroy
                if(spawner.health <= 0) {
                    spawner.destroy();
                    --i;
                    var spawner_die = game.add.sprite(spawner.body.x-17, spawner.body.y-125, 'factorypipe');
              		spawner_die.animations.add('factorypipe_die', [8, 9, 10, 11, 12, 13, 14], 17, false); // pipe death animation
                	spawner_die.animations.play('factorypipe_die');
                	s_collapse.play();
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