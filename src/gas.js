function gasGroup(game, player) {
    this.p = player;
    this.g = game;
    
    this.enemyGroup = this.g.add.group();
    
    this.health = 50;
    this.damage = 0.2;
    this.speed = 50;
    this.gravity = 0;
    
    this.create = function() {
        this.add(300, 300,1,1);
    }
    
    this.update = function() {
        for(var i = 0; i < this.enemyGroup.length; ++i) {
            object = this.enemyGroup.getAt(i);
            this.overlapping(object);
            this.movement(object);
        }
    }
    
    //add an oil slick given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var gas = this.enemyGroup.create(x,y, 'oil');       
        gas.scale.setTo(width, heigth) 
        this.g.physics.arcade.enable(gas);
        gas.body.gravity.y = this.gravity;
        gas.damage = this.damage;
        gas.health = this.health;
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
    
    this.movement = function(body) {
        if(this.g.physics.arcade.distanceBetween(body, this.p) > 8) {
            this.g.physics.arcade.moveToObject(body, this.p, this.speed);
        }
    }
}