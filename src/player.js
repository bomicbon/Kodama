function Player(game, temperature_reading) {
    
    this.sprite = null;
    
    var playerSpeed = 250;
	var playerX = 10;
	var playerY = 650;
    this.maxHealth = 100;
    
    var jumpVelocity = -500;
	
	var gravity = 1000;
    
    this.cursors = null;
    
    var worldWidth = 4200;
	var worldHeight = 720;
    
    this.faceRight = true;
    
    this.didL = false;
	this.didR = false;
	this.didU = false;
    
    var sound_jump = game.add.audio('jump');
    var s_thud = game.add.audio('thud');
    this.falling = null;
    
    this.create = function() {
        
		number = Math.floor(Math.random()*10);
		this.sprite = game.add.sprite(playerX,playerY,'player');
		this.sprite.anchor.setTo(0.5);
		this.cursors = game.input.keyboard.createCursorKeys();
		game.world.setBounds(0, 0, worldWidth, worldHeight);
		game.physics.arcade.enable(this.sprite);
		this.sprite.scale.setTo(1, 1);
		this.sprite.body.syncBounds = false;
		game.camera.follow(this.sprite);
		this.sprite.body.bounce.y = 0.1;
		this.sprite.body.gravity.y = gravity;
		this.sprite.body.collideWorldBounds = true;
		this.sprite.health = this.maxHealth;
        this.sprite.knocked = false;
        this.sprite.faceRight = true;
		
		this.setAnimations();
        
    }
    
    this.update = function() {
        
        // Prevents Player Health from going over MAX
		if (this.sprite.health > this.maxHealth) {
			this.sprite.health = this.maxHealth;
		}
        
        //player.knocked is used to stop the player from moving while in the "knocked" state
		//set knocked to true when it gets hurt and generate knockback with like velocity
		if(this.sprite.body.touching.down) {
			this.sprite.knocked = false;
		}
		if(this.sprite.knocked == false) {
			this.sprite.body.velocity.x = 0;
			var minSpeed = 100;
            
			if(this.cursors.left.isDown && this.cursors.right.isDown) {
			    //do nothing
			}
			else if(this.cursors.left.isDown) {
				this.sprite.scale.setTo(-1, 1);
				this.sprite.body.velocity.x = -playerSpeed + (temperature_reading.temp - temperature_reading.nTemp) * 2;
				//background.tilePosition.x += 0.5;
				//background1.tilePosition.x += 1.5;
				if(this.sprite.body.velocity.x > -minSpeed) {
					this.sprite.body.velocity.x = -minSpeed;
				}
				this.sprite.faceRight = false;
				if(!this.sprite.body.touching.down)
					this.sprite.animations.play('jump_right');
				else
					this.sprite.animations.play('walk_right'); 
				this.didL = true; // TUTORIAL
				
			}
			else if(this.cursors.right.isDown) {
				this.sprite.scale.setTo(1,1);
				this.sprite.body.velocity.x = playerSpeed - (temperature_reading.temp - temperature_reading.nTemp) * 2;
				//background.tilePosition.x -= 0.5;
				//background1.tilePosition.x -= 1.5;
				if(this.sprite.body.velocity.x < minSpeed) {
					this.sprite.body.velocity.x = minSpeed;
				}
				this.sprite.faceRight = true;
				if(!this.sprite.body.touching.down)
					this.sprite.animations.play('jump_right')
				else
        			this.sprite.animations.play('walk_right'); 
        		this.didR = true; // TUTORIAL
			}
			else {
				//put idle animation in here
			}
			
			if (this.cursors.up.isDown && this.sprite.body.touching.down) {
				this.sprite.body.velocity.y = jumpVelocity;
				sound_jump.play();
				this.didU = true; // TUTORIAL
			}
			
		}

		if (this.sprite.health < 1) {
			game.state.start("GameOver", true, false, score);
		}
		
		if(!this.cursors.left.isDown && !this.cursors.right.isDown) {
			this.sprite.animations.play('idle_right');
		}
		/*
		if (this.sprite.faceRight && !this.cursors.left.isDown && !this.cursors.right.isDown)
			this.sprite.animations.play('idle_right'); 
		else if (!this.sprite.faceRight && !this.cursors.left.isDown && !this.cursors.right.isDown)
			this.sprite.animations.play('idle_left'); 
		*/
		// THUD SOUND
        if (this.sprite.body.touching.down && this.falling) {
			s_thud.play('',0,0.25,false, false);
			this.falling = false;
		}
		if (this.sprite.body.velocity.y > 0) {
			this.falling = true;
		}
		
    }
    
    this.setAnimations = function() {
        // Animations
        this.sprite.animations.add('jump_right', [0], 15, true); 
        this.sprite.animations.add('jump_left', [8], 15, true); 
        this.sprite.animations.add('walk_right', [0, 1, 2, 3, 2, 1], 15, true); 
        this.sprite.animations.add('idle_right', [4, 5, 6, 7, 6, 5, 4], 10, true); 
        this.sprite.animations.add('walk_left', [12, 13, 14, 15, 14, 13], 15, true); 
        this.sprite.animations.add('idle_left', [8, 9, 10, 11, 10, 9], 10, true); 
    }
}