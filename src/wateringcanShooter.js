function wateringcanShooter(game, player, collisionGroup) {
    this.p = player;
    this.g = game;
    this.cGroup = collisionGroup;

    this.speed = 300;
    this.damage = 0;
    this.gravity = 300;
    this.initUpVelocity = -100;
    this.scale = 0.5;
    
    this.delay = 20;
    this.delayCount = 0;

    this.key = null;
    this.projList = [];

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
        for (var i = 0; i < this.projList.length; ++i) {
            //if a projectile is null (destroyed) then remove it from the list
            if (this.projList[i] == null) {
                this.projList.splice(i, 1);
                --i;
                continue;
            }
            //if collide, call hitCollision
            this.g.physics.arcade.collide(this.projList[i], this.cGroup, this.hitCollision, null, this);
        }
    }

    this.spawnWater = function () {
        //if delay is passed
        if(this.delayCount >= this.delay && attackDelay) {
        	attackDelay = false;
            this.delayCount = 0;
            
            if (!faceRight){
           		var projL = game.add.sprite(this.p.body.x, this.p.body.y, 'flower');
	            this.g.physics.arcade.enable(projL);
	            projL.body.gravity.y = this.gravity;
	            projL.body.velocity.x = (-1) * this.speed;
	            projL.body.velocity.y = this.initUpVelocity;
	            projL.scale.setTo(this.scale, this.scale);
                
                //destroy when out of bounds
                projL.checkWorldBounds = true;
                projL.outOfBoundsKill = true;
            }
           
            else{
            	var projR = this.g.add.sprite(this.p.body.x+20, this.p.body.y, 'flower');
	            this.g.physics.arcade.enable(projR);
	            projR.body.gravity.y = this.gravity;
	            projR.body.velocity.x = this.speed;
	            projR.body.velocity.y = this.initUpVelocity;
	            projR.scale.setTo(this.scale, this.scale);
                
                //
                projR.checkWorldBounds = true;
                projR.outOfBoundsKill = true;
            
            }

            
            
            this.projList.push(projL);
            this.projList.push(projR);
        }
        else
        attackDelay = true;
    }

    this.hitCollision = function (body1, body2) {
        var hitSprite = this.g.add.sprite(body1.body.x, body1.body.y, 'flower');
        hitSprite.scale.setTo(this.scale, this.scale);
        hitSprite.anchor.setTo(0.5,0.5);
        
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
        
        body1.destroy();
    }


}