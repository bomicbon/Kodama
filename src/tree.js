function treeGroup(game, player, water, slime, gas, temperature_reading) {
    this.p = player;
    this.g = game;
    
    this.wGroup = water;
    this.treeGroup = this.g.add.group();
    
    this.health = 0;
    this.maxHealth = 100;
    //waterHeal is how fast the water will grow the tree
    this.waterHeal = 5;
    this.delta = 0; // the value passed in to the temperature in game.js
    delta_timer = 0; // how long delay is before incrementing temperature delta
    delta_value = 1; // temperature delta upon tree activation
    this.all_watered = null // bool for whether all plants have been activated
    
    //shield barrier for first water
    this.shield = null;
    
    this.inBossFight = false;
    
    this.create = function() {
        /*
        for (var i = 0; i < 3; i++) {
            this.add (Math.random() * 100 + 100*i, 660, 1, 1);
        }
        */
        this.add(400, 495, 1, 10);
        this.add(1550, 495, 1, 10);
        this.add(3100, 495, 1, 10);
    }
    
    this.update = function() {
        this.g.physics.arcade.overlap(this.treeGroup, slime, this.slimeDamage, null, this);
        if(this.inBossFight == false) {
            //if water overlaps with a tree, call overlapping function
            this.g.physics.arcade.overlap(this.treeGroup, this.wGroup.projList, this.overlapping, null, this);
            for (var i = 0; i < this.treeGroup.length; i++) {
                tree = this.treeGroup.getAt(i);
                // Tree fully healed
                if (tree.health == this.maxHealth) {
                    tree.loadTexture('flower', 0);
                    delta_timer++;
                    if (delta_timer == delta_value + 5) {
                        delta_value += 1;
                    }
                    this.delta = delta_value;
                        
                    if(tree.firstMax == false) {
                        tree.firstMax = true;
                        temperature_reading.temp -= 20;
                        this.p.health += 20;
                        this.explosion(tree);
                    }
                }
                
                else if(tree.health < this.maxHealth / 2) {
                    tree.loadTexture('flower_black', 0);

                }
                
            }
            
            if (delta_timer==this.treeGroup.length) {
                this.all_watered = true;
            }
            delta_timer = 0;
            
            this.checkShield();
        }
    }
    
    //add an tree given x, y, width, height
    this.add = function(x, y, width, height) {
        var tree = this.treeGroup.create(x,y, 'flower_black');       
        tree.scale.setTo(1, 1) 
        this.g.physics.arcade.enable(tree);
        tree.health = this.health;
        tree.body.immovable = true;
        tree.firstMax = false;
    }
    
    this.overlapping = function(tree, water) {
        var treeMid = tree.x + tree.width/2;
        if(treeMid - 30 < water.x && treeMid + 30 > water.x
            && water.y > tree.y + tree.height - 40) {
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
    }
    
    this.slimeDamage = function(tree, slime) {
        var treeMid = tree.x + tree.width/2;
        if(treeMid - 25 < slime.x && treeMid + 25 > slime.x) {
            if(this.inBossFight == false) {
                tree.health -= 5;
            }
            slime.health -= 8;
            if(tree.health <= 0) {
                tree.health = 0;
            }
            
            //var sign = Math.sign(slime.x - tree.x + tree.width/2);
            slime.body.velocity.x = -slime.direction * 200;
            slime.body.velocity.y = -100;
        }
    }

    //update function to destroy enemies overlapping shield
    this.checkShield = function() {
        if(this.shield != null) {
            for(var i = 0; i < slime.length; ++i) {
                var s = slime.getAt(i);
                if(this.g.physics.arcade.overlap(this.shield, s)) {
                    s.destroy();
                    --i;
                }
            }
            for(var i = 0; i < gas.length; ++i) {
                var g = gas.getAt(i);
                if(this.g.physics.arcade.overlap(this.shield, g)) {
                    g.destroy();
                    --i;
                }
            }
        }
    }
    
    
    //called when the tree first watered, destroy enemy in area    
    this.explosion = function(tree) {
        var shield = this.g.add.sprite(tree.x + tree.width/2, tree.y + tree.height, "shield");
        this.shield = shield;
        this.g.physics.arcade.enable(shield);
        shield.immovable = true;
        shield.anchor.setTo(0.5, 1);
        shield.scale.setTo(0);
        
        //tween that scales and lowers opacity over a time of 2 and 3 seconds.
        this.g.add.tween(shield.scale).to({x: 1, y: 1}, 3000, Phaser.Easing.Exponential.Out, true);
        this.g.add.tween(shield).to({alpha: 0}, 2000, Phaser.Easing.Exponential.In, true);
        //then destroyed after 4 seconds
        this.g.time.events.add(Phaser.Timer.SECOND * 4, function() {shield.destroy();}, this);
    }

}