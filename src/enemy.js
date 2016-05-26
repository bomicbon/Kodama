function enemy(game, ground) {
this.g = game;
this.Ground = ground;
//this.pw = platformWall;

var enemy;
var enemySpeed = 150;
//var platformWall;

///////////
var poisons;

//var cursors;
var fireButton;

var poisonTime = 0;
var poison;
var livingEnemies = [];
////////////

this.preload = function() {
    
};

this.create = function() {
    //game.physics.startSystem(Phaser.Physics.ARCADE);
    enemy = this.g.add.sprite(170, 650, "enemy");
    enemy.anchor.setTo(0.5, 0.5);
    this.g.physics.arcade.enable(enemy);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = -enemySpeed;
    
    enemy.checkWorldBounds = true;
    
    ///////////////
    poisons = this.g.add.group();
    poisons.enableBody = true;
    poisons.physicsBodyType = Phaser.Physics.ARCADE;
    poisons.createMultiple(27, "poison");
    poisons.setAll('anchor.x', 1.0);
    poisons.setAll('anchor.y', 0.5);
    poisons.setAll('checkWorldBounds', true);
    poisons.setAll('outOfBoundsKill', true);
    
    //cursors = this.g.input.keyboard.createCursorKeys();
    //fireButton = this.g.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    ///////////////////////
    
    // create enemies
    /*
    enemy = this.g.add.group();
    enemy.enableBody = true;
    enemy.physicsBodyType = Phaser.Physics.ARCADE;
    
    this.createEnemy();
    */
};

this.update = function() {
    //enemy.body.velocity.y = Math.abs(enemySpeed);
    //enemy.body.velocity.x = enemySpeed;
    this.g.physics.arcade.collide(enemy, this.Ground);

    
    if (enemy.y > 720) {
        enemy.y = 0;
    }
    
    if(enemy.body.x < 0) {
        enemy.body.velocity.x = enemySpeed;
    }
    
    if(enemy.body.x > 4200) {
        enemy.body.velocity.x = -enemySpeed;
    }
    /*
    if(enemy.body.touching.right) {
        //enemy.body.x = 700;
        //enemySpeed = -200;
        enemy.body.velocity.x = -enemySpeed;
    */    
    ////////////////
    if (this.g.time.now > poisonTime) {
        this.firePoison();
    }
    //////////////////
};

////////////////////////
this.firePoison = function() {
   // if (this.g.time.now > poisonTime) {
        poison = poisons.getFirstExists(false);
        
        livingEnemies.length = 0;
        
        //enemy.forEachAlive(function(enemys) {
          // livingEnemies.push(enemys); 
        //});
        
        if (poison && livingEnemies.length > 0)
        {
            var random = this.g.rnd.integerInRange(0, livingEnemies.length - 1);
            
            var shooter = livingEnemies;
            poison.reset(shooter.body.x, shooter.body.y);
            this.g.physics.arcade.moveToObject(poison, this.p, 120);
            poisonTime = this.g.time.now + 200;
        }
        
        //if (poison) {
            //poison.reset(enemy.body.x, enemy.body.y);
          //  poison.body.velocity.x = -500;
            //poisonTime = this.g.time.now + 200;
            
            //if (enemy.body.moving.right) {
              //  poison.body.velocity.x = -500;
            //}
        //}
    };
///////////////////////

this.moveEnemy = function() {
    enemy.body.velocity.x = enemySpeed;
};

////////////////////////////
/*
this.createEnemy = function() {
    for (var x = 0; x < 7; x++) {
        var enemys = enemy.create(x *48, 'enemy');
        enemys.anchor.setTo(0.5, 0.5);
        enemys.body.moves = true;
    }
    
    enemy.x = 500;
    enemy.y = 50;
};
////////////////////////
*/
}