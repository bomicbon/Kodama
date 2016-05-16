function wateringcanMelee(game, player, collisionGroup) {
    this.p = player;
    this.g = game;
    this.cGroup = collisionGroup;

    this.speed = 200;
    this.damage = 0;
    this.gravity = 17500;
    this.initUpVelocity = -900;
    this.scale = 1;
    
    this.delay = 20;
    this.delayCount = 0;

    this.key = null;
    this.projList = [];

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
        for (var i = 0; i < this.projList.length; ++i) {
            //if a projectile is null (destroyed) then remove it from the list
            if (this.projList[i] == null) {
                this.projList.splice(i, 1);
                --i;
                continue;
            }
            if (this.projList[i].y >= this.p.y - 5)
				this.projList[i].kill();
          
          
        }
    }

    this.spawnHit = function () {
        //if delay is passed
        if(this.delayCount >= this.delay && attackDelay) {
            this.delayCount = 0;
            attackDelay = false;
            
            if (!faceRight){
            	var projL = this.g.add.sprite(this.p.body.x-25, this.p.body.y+15, 'flower');
           	 	this.g.physics.arcade.enable(projL);
           	 	projL.body.gravity.y = this.gravity;
           		projL.body.velocity.x = (-1) * this.speed;
           		projL.body.velocity.y = this.initUpVelocity;
           		projL.scale.setTo(this.scale, this.scale);
            }
            else{
            	var projR = this.g.add.sprite(this.p.body.x+25, this.p.body.y+15, 'flower');
            	this.g.physics.arcade.enable(projR);
            	projR.body.gravity.y = this.gravity;
            	projR.body.velocity.x = this.speed;
            	projR.body.velocity.y = this.initUpVelocity;
            	projR.scale.setTo(this.scale, this.scale);
			}
     
            this.projList.push(projL);
            this.projList.push(projR);
        }
        else
        attackDelay = true;
    }

   


}