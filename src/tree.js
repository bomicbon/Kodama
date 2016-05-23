function treeGroup(game, player, water, slime) {
    this.p = player;
    this.g = game;
    
    this.wGroup = water;
    this.treeGroup = this.g.add.group();
    this.groundGroup = ground;
    
    this.health = 0;
    this.maxHealth = 100;
    //waterHeal is how fast the water will grow the tree
    this.waterHeal = 10;
    this.delta = 0; // the value passed in to the temperature in game.js
    delta_timer = 0; // how long delay is before incrementing temperature delta
    delta_value = 1; // temperature delta upon tree activation
    this.all_watered = null // bool for whether all plants have been activated
    
    
    
    this.create = function() {
        for (var i = 0; i < 3; i++) {
            this.add (Math.random() * 100 + 100*i, 660, 1, 1);
        }
        this.add(700, 500, 1, 1);
    }
    
    this.update = function() {
        //if water overlaps with a tree, call overlapping function
        this.g.physics.arcade.collide(this.treeGroup, this.wGroup.projList, this.overlapping, null, this);
        this.g.physics.arcade.collide(this.treeGroup, slime, this.slimeDamage, null, this);
        for (var i = 0; i < this.treeGroup.length; i++) {
            object = this.treeGroup.getAt(i);
            // Tree fully healed
            if (object.health == this.maxHealth) {
                object.loadTexture('flower', 0);
                delta_timer++;
                if (delta_timer == delta_value + 5) {
                    delta_value += 1;
                }
                this.delta = delta_value;
                
                if(object.firstMax == false) {
                    object.firstMax = true;
                    //REDUCE TOXICITY
                    // where urian
                }
            }
            else if(object.health < this.maxHealth / 2) {
                object.loadTexture('flower_black', 0);
            }
            
            //E: we don't need to change velocity since its immovable
            //object.body.velocity.x = 0;
            //object.body.velocity.y = gravity;
            
        }
        if (delta_timer==this.treeGroup.length) {
            this.all_watered = true;
        }
        delta_timer = 0;
    }
    
    //add an tree given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var tree = this.treeGroup.create(x,y, 'flower_black');       
        tree.scale.setTo(width, heigth) 
        this.g.physics.arcade.enable(tree);
        tree.health = this.health;
        tree.body.immovable = true;
        tree.firstMax = false;
    }
    
    this.overlapping = function(tree, water) {
        //water hit animation
        this.wGroup.hitCollision(water, null);
        //add to tree health when water overlaps with it
        //console.log(tree.health);
        tree.health += this.waterHeal;
        if(tree.health > this.maxHealth){
            tree.health = this.maxHealth;
        }
        
        //changes tint depending on its health
        var percentHealed = tree.health / this.maxHealth;
        tree.tint = percentHealed.toFixed(2) * 0xFFFFFF;
    }
    
    this.slimeDamage = function(tree, slime) {
        tree.health -= 5;
        if(tree.health <= 0) {
            tree.health = 0;
        }
        
        var sign = Math.sign(slime.x - tree.x);
        slime.body.velocity.x = sign * 200;
        slime.body.velocity.y = -100;
    }
    

}