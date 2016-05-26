function gasGroup(game, player) {
    this.p = player;
    this.g = game;
    
    this.enemyGroup = this.g.add.group();
    
    this.health = 40;
    this.maxhealth = this.health;
    this.damage = 0.2;
    this.speed = 50;
    this.gravity = 0;
    
    //determines how long gas lives until destroy
    this.lifetime = 60 * 15;
    
    //Testing timer & scale variables.
    //this.timer = 0;
    //this.scale = 0;
    
    this.create = function() {
        /*
        for (var i = 0; i < 5; i++) {
            this.add(150+Math.random()*500, 150+Math.random()*200,1,1);
        }
        */
    }
    
    this.update = function() {
        for(var i = 0; i < this.enemyGroup.length; ++i) {
            object = this.enemyGroup.getAt(i);
            this.g.physics.arcade.overlap(object, this.p, this.overlapping, null, this);
            this.movement(object);
            // Health
            if(object.health <= 0){
                object.destroy();
                --i;
            }
            // Scale Testing
            object.timer++;
            //E: changed object timer to work with lifetime
            if (object.timer%5 == 0) {
                object.scaleValue += 0.005;
                object.scale.setTo(object.scaleValue, object.scaleValue);
                //object.timer = 0;
            }
            
            if(object.timer > this.lifetime) {
                object.destroy();
                --i;
            }
            //object.scale.setTo(1.0+this.scale, 1.0+this.scale);
            
        }
    }
    
    //add an gas given x, y, width, height
    this.add = function(x, y, width, height) {
        var gas = this.enemyGroup.create(x,y - 50, 'gas');       
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
    this.spawnTime = 60 * 4;
    this.spawnRange = 600;
    
    this.create = function() {
        //this.add(100,300);
        this.add(1350, 400);
        this.add(2500, 355);
    }
    
    this.add = function(x,y) {
        var sprite = this.spawnerGroup.create(x, y, "pipe");
        this.g.physics.arcade.enable(sprite);
        sprite.counter = 0;
        sprite.anchor.setTo(0.5);
        sprite.health = this.health;
        sprite.body.immovable = true;
        return sprite;
        
    }
    
    this.update = function() {
        game.physics.arcade.collide(this.spawnerGroup, water.projList, this.damage, null, this);
        for(var i = 0; i < this.spawnerGroup.length; ++i) {
            var spawner = this.spawnerGroup.getAt(i);
            if(game.physics.arcade.distanceBetween(spawner,player) < this.spawnRange) {
                spawner.counter += 1;
                //spawns a gas at the spawner when the timer is up
                if(spawner.counter > this.spawnTime) {
                    spawner.counter = 0;
                    gasClass.add(spawner.x, spawner.y, 0.1, 0.1);
                }
                //if the spawner dies, destroy
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