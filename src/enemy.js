function enemy(game, ground) {
this.g = game;
this.Ground = ground;
//this.pw = platformWall;

var enemy;
var enemySpeed = 150;
//var platformWall;

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
};

this.update = function() {
    //enemy.body.velocity.y = Math.abs(enemySpeed);
    //enemy.body.velocity.x = enemySpeed;
    this.g.physics.arcade.collide(enemy, this.Ground);

    
    if (enemy.y > 720) {
        enemy.y = 0;
    }
    
    if(enemy.body.x < 0) {
        //enemy.body.x = 0;
        //enemySpeed = 200;
        enemy.body.velocity.x = enemySpeed;
    }
    
    if(enemy.body.touching.right) {
        //enemy.body.x = 700;
        //enemySpeed = -200;
        enemy.body.velocity.x = -enemySpeed;
    }
};

this.moveEnemy = function() {
    enemy.body.velocity.x = enemySpeed;
};

}