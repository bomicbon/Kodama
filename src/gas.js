function gasGroup(game, player) {
    this.p = player;
    this.g = game;
    
    this.enemyGroup = this.g.add.group();
    
    this.health = 50;
    this.maxhealth = this.health;
    this.damage = 0.2;
    this.speed = 50;
    this.gravity = 0;
    
    //Testing timer & scale variables.
    //this.timer = 0;
    //this.scale = 0;
    
    this.create = function() {
        for (var i = 0; i < 5; i++) {
            this.add(150+Math.random()*500, 150+Math.random()*200,1,1);
        }
    }
    
    this.update = function() {
        for(var i = 0; i < this.enemyGroup.length; ++i) {
            object = this.enemyGroup.getAt(i);
            this.overlapping(object);
            this.movement(object);
            // Health
            if(object.health <= 0){
                object.destroy();
                --i;
            }
            // Scale Testing
            object.timer++;
            if (object.timer==5) {
                object.scaleValue += 0.005;
                object.scale.setTo(object.scaleValue, object.scaleValue);
                object.timer = 0;
            }
            //object.scale.setTo(1.0+this.scale, 1.0+this.scale);
            
        }
    }
    
    //add an gas given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var gas = this.enemyGroup.create(x,y, 'gas');       
        gas.scale.setTo(width, heigth) 
        gas.scaleValue = 0.1;
        gas.timer = 0;
        this.g.physics.arcade.enable(gas);
        gas.body.gravity.y = this.gravity;
        gas.damage = this.damage;
        gas.health = this.health;
        return gas;
    }
    
    //overlap function called from the update function 
    //also halves the players movement speed
    this.overlapping = function(body) {
        if(Phaser.Rectangle.intersects(this.p.body.sprite.getBounds(),body.getBounds())) {
            //subtract player health when touched
            this.p.health -= body.damage;
            
            this.p.body.velocity.x /= 2;
            
        }
    }
    
    this.movement = function(object) {
        //if the gas enemy is too far, move toward the player
        if(this.g.physics.arcade.distanceBetween(object, this.p) > 10) {
            this.g.physics.arcade.moveToObject(object, this.p, this.speed);
        }
        //if the gas enemy is on the player, set velocity to 0
        else{
            object.body.velocity.x = 0;
            object.body.velocity.y = 0;
        }
    }
}

function gasSpawnerSystem(game, gasClass) {
    this.g = game;
    
    this.spawnerGroup = this.g.add.group();
    this.gClass = gasClass;
    
    this.spawnTime = 200;
    
    this.create = function() {
        this.add(100,300);
        
    }
    
    this.add = function(x,y) {
        var sprite = this.spawnerGroup.create(x, y, "follower");
        this.g.physics.arcade.enable(sprite);
        sprite.counter = 0;
        return sprite;
        
    }
    
    this.update = function() {
        this.spawnerGroup.forEach(function(spawner) {
            spawner.counter += 1;
            if(spawner.counter > this.spawnTime) {
                spawner.counter = 0;
                gasClass.add(spawner.x, spawner.y, 0.1, 0.1);
            }
        }, this);
    }
}