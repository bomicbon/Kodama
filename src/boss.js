function Boss(game, player, water, gasSpawner, slimes, trees) {
    this.g = game;
    this.p = player;
    this.water = water;
    this.wGroup = water.projList;
    
    //health of boss
    this.health = 2000;
    this.damage = 20;
    this.speed = 30;
    this.maxHealth = this.health;
    
    this.scaleX = 0.7;
    this.scaleY = 1.0;
        
    //where the boss spawns
    this.startPosition = this.g.world.width - 100;
    this.startY = 680;
    
    //used in harmony with the x component sprite scale change
    this.deadZX = this.g.camera.width * 9/10;
    
    //boss sprite
    this.sprite = null;
    
    //a gas spawner on the left of the boss
    this.leftSpawner = null;
    
    //a gas spawner on the right of the boss
    this.rightSpawner = null;
    
    this.bossGroup = this.g.add.group();
    
    this.restTime = 60 * 4;
    this.restCounter = 0;
    this.slimeTime = 60 * 2;
    this.slimeCounter = 0;
        
    this.create = function() {
        if (this.sprite == null) {
            this.g.camera.unfollow();
        
            this.sprite = this.bossGroup.create(this.startPosition + 300, this.startY,'blob');
            this.sprite.scale.setTo(this.scaleX, this.scaleY);
            this.g.physics.arcade.enable(this.sprite);
            this.sprite.anchor.setTo(0.5, 1);
            this.sprite.body.gravity.y = 0;
            this.sprite.body.immovable = true;
            
            //set camera onto boss
            var camera = this.g.camera;
            camera.follow(this.sprite);
            camera.deadzone = new Phaser.Rectangle(this.deadZX, 0, camera.width / 4, 10);
            
            //gas spawners
            this.leftSpawner = gasSpawner.add(0, 0, 1, 1);
            //this.bossGroup.add(this.leftSpawner);
            
            this.rightSpawner = gasSpawner.add(0, 0, 1, 1);
           // this.bossGroup.add(this.rightSpawner);

            trees.inBossFight = true;
            this.bossGroup.sort();
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
            this.g.camera.deadzone.x = this.deadZX - (this.scaleY - scaleY) * 200;
            this.sprite.scale.setTo(scaleX, scaleY);


            // BOSS HEALTH DYNAMICS
            if(this.health <= 0) {
                this.g.state.start("StageCleared", true, false);
            }
            // Makes Boss Spawn more Frequently
            if (this.health == 1500) {
                this.restTime = 60 * 3.0;
                this.slimeTime = 60 * 1;
            }
            if (this.health == 1000) {
                this.restTime = 60 * 2.0;
                this.slimeTime = 60 * 0.50;
            }
            if (this.health == 500) {
                this.restTime = 60 * 1.5;
                this.slimeTime = 60 * 0.25;
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
                if (this.slimeCounter > this.slimeTime) {
                    this.slimeCounter = 0;
                    
                    var sX = this.sprite.x - this.sprite.width/2;
                    var sY = this.sprite.y - this.sprite.height/2;
                    
                    var slime1 = slimes.add(sX, sY , 1, 1);
                    slime1.body.velocity.x = -100;
                    slime1.body.velocity.y = -300;
                    
                    var slime2 = slimes.add(sX, sY, 1, 1);
                    slime2.body.velocity.x = -50;
                    slime2.body.velocity.y = -300;
                    
                    var slime3 = slimes.add(sX, sY, 1, 1);
                    slime3.body.velocity.x = -150;
                    slime3.body.velocity.y = -300;
                }
                if (this.restCounter == 2 * this.restTime + 20) {
                    this.restCounter = 0;
                }
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
    }
    
    //called when water hits boss
    this.damageBoss = function(boss, water) {
        this.health -= water.damage;
        this.water.hitCollision(water, null);
        //console.log(this.health);
    }
    
    //called when tree hits boss
    this.treeDamage = function(boss, tree) {
        this.health -= 4 * tree.health;
        tree.health = 0;
        tree.loadTexture('flower_black', 0);
        //console.log(this.health);

    }
    
    this.isAlive = function() {
        if(sprite == null) return false;
        if(this.health < 1) return false;
        return true;
    }
}