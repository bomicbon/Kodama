function DamageSystem(game, player, enemyList, projectileList) {
    this.g = game;
    this.p = player;
    this.eGroup = enemyList;
    this.pGroup = projectileList;
    
    //## READ ME PLEASE ##
    //enemyList is a list of groups of enemies
    //it must have a "enemyGroup", "damage", and "health" variable inside the class

    //projectileList is a list of groups of projectiles
    //it must have a "projList" (for the projectile group), and "damage" varaiable 
    // in the class

    //this text simply displays the player hp on the top left of the screen
    this.visualText = this.g.add.text(this.g.camera.x + 10, this.g.camera.y + 10, this.p.health,
        {font: "1px Arial", 
            fill: "000000",
            align: "center"
        });
    this.visualText.fixedToCamera = true;

    //this.enemyHitList = [];
    //this.enemyHitDelay = [];

    //this.hitDelay = 10;
    
    this.removeList = [];
    
    // Hit-Hurt Sound 
    var s_hurt = null;

    this.create = function () {
        var s_hurt = this.g.add.audio('hithurt');
    }

    this.update = function () {

        this.removeList = [];
        //this big loop will loop through both lists and see if any 
        // combination of enemy and projectile collide
        //if they do collide, this.hitCollision is called
        for (var i = 0; i < this.pGroup.length; ++i) {
            for (var j = 0; j < this.eGroup.length; ++j) {
                this.g.physics.arcade.overlap(this.eGroup[j].enemyGroup, this.pGroup[i].projList, this.hitCollision, null,
                    { this: this, eGroup: this.eGroup[j], pGroup: this.pGroup[i] });

                //this.g.physics.arcade.collide(this.p, this.eGroup[j], this.hitPlayer, null, this);
            }
        }

        //this changes the float health variable into integer
        this.visualText.setText(this.p.health.toFixed(0));
        
    }

    //this function will subtract health from the enemy
    // by however much damage the projectile does
    // it will also call the projectile's "hitCollision" function
    this.hitCollision = function (enemy, projectile) {
        enemy.health -= projectile.damage;
        
        //check if the enemy is still alive
        if(enemy.health > 0) {
        
            var sign = Math.sign(enemy.x - projectile.x);
            enemy.body.velocity.x = sign * 200;
            enemy.body.velocity.y = -200;
            /*if (enemy.health <= 0) {
                this.eGroup.enemyGroup.removeChild(enemy);
            }
            */
            
            this.pGroup.hitCollision(projectile, null);
            //console.log(projectile.damage + " damage");
            
            //this.enemyHitList.push(body1);
            //this.enemyHitDelay.push(this.hitDelay);
            
            //change enemy tint to red and lower alpha
            enemy.tint = 0xFF0000;
            enemy.alpha = 0.8;
            //add a timer event half a second later to revert back to original settings
            game.time.events.add(Phaser.Timer.SECOND / 2, function() {
                enemy.tint = 0xFFFFFF;
                enemy.alpha = 1;
            }, this);
            //s_hurt.play('',0,1,false, false);
        }
    }

    //this will be used in the future, for enemy projectiles
    // hitting the player (if needed)
    this.hitPlayer = function (player, enemy) {
        this.p.health -= enemy.damage;
        //console.log(enemy.damage + " hurt");
    }
}