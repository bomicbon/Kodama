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
    
    var treeHealSound = game.add.audio('tree_healed');
    tree_healed_count = 0;
    tree_healed_count_prev = 0;
    
    //Sound
    this.tree_healed = null;
    sound_delay = 0;
    sound_length = 100;
    
    //shield barrier for first water
    this.shield = null;
    
    this.orbSpawner = null;
    
    this.LeafManager = new LeafManager(this.g);
    
    
    this.inBossFight = false;
    
    // helper Text bool
    this.firstHealed = null;
    
    this.create = function() {
        this.addTree(450, 690, 1, 10);
        this.addTree(1600, 690, 1, 10);
        this.addTree(3150, 690, 1, 10);
        
     
    }
    
    this.update = function(boss) {
        this.g.physics.arcade.overlap(this.treeGroup, slime, this.slimeDamage, null, this);
        
        //always check orbSpawner
        if(this.orbSpawner != null) {
                this.orbSpawner.update();    
        }
        //and shield
        this.checkShield();
        
        if(this.inBossFight == false) {
            //if water overlaps with a tree, call overlapping function
            this.g.physics.arcade.overlap(this.treeGroup, this.wGroup.projList, this.overlapping, null, this);
            for (var i = 0; i < this.treeGroup.length; i++) {
                var tree = this.treeGroup.getAt(i);
                
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
                        this.firstHealed = tree.firstMax;
                        temperature_reading.temp -= 20;
                        this.p.health += 20;
                        this.explosion(tree);
                        //this.waterG.shotSize++;
                        this.orbSpawner = new greenOrbSpawnAt(this.g, this.p, tree.x, tree.y - tree.height/2, this.p, 5);
                    }
                    
                }
              
            }
            
            if (delta_timer==this.treeGroup.length) {
                this.all_watered = true;
            }
            delta_timer = 0;            
        }
        
        //in boss fight
        else {
            
            //Mainly used for LEAF MANAGER ***
            this.treeGroup.forEach(function(tree) {
                if(boss.sprite.x - tree.x < 550 && tree.launched == false) {
                    //launch leaves at the boss 
                    //amount depends on tree health percent
                    var leaves = Math.round(tree.health / this.maxHealth * 40);
                    //console.log(leaves);
                    this.LeafManager.addLeaves(tree.x, tree.y - tree.height/2, leaves);
                    tree.launched = true;
                    
                    //play correct animation from whichever stage it is on
                    if(tree.health == this.maxHealth) {
                        tree.animations.play('useUpAll');
                    }
                    if(tree.health >= this.maxHealth * 2/3) {
                        tree.animations.play('useUpSome');
                    }
                    else if(tree.health >= this.maxHealth / 3) {
                        tree.animations.play('shrink1');
                    }
                    
                    tree.health = 0;
                }
            }, this);
            
            this.LeafManager.update(boss);
        }
    }
    
    //add an tree given x, y, width, height
    this.addTree = function(x, y, width, height) {
        var tree = this.treeGroup.create(x,y, 'tree'); 
        tree.scale.setTo(1, 1) 
        tree.anchor.setTo(0.5,1);
        this.g.physics.arcade.enable(tree);
        tree.health = this.health;
        tree.body.immovable = true;
        tree.firstMax = false;
        this.firstHealed = tree.firstMax;
        //used with the leaf spawn to spawn one group
        tree.launched = false;
        
         // Animations
        tree.animations.add('grow1', [1, 2, 3], 15, false);
        tree.animations.add('grow2', [4, 5, 6], 15, false);
        tree.animations.add('grow3', [7, 8, 9], 15, false);
        tree.animations.add('shrink1', [3, 2, 1, 0], 15, false);
        tree.animations.add('shrink2', [6, 5, 4], 15, false);
        tree.animations.add('shrink3', [9, 8, 7], 15, false);
        tree.animations.add('useUpAll', [9,7,8,6,5,4,3,2,1,0], 5, false);
        tree.animations.add('useUpSome', [6,5,4,3,2,1,0], 10, false);
        
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
            
            tree.tint = 0xFF0000;
            tree.alpha = 0.8;
            game.time.events.add(Phaser.Timer.SECOND / 2, function() {
                tree.tint = 0xFFFFFF;
                tree.alpha = 1;
            }, this);
            
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
        treeHealSound.play();
        
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

function LeafManager(game) {
    
    this.leafGroup = game.add.group();
    
    var speed = 1000;
    
    var damage = 10;
    var leafUp = game.add.audio('leaf1');
    var leafSwoosh = game.add.audio('leaf2');
    
    //range is used to give a range of x and y maximum values
    //relative to the given coordinates
    var range = 100;
    
    this.addLeaves = function(x,y, count) {
        for(var i = 0; i < count; ++i) {
                        
            //leaf is created at every 1/4 second
            game.time.events.add(Phaser.Timer.SECOND * i/6, function() {
                //random x and y in a set range
                var randX = Math.random() - 0.5;
                var randY = Math.random() - 0.6;
            
                var leaf = this.leafGroup.create(x + range * randX, y + range * randY, 'leaf');
                leaf.anchor.setTo(0.5);
                leaf.alpha = 0;
                leaf.scale.setTo(0.2);
                leaf.moveTime = 180;
                leaf.spinRot = 44;
                game.physics.arcade.enable(leaf);
                
                //tween to fade the leaf sprite into the game
                var leafY = y + range * randY;
                game.add.tween(leaf).to({alpha: 1, y: leafY - 50}, 2000, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                game.add.tween(leaf).to({rotation: leaf.spinRot}, 2000, Phaser.Easing.Linear.None, true);
                //game.add.tween(leaf).to({rotation: })
                
                leafUp.play();
            }, this);
            
        }
        
    }
    
    //pass boss object to function so that it can fly to it and damage it
    this.update = function(boss) {
        for(var i = 0; i < this.leafGroup.length; ++i) {
            var leaf = this.leafGroup.getAt(i);
            //checks if its time to move the leaf yet
            --leaf.moveTime;
            //console.log(leaf.moveTime);
            
            //have to goto XY since the boss anchor is at the bottom middle
            var bossX = boss.sprite.x;
            var bossY = boss.sprite.y - boss.sprite.height/2;
            
            if(leaf.moveTime == 0) {
                leafSwoosh.play();
            }
            else if(leaf.moveTime <= 1) {
                game.physics.arcade.moveToXY(leaf, bossX, bossY, speed);
                if(game.physics.arcade.distanceToXY(leaf, bossX, bossY) < 150) {
                    --i;
                    boss.health -= damage; 
                    leaf.destroy();
                    
                    //change tint, call time event later in half a second to revert back
                    boss.sprite.tint = 0x00FFFF;
                    boss.sprite.alpha = 0.8;
                    game.time.events.add(Phaser.Timer.SECOND / 2, function() {
                        boss.sprite.tint = 0xFFFFFF;
                        boss.sprite.alpha = 1;
                    }, this);
                }
            }
            else if(leaf.moveTime == 60) {
                var pointRot = game.physics.arcade.angleToXY(leaf, bossX, bossY);
                game.add.tween(leaf).to({rotation: pointRot + 1.5}, 1000, Phaser.Easing.Exponential.Out, true);
            }
        }
    }
    
}