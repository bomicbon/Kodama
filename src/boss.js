function Boss(game, player, water, gasSpawner) {
    this.g = game;
    this.p = player;
    this.water = water;
    this.wGroup = water.projList;
    
    this.health = 1000;
    this.damage = 5;
    
    //where the boss spawns
    this.startPosition = 1000;
    
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
        
    this.create = function() {
        if(this.sprite == null) {
            this.g.camera.unfollow();
        
            this.sprite = this.bossGroup.create(this.startPosition, 300,'blob');
            this.sprite.scale.setTo(0.7, 1);
            this.g.physics.arcade.enable(this.sprite);
            this.sprite.body.gravity.y = 0;
            this.sprite.body.immovable = true;
            
            //set camera onto boss
            var camera = this.g.camera;
            camera.follow(this.sprite);
            camera.deadzone = new Phaser.Rectangle(camera.width * 5/8, 0, camera.width / 4, 10);
            
            //gas spawners
            this.leftSpawner = gasSpawner.add(leftSpawnX, leftSpawnY, 1, 1);
            this.bossGroup.add(this.leftSpawner);
            leftSpawnX = this.sprite.x;
            leftSpawnY = this.sprite.y;
            
            this.rightSpawner = gasSpawner.add(rightSpawnX, rightSpawnY, 1, 1);
            this.bossGroup.add(this.rightSpawner);
            rightSpawnX = this.sprite.x + 50;
            rightSpawnY = this.sprite.y;
        }
    }
    
    this.update = function() {        
        if(this.sprite != null) {
            //move sprite and its gas spawners
            this.sprite.body.velocity.x = -20;
            
            this.leftSpawner.x = this.sprite.x;
            this.rightSpawner.x = this.sprite.x + 50;
            
            //check for collision between player and boss, and boss and water
            this.g.physics.arcade.collide(this.sprite, this.p, this.hurtPlayer, null, this);
            this.g.physics.arcade.collide(this.sprite, this.wGroup, this.damageBoss, null, this);
        }
        
    }
    
    //called when player touches boss
    this.hurtPlayer = function(boss, player){
        this.p.health -= this.damage;
        //knockback
        this.p.body.velocity.x = -300;
        this.p.knocked = true;
    }
    
    //called when water hits boss
    this.damageBoss = function(boss, water) {
        this.health -= 10;
        
        this.water.hitCollision(water, null);
    }
}