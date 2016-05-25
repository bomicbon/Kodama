function Boss(game, player, water, gasSpawner, slimes, trees) {
    this.g = game;
    this.p = player;
    this.water = water;
    this.wGroup = water.projList;
    
    this.health = 2000;
    this.damage = 20;
    this.speed = 30;
    this.maxHealth = this.health;
    
    this.scaleX = 0.7;
    this.scaleY = 1.0;
        
    //where the boss spawns
    this.startPosition = this.g.world.width - 100;
    
    //boss sprite
    this.sprite = null;
    
    //a gas spawner on the left of the boss
    this.leftSpawner = null;
    var leftSpawnX = null;
    var leftSpawnY = null;
    
    //a gas spawner on the right of the boss
    this.rightSpawner = null;
    var rightSpawnX = null;
    var rightSpawnY = null;
    
    this.bossGroup = this.g.add.group();
    
    this.slimeTime = 60 * 4;
    this.slimeCounter = 0;
        
    this.create = function() {
        if(this.sprite == null) {
            this.g.camera.unfollow();
        
            this.sprite = this.bossGroup.create(this.startPosition, 300,'blob');
            this.sprite.scale.setTo(this.scaleX, this.scaleY);
            this.g.physics.arcade.enable(this.sprite);
            this.sprite.body.gravity.y = 0;
            this.sprite.body.immovable = true;
            
            //set camera onto boss
            var camera = this.g.camera;
            camera.follow(this.sprite);
            camera.deadzone = new Phaser.Rectangle(camera.width * 5/8, 0, camera.width / 4, 10);
            
            //gas spawners
            leftSpawnX = this.sprite.x;
            leftSpawnY = this.sprite.y;
            this.leftSpawner = gasSpawner.add(leftSpawnX, leftSpawnY, 1, 1);
            //this.bossGroup.add(this.leftSpawner);
            
            rightSpawnX = this.sprite.x + 50;
            rightSpawnY = this.sprite.y;
            this.rightSpawner = gasSpawner.add(rightSpawnX, rightSpawnY, 1, 1);
           // this.bossGroup.add(this.rightSpawner);
            
            this.bossGroup.sort();
        }
    }
    
    this.update = function() {        
        if(this.sprite != null) {
            trees.inBossFight = true;
            var scaleX = this.health / (this.maxHealth + 100) * this.scaleX;
            var scaleY = this.health / (this.maxHealth + 100) * this.scaleY;
            //this.sprite.y = this.sprite.y + scaleY / this.scaleY;
            this.sprite.scale.setTo(scaleX, scaleY);
            if(this.health <= 0) {
                this.g.state.start("StageCleared", true, false);
            }
            //move sprite and its gas spawners
            this.sprite.body.velocity.x = -this.speed;
            
            this.leftSpawner.x = this.sprite.x;
            this.rightSpawner.x = this.sprite.x + this.sprite.width/2;
            
            //prevent player from leaving camera
            if(this.p.x - this.p.width/2 <= this.g.camera.x) {
                this.p.x = this.g.camera.x + this.p.width/2;
            }
            
            //check for collision between player and boss, and boss and water
            this.g.physics.arcade.collide(this.sprite, this.p, this.hurtPlayer, null, this);
            this.g.physics.arcade.collide(this.sprite, this.wGroup, this.damageBoss, null, this);
            this.g.physics.arcade.overlap(this.sprite, trees.treeGroup, this.treeDamage, null, this);
            
            this.slimeCounter += 1;
            if(this.slimeCounter > this.slimeTime) {
                this.slimeCounter = 0;
                var slime1 = slimes.add(this.sprite.x, this.sprite.y, 1, 1);
                slime1.body.velocity.x = -100;
                slime1.body.velocity.y = -300;
                
                var slime2 = slimes.add(this.sprite.x, this.sprite.y, 1, 1);
                slime2.body.velocity.x = -50;
                slime2.body.velocity.y = -300;
                
                var slime3 = slimes.add(this.sprite.x, this.sprite.y, 1, 1);
                slime3.body.velocity.x = -150;
                slime3.body.velocity.y = -300;
                
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
    }
    
    //called when water hits boss
    this.damageBoss = function(boss, water) {
        this.health -= water.damage;
        this.water.hitCollision(water, null);
        console.log(this.health);
    }
    
    //called when tree hits boss
    this.treeDamage = function(boss, tree) {
        this.health -= 4 * tree.health;
        tree.health = 0;
        tree.loadTexture('flower_black', 0);
        console.log(this.health);

    }
    
    this.isAlive = function() {
        if(sprite == null) return false;
        if(sprite.health < 1) return false;
        return true;
    }
}