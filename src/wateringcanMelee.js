function wateringcanMelee(game, player, collisionGroup) {
    this.p = player;
    this.g = game;
    this.cGroup = collisionGroup;

    this.speed = 200;
    this.damage = 5;
    this.gravity = 17500;
    this.initUpVelocity = -900;
    this.scale = 1;
    
    this.delay = 20;
    this.delayCount = 0;

    this.key = null;
    this.projList = this.g.add.group();

    this.create = function () {
        //looks for key input and spawns a new projectile
        this.key = this.g.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.key.onDown.add(this.spawnHit, this);

        this.g.input.keyboard.removeKeyCapture(Phaser.Keyboard.Z);
    }

    this.update = function () {
        //add to counter for delay counter
        if(this.delayCount < this.delay) {
            ++this.delayCount;
        }
        //list of bodies to remove
        //var removeList = [];
        this.projList.forEach(function(item) {
            if (item.y >= this.p.y - 5) {
                this.projList.removeChild(item);
            }
        }, this);
        /*
        for(var i = 0; i < removeList.length; ++i) {
            this.projList.removeChild(removeList[i]);
        }
        */
    }

    this.spawnHit = function () {
        //if delay is passed
        if(this.delayCount >= this.delay) {
            this.delayCount = 0;
            
            if (!faceRight){
            	var projL = this.g.add.sprite(this.p.body.x-25, this.p.body.y+15, 'flower');
           	 	this.g.physics.arcade.enable(projL);
           	 	projL.body.gravity.y = this.gravity;
           		projL.body.velocity.x = (-1) * this.speed;
           		projL.body.velocity.y = this.initUpVelocity;
           		projL.scale.setTo(this.scale, this.scale);
                projL.damage = this.damage;

           		this.projList.add(projL);
            }
            else{
            	var projR = this.g.add.sprite(this.p.body.x+25, this.p.body.y+15, 'flower');
            	this.g.physics.arcade.enable(projR);
            	projR.body.gravity.y = this.gravity;
            	projR.body.velocity.x = this.speed;
            	projR.body.velocity.y = this.initUpVelocity;
            	projR.scale.setTo(this.scale, this.scale);
                projR.damage = this.damage;

            	this.projList.add(projR);
			}

        }
        /* Note: the attackDelay variable meant that the
        player must hit the key twice to attack*/
    }
    
    this.hitCollision = function(body1, body2) {
        //do nothing
    }

   


}