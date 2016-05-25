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
    
    tree_healed_count = 0;
    tree_healed_count_prev = 0;
    
    //Sound
    this.tree_healed = null;
    sound_delay = 0;
    sound_length = 100;
    
   
    stage3 = false;
    stage2 = false;
    stage1 = false;
    //shield barrier for first water
    this.shield = null;
    
    this.inBossFight = false;
    
    this.create = function() {
        /*
        for (var i = 0; i < 3; i++) {
            this.add (Math.random() * 100 + 100*i, 660, 1, 1);
        }
        */
        this.add(450, 690, 1, 10);
        this.add(1600, 495, 1, 10);
        this.add(3150, 495, 1, 10);
     
    }
    
    this.update = function() {
        this.g.physics.arcade.overlap(this.treeGroup, slime, this.slimeDamage, null, this);
        if(this.inBossFight == false) {
            //if water overlaps with a tree, call overlapping function
            this.g.physics.arcade.overlap(this.treeGroup, this.wGroup.projList, this.overlapping, null, this);
            for (var i = 0; i < this.treeGroup.length; i++) {
                tree = this.treeGroup.getAt(i);
                
                // Tree fully healed /*
                if (tree.health == 100) { //100
                	stage3 = true;
                  
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
                        //this.waterG.shotSize++;
                    }
                    
                }
                /*
                else if (tree.health >= 66 && tree.health <= 99){
                	stage2 = true;
                	stage1 = false;
                	stage3 = false;
                }
                	
                else if (tree.health >= 10 && tree.health <= 65) {
                	stage1 = true;
                	stage2 = false;
                	stage3 = false;
                }
                
                else if(tree.health < 10) {
                	tree.animations.play('dead'); 
                	stage1 = false;
                	stage2 = false;
                	stage3 = false;
                }
                
                if (stage3){
                	tree.animations.play('grow3'); 
                	//stage1 = false;
                	//stage2 = false;
                }
                else if (stage2){
                	
                	tree.animations.play('grow2'); 
                	//stage1 = false;
                	//stage3 = false;
                	
                }
                else if (stage1){  	
               	 	tree.animations.play('grow1'); 
               	 	//stage1 = false;
                	//stage2 = false;
                	//stage3 = false;
               	 	
               	 }
                
                */
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
        var tree = this.treeGroup.create(x,y, 'tree'); 
        tree.scale.setTo(1, 1) 
        tree.anchor.setTo(0.5,1);
        this.g.physics.arcade.enable(tree);
        tree.health = this.health;
        tree.body.immovable = true;
        tree.firstMax = false;
        
         // Animations
        tree.animations.add('grow1', [1, 2, 3], 15, false);
        tree.animations.add('grow2', [4, 5, 6], 15, false);
        tree.animations.add('grow3', [7, 8, 9], 15, false);
        tree.animations.add('shrink1', [3, 2, 1, 0], 15, false);
        tree.animations.add('shrink2', [6, 5, 4], 15, false);
        tree.animations.add('shrink3', [9, 8, 7], 15, false);
        
    }

    
    this.overlapping = function(tree, water) {
        var treeMid = tree.x;
        if(treeMid - 30 < water.x && treeMid + 30 > water.x
            && water.y > tree.y - 40) {
            //water hit animation
            this.wGroup.hitCollision(water, null);
            //add to tree health when water overlaps with it
            //console.log(tree.health);
            var prevHealth = tree.health;
            tree.health += this.waterHeal;
            if(tree.health > this.maxHealth){
                tree.health = this.maxHealth;
            }
            
            this.treeAnimation(prevHealth, tree.health, tree);
            
            //changes tint depending on its health
            var percentHealed = tree.health / this.maxHealth;
            //tree.tint = percentHealed.toFixed(2) * 0xFFFFFF;
        }
    }
    
    this.slimeDamage = function(tree, slime) {
        var treeMid = tree.x;
        if(treeMid - 25 < slime.x && treeMid + 25 > slime.x) {
            if(this.inBossFight == false) {
                var prevHealth = tree.health;
                tree.health -= 5;
                
                this.treeAnimation(prevHealth, tree.health, tree);
            }
            slime.health -= 8;
            if(tree.health <= 0) {
                tree.health = 0;
            }
            
            var sign = Math.sign(slime.x - tree.x);
            slime.body.velocity.x = sign * 200;
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
        var shield = this.g.add.sprite(tree.x, tree.y, "shield");
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
        this.playSound();
        
    }
    
    this.treeAnimation = function(prevHealth, newHealth, tree) {
        if(prevHealth < this.maxHealth / 3 && newHealth >= this.maxHealth / 3) {
            tree.animations.play('grow1');
        }
        else if(prevHealth < this.maxHealth * 2 / 3 && newHealth >= this.maxHealth * 2 / 3) {
            tree.animations.play('grow2');
        }
        else if(prevHealth < this.maxHealth && newHealth == this.maxHealth) {
            tree.animations.play('grow3');
        }
        //check shrink
        else if(prevHealth == this.maxHealth && newHealth < this.maxHealth) {
            tree.animations.play('shrink3');
        }
        else if(prevHealth > this.maxHealth * 2 / 3 && newHealth <= this.maxHealth * 2 / 3) {
            tree.animations.play('shrink2');
        }
        else if(prevHealth > this.maxHealth / 3 && newHealth <= this.maxHealth / 3) {
            tree.animations.play('shrink1');
        }
    }
    
    this.playSound = function() {
        tree_healed_count++;
        if (tree_healed_count != tree_healed_count_prev) {
            tree_healed_count_prev = tree_healed_count;
            this.tree_healed = true;
        }
        else {
            this.tree_healed = false;
        }
    }
    
 

}