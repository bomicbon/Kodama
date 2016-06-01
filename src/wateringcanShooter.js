function wateringcanShooter(game, player, collisionGroup, temperature_reading) {
    this.p = player;
    this.g = game;
    this.cGroup = collisionGroup;

    this.speed = 200;
    this.damage = 5;
    this.gravity = 1300;
    this.initUpVelocity = -300;
    this.scale = 2.0; // Bigger Water
    this.maxScale = 10;
    this.minScale = 0.1;
    
    this.delay = 5;
    this.delayCount = 0;

    this.key = null;
    this.projList = this.g.add.group();
    
    this.bounds = Phaser.Rectangle.clone(this.g.world.bounds);
    this.shot = null;// has a shot been fired? (bool)
    this.didShoot = null;
    
    this.waterSound = null;
    
    this.create = function () {
        //looks for key input and spawns a new projectile
       
        this.key = this.g.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //this.key.onHold.add(this.spawnWater, this);
        this.g.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
        //sound_shoot = this.g.add.audio('shoot', 'assets/sound/shoot.wav');
        
        
        this.waterSound = this.g.add.audio('water_splash');
    }
    

    this.update = function () {
        //add to counter for delay counter
        this.key = this.g.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        ++this.delayCount;
        if(this.delayCount > this.delay && this.key.isDown) {
            this.delayCount = 0;
            this.spawnWater();
            this.shot = true; //if spawnwater then shot is true
            this.didShoot = true; // for the tutorial must remain true after pressed
        }
        if (this.delayCount < this.delay && this.delayCount != 0) {
            this.shot = false;
        }
        this.g.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
        for(var i = 0; i < this.projList.length; ++i) {
            //if collide, call hitCollision
            if(this.g.physics.arcade.collide(this.projList.getAt(i),
                 this.cGroup, this.hitCollision, null, this)) {
                --i;
            }
        }
        
        this.scale = 0.5 - (temperature_reading.temp - temperature_reading.nTemp) * 0.01; 
        //setup max and minimum scale of the water
        if(this.scale < this.minScale) {
            this.scale = this.minScale;
        }
        if(this.scale > this.maxScale) {
            this.scale = this.maxScale;
        }
        
        this.speed = 200 - 2*(temperature_reading.temp - temperature_reading.nTemp);
        // DOPE FIRE RATE
        if (temperature_reading.temp - temperature_reading.nTemp < -40) {
            this.delay = 3;
        }
        // BETTER FIRE RATE
        else if (temperature_reading.temp - temperature_reading.nTemp < -20) {
            this.delay = 4;
        }
        // FIRE RATE
        else if (temperature_reading.temp - temperature_reading.nTemp < 0) {
            this.delay = 4.5;
        }
        
        
    }

    this.spawnWater = function () {
        
        this.playSoundShot();
         
        // I removed the delay cuz basically
        // 1. delay count doesn't do anything
        // 2. if else statement basically waits for water sprite to be out of bounds before player can shoot again...
        
        //if delay is passed
            //this.delayCount = 0;
            
            //shoot projectile to left
            if (!player.faceRight){
           		var projL = this.g.add.sprite(this.p.body.x-30 + this.p.body.halfWidth, this.p.body.y+35, 'water');
	            this.g.physics.arcade.enable(projL);
	            projL.body.gravity.y = this.gravity;
	            projL.body.velocity.x = (-1) * this.speed + this.p.body.velocity.x;
	            projL.body.velocity.y = this.initUpVelocity;
	            projL.scale.setTo(this.scale, this.scale);
	            projL.damage = this.damage;
                projL.anchor.setTo(0.5);
                
                //destroy when out of bounds
                projL.checkWorldBounds = true;
                projL.outOfBoundsKill = true;

                this.projList.add(projL);
            }
           
           //shoot projectile to right
            else{
            	var projR = this.g.add.sprite(this.p.body.x+30 + this.p.body.halfWidth, this.p.body.y+35, 'water');
	            this.g.physics.arcade.enable(projR);
	            projR.body.gravity.y = this.gravity;
	            projR.body.velocity.x = this.speed + this.p.body.velocity.x;
	            projR.body.velocity.y = this.initUpVelocity;
	            projR.scale.setTo(this.scale, this.scale);
	            projR.damage = this.damage;
                projR.anchor.setTo(0.5);
                
                //destroy when out of bounds
                projR.checkWorldBounds = true;
                projR.outOfBoundsKill = true;
            
                this.projList.add(projR);
            }
                        
            
    }

    //this is a the collision event for when the projectile hits a wall
    // or something, it changes its rotation depending on where collision happened
    this.hitCollision = function (body1, body2) {
        var splash_scale = this.scale = 0.5 - (temperature_reading.temp - temperature_reading.nTemp) * 0.015; 
        var splash_obj = game.add.sprite(body1.body.x, body1.body.y, 'splash'); // declaring where to add sprite animation
        splash_obj.scale.setTo(splash_scale, splash_scale);
        splash_obj.animations.add('splash'); // add the animation ability 'splash'
        splash_obj.animations.play('splash', 40, false, true);
        
        this.waterSound.play('',0,0.25,false, true);

        this.projList.removeChild(body1, true);
    }
    
    //called in the spawn water and plays the correct sound
    this.playSoundShot = function() {
        // Sound
		// SLIGHTLY BETTER WATER G0NZ
		if (temperature_reading.temp < temperature_reading.nTemp && temperature_reading.temp > 45) {
			sound_shootM.play();
		}
		// WELTER WEIGHT BOY WATER G0NZ
		else if (temperature_reading.temp < 45 && temperature_reading.temp > 25) {
			sound_shootL.play();
		}
		// BIG BOY WATER G0NZ
		else if (temperature_reading.temp < 25 && temperature_reading.temp > 5) {
			sound_shootXL.play();
		}
		// Default shoot sound
		else {
			sound_shoot.play();
		}
    }

}