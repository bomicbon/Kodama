function wateringcanShooter(game, player, collisionGroup) {
    this.p = player;
    this.g = game;
    this.cGroup = collisionGroup;

    this.speed = 200;
    this.damage = 10;
    this.gravity = 1300;
    this.initUpVelocity = -300;
    this.scale = 2.0; // Bigger Water
    
    this.delay = 20;
    this.delayCount = 0;

    this.key = null;
    this.projList = this.g.add.group();
    
    this.bounds = Phaser.Rectangle.clone(this.g.world.bounds);

    this.create = function () {
        //looks for key input and spawns a new projectile
        this.key = this.g.input.keyboard.addKey(Phaser.Keyboard.X);
        this.key.onDown.add(this.spawnWater, this);

        this.g.input.keyboard.removeKeyCapture(Phaser.Keyboard.X);
    }
    

    this.update = function () {
        //add to counter for delay counter
        if(this.delayCount < this.delay) {
            ++this.delayCount;
        }
        this.projList.forEach(function(item) {
            //if collide, call hitCollision
            this.g.physics.arcade.collide(item, this.cGroup, this.hitCollision, null, this);
        }, this);
    }

    this.spawnWater = function () {
        // I removed the delay cuz basically
        // 1. delay count doesn't do anything
        // 2. if else statement basically waits for water sprite to be out of bounds before player can shoot again...
        
        //if delay is passed
        //if(this.delayCount >= this.delay && attackDelay) {
        	//attackDelay = false;
            //this.delayCount = 0;
            
            //shoot projectile to left
            if (!faceRight){
           		var projL = this.g.add.sprite(this.p.body.x + this.p.body.halfWidth, this.p.body.y, 'water');
	            this.g.physics.arcade.enable(projL);
	            projL.body.gravity.y = this.gravity;
	            projL.body.velocity.x = (-1) * this.speed;
	            projL.body.velocity.y = this.initUpVelocity;
	            projL.scale.setTo(this.scale, this.scale);
	            projL.damage = this.damage;
                
                //destroy when out of bounds
                projL.checkWorldBounds = true;
                projL.outOfBoundsKill = true;

                this.projList.add(projL);
            }
           
           //shoot projectile to right
            else{
            	var projR = this.g.add.sprite(this.p.body.x + this.p.body.halfWidth, this.p.body.y, 'water');
	            this.g.physics.arcade.enable(projR);
	            projR.body.gravity.y = this.gravity;
	            projR.body.velocity.x = this.speed;
	            projR.body.velocity.y = this.initUpVelocity;
	            projR.scale.setTo(this.scale, this.scale);
	            projR.damage = this.damage;
                
                //destroy when out of bounds
                projR.checkWorldBounds = true;
                projR.outOfBoundsKill = true;
            
                this.projList.add(projR);
            }
                        
            
        //}
        //else
        //attackDelay = true;
    }

    //this is a the collision event for when the projectile hits a wall
    // or something, it changes its rotation depending on where collision happened
    this.hitCollision = function (body1, body2) {
        var splash_obj = game.add.sprite(body1.body.x, body1.body.y, 'splash'); // declaring where to add sprite animation
        splash_obj.animations.add('splash'); // add the animation ability 'splash'
        splash_obj.animations.play('splash', 30, false);
        
        /* Why are we rotating the water object???
        var hitSprite = this.g.add.sprite(body1.body.x, body1.body.y, 'water');
        hitSprite.scale.setTo(this.scale, this.scale);
        hitSprite.anchor.setTo(0.5,0.5);
        */
        
        /*
        Commented out.
        if(body1.body.touching.up) {
            hitSprite.angle = 180;
        }
        else if(body1.body.touching.left) {
            hitSprite.angle = 90;
        }
        else if(body1.body.touching.right) {
            hitSprite.angle = -90;
            hitSprite.x += hitSprite.width;
        }
        else {
            hitSprite.y += hitSprite.height;
        }
        */

        this.projList.removeChild(body1);
    }


}