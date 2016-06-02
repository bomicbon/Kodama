function Boss(game, player, water, gasSpawner, slimes, trees) {
    this.g = game;
    this.p = player;
    this.water = water;
    this.wGroup = water.projList;
    
    //health of boss
    var MAX_HEALTH = 2000; // need the MAX_HEALTH CONSTANT FOR SPAWNING DYNAMICS
    this.health = MAX_HEALTH; 
    this.damage = 20;
    this.speed = 30;
    this.maxHealth = this.health;
    
    this.scaleX = 0.8;
    this.scaleY = 1.0;
        
    //where the boss spawns
    this.startPosition = 800
    //this.g.world.width - 100;
    this.startY = 680;
    
    //used in harmony with the x component sprite scale change
    this.deadZX = this.g.camera.width * 0.85;
    
    //boss sprite
    this.sprite = null;
    
    //a gas spawner on the left of the boss
    this.leftSpawner = null;
    
    //a gas spawner on the right of the boss
    this.rightSpawner = null;
    
    //this.bossGroup = this.g.add.group();
    this.bossLeft = null;
    this.bossRight = null;
    this.armHeight = 50;
    
    var REST_TIME = 60 * 4;
    var SLIME_TIME = 60 * 2;
    var health_delta = 0;
    
    this.restTime = 60 * 4;
    this.restCounter = 0;
    this.slimeTime = 60 * 2;
    this.slimeCounter = 0;
    
    this.s_spawn = null;
    var s_p_hurt = game.add.audio('p_hurt');
        
    this.create = function() {
        if (this.sprite == null) {
            this.g.camera.unfollow();
        
            this.sprite = this.g.add.sprite(this.startPosition + 250, this.startY,'blobSheet');
            this.sprite.scale.setTo(this.scaleX, this.scaleY);
            this.g.physics.arcade.enable(this.sprite);
            this.sprite.anchor.setTo(0.5, 1);
            this.sprite.body.gravity.y = 0;
            this.sprite.body.immovable = true;
            
            this.sprite.animations.add("walk", [0,1,2,3,4,3,2,1,0,5,6,7,8,7,6,5], 10, true);
            this.sprite.animations.play("walk");
            
            //left and right arm            
            this.bossLeft = this.g.add.sprite(-this.sprite.width/2 + 50, -this.armHeight - this.sprite.height/2, "blobL");
            this.bossLeft.anchor.setTo(1, 0.5);
            //arm rotate
            this.g.add.tween(this.bossLeft).to({angle: 90}, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, 999999, true);
            this.sprite.addChild(this.bossLeft);
            
            this.bossRight = this.g.add.sprite(this.sprite.width/2 - 50, -this.armHeight - this.sprite.height/2, "blobR")
            this.bossRight.anchor.setTo(0, 0.5);
            this.bossRight.angle = 30;
            //arm rotate at slight angle and slower than left
            this.g.add.tween(this.bossRight).to({angle: -60}, 1300, Phaser.Easing.Sinusoidal.InOut, true, 0, 999999, true);
            this.sprite.addChild(this.bossRight);
            
            //set camera onto boss
            var camera = this.g.camera;
            camera.follow(this.sprite);
            camera.deadzone = new Phaser.Rectangle(this.deadZX, 0, camera.width / 4, 10);
            
            //gas spawners
            this.leftSpawner = gasSpawner.addCustom("bosscloud");
			this.leftSpawner.animations.add('bosscloud', [0,1,2,3,2,1], 14, true);
      		this.leftSpawner.animations.play('bosscloud');  
      		this.leftSpawner.scale.setTo(0.6, 0.8);
            //this.bossGroup.add(this.leftSpawner);
            
            this.rightSpawner = gasSpawner.addCustom("bosscloud");
			this.rightSpawner.animations.add('bosscloud', [0,1,2,3,2,1], 14, true);
      		this.rightSpawner.animations.play('bosscloud');  
      		this.rightSpawner.scale.setTo(0.6, 0.8);
           // this.bossGroup.add(this.rightSpawner);

            trees.inBossFight = true;
            //this.bossGroup.sort();
            
            this.s_spawn = this.g.add.audio('boss_spawn');
            this.s_spawn.volume = 0.8;
        }
    }
    
    this.update = function() {        
        if (this.sprite != null) {
            //change scale depending on its health
            var scaleX = this.health / this.maxHealth * this.scaleX;
            if(scaleX < this.scaleX / 8) {
                scaleX = this.scaleX / 8;
            }
            var scaleY = this.health / this.maxHealth * this.scaleY;
            if(scaleY < this.scaleY / 8) {
                scaleY = this.scaleY / 8;
            }
            //change x of object to compensate for the scale down
            this.g.camera.deadzone.x = this.deadZX + (this.scaleY - scaleY) * 100;
            this.sprite.scale.setTo(scaleX, scaleY);


            // BOSS HEALTH DYNAMICS
            if(this.health <= 0) {
                // DON'T GO TO STAGE CLEARED JUST YET
                // 1. DESTROY ALL OBJECTS
                // 2. ANIMATE DEATH
                // 3. ADD SUCCESS SPRITE & MENU OPTIONS
                // 4. LEAVE PLAYER IN GAME TO CHOOSE MAIN MENU
                this.g.state.start("StageCleared", true, false);
            }
            
            MAX_HEALTH = 2000;
            REST_TIME = 60 * 4;
            SLIME_TIME = 60 * 2;
            var health_delta = MAX_HEALTH - this.health; // Health difference
            this.restTime = REST_TIME - (Math.random()*15 + 15)*(health_delta/500);
            this.slimeTime = SLIME_TIME - (55 + Math.random()*25)*(health_delta/500);
            if (this.slimeTime < 60 * 0.35) {
                this.slimeTime = 60 * 0.35;
            }
            
            // Makes Boss Spawn more Frequently
            if (this.health == 1500) {
                this.restTime = 60 * 3.0;
                this.slimeTime = 60 * 1;
            }
            // FASTER
            if (this.health == 1000) {
                this.restTime = 60 * 2.5;
                this.slimeTime = 60 * 0.65;
            }
            // FASTEREST
            if (this.health == 500) {
                this.restTime = 60 * 2.0;
                this.slimeTime = 60 * 0.45;
            }
            
            //move sprite and its gas spawners
            this.sprite.body.velocity.x = -this.speed;
            
            this.leftSpawner.x = this.sprite.x - this.sprite.width / 2;
            this.leftSpawner.y = this.sprite.y - this.sprite.height;

            this.rightSpawner.x = this.sprite.x + this.sprite.width / 2;
            this.rightSpawner.y = this.sprite.y - this.sprite.height;
            
            //prevent player from leaving camera
            if(this.p.x - this.p.width/2 <= this.g.camera.x) {
                this.p.x = this.g.camera.x + this.p.width/2;
            }
            
            //check for collision between player and boss, and boss and water
            this.g.physics.arcade.collide(this.sprite, this.p, this.hurtPlayer, null, this);
            this.g.physics.arcade.collide(this.sprite, this.wGroup, this.damageBoss, null, this);
            //this.g.physics.arcade.overlap(this.sprite, trees.treeGroup, this.treeDamage, null, this);
            
            this.restCounter += 1;
            if (this.restCounter > this.restTime) {
                this.slimeCounter += 1;
                
                //prepare boss animation
                //lower arms
                if (this.slimeCounter > this.slimeTime / 2) {
                    this.g.add.tween(this.bossLeft).to({angle: -90}, this.slimeTime/2, Phaser.Easing.Linear.None, true);
                    this.g.add.tween(this.bossRight).to({angle: 90}, this.slimeTime/2, Phaser.Easing.Linear.None, true);
                }
                
                if (this.slimeCounter > this.slimeTime) {
                    this.slimeCounter = 0;
                    
                    //boss animations
                    //swing arms
                    this.g.add.tween(this.bossLeft).to({angle: 80}, 500, Phaser.Easing.Exponential.Out, true);
                    this.g.add.tween(this.bossRight).to({angle: -80}, 500, Phaser.Easing.Exponential.Out, true);
                    
                    var sX = this.sprite.x - this.sprite.width/2;
                    var sY = this.sprite.y - this.sprite.height/2;
                    
                    var slime1 = slimes.add(sX, sY , 1, 1);
                    slime1.body.velocity.x = -100 - Math.random()*150; // -100
                    slime1.body.velocity.y = 300 - Math.random()*100; // -300
                    slime1.damage /= 2;
                    
                    var slime2 = slimes.add(sX, sY, 1, 1);
                    slime2.body.velocity.x = -50 - Math.random()*150; // -50
                    slime2.body.velocity.y = -300 - Math.random()*100; // -300
                    slime2.damage /= 2;
                    
                    var slime3 = slimes.add(sX, sY, 1, 1);
                    slime3.body.velocity.x = -150 - Math.random()*150; // -150
                    slime3.body.velocity.y = -300 - Math.random()*100; // -300
                    slime3.damage /= 2;
                    
                    this.s_spawn.play(); // SPAWN SOUND
                }
                if (this.restCounter > 2 * this.restTime + 20) {
                    this.restCounter = 0;
                }
            }
        }
        else {
            //check if player is close enough
            if(player.body.x > this.startPosition - 200) {
			    this.create();
		    }
        }
        
    }
    
    //called when player touches boss
    this.hurtPlayer = function(boss, player){
        this.p.health -= this.damage;
        //knockback
        this.p.body.velocity.x = -300;
        this.p.body.velocity.y = -100;
        this.p.knocked = true;
        //change enemy tint to red and lower alpha
        this.p.tint = 0xFF0000;
        this.p.alpha = 0.8;
        //add a timer event half a second later to revert back to original settings
        this.g.time.events.add(Phaser.Timer.SECOND / 2, function() {
            this.p.tint = 0xFFFFFF;
            this.p.alpha = 1;
        }, this);
        s_p_hurt.play('',0,1,false,false);
    }
    
    //called when water hits boss
    this.damageBoss = function(boss, water) {
        this.health -= water.damage/2;
        this.water.hitCollision(water, null);
        //console.log(this.health);
    }
    
    //called when tree hits boss
    this.treeDamage = function(boss, tree) {
        this.health -= 4 * tree.health;
        tree.health = 0;
        
        //tree.loadTexture('flower_black', 0);
        //console.log(this.health);

    }
    
    this.isAlive = function() {
        if(sprite == null) return false;
        if(this.health < 1) return false;
        return true;
    }
}