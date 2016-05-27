//when you want to spawn a group of green orbs,
//pass the x and y coordinates, along with the destination sprite
//and the number of orbs you want to spawn

function greenOrbSpawnAt(game, player, x,y, dest, count) {
    this.g = game;
    var speed = 600;
    
    //heal Amount is the general amount of health each orb adds
    //to the player health
    var healAmount = 5;
    
    //range is used to give a range of x and y maximum values
    //relative to the given coordinates
    var range = 100;
    
    this.orbGroup = game.add.group();
    
    var s_healthUp = this.g.add.audio('healthUp');
    
    for(var i = 0; i < count; ++i) {
        //random x and y in a set range
        var randX = Math.random() - 0.5;
        var randY = Math.random() - 0.5;
        
        //orb is created
        var orb = this.orbGroup.create(x + range * randX, y + range * randY, 'orb');
        orb.anchor.setTo(0.5);
        orb.alpha = 0;
        orb.scale.setTo(0.08);
        orb.moveTime = 120 + 10 * i;
        game.physics.arcade.enable(orb);
        
        //tween to fade the orb sprite into the game
        game.add.tween(orb).to({alpha: 1}, 3000, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
        
        
    }
    
    this.update = function() {
        for(var i = 0; i < this.orbGroup.length; ++i) {
            var orb = this.orbGroup.getAt(i);
            //checks if its time to move the orb yet
            --orb.moveTime;
            if(orb.moveTime <= 0) {
                //accelerate to the object
                game.physics.arcade.accelerateToObject(orb, dest, speed);
                if(game.physics.arcade.distanceBetween(orb, dest) < 120){
                    //if it gets close enough, it will then directly move toward the object destination
                    game.physics.arcade.moveToObject(orb,dest, speed);
                    if(game.physics.arcade.distanceBetween(orb, dest) < 25) {
                        --i;
                        player.health += healAmount; 
                        s_healthUp.play();
                        orb.destroy();
                    }
                }
            }
        }
    }
    
}