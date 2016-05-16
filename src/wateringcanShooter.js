function wateringcanShooter(game, player, collisionGroup) {
    this.p = player;
    this.g = game;
    this.cGroup = collisionGroup;

    this.speed = 300;
    this.damage = 0;
    this.gravity = 300;
    this.initUpVelocity = -100;

    this.key = null;
    this.projList = [];
    this.removeIndex = 0;

    this.create = function () {
        //looks for spacebar input and spawns a new projectile
        this.key = this.g.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.key.onDown.add(this.spawnWater, this);

        this.g.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    }

    this.update = function () {
        for (var i = 0; i < this.projList.length; ++i) {
            //if a projectile is null (destroyed) then remove it from the list
            if (this.projList[i] == null) {
                this.projList.splice(i, 1);
                --i;
                continue;
            }
            //if collide, call hitCollision
            this.g.physics.arcade.collide(this.projList[i], this.cGroup, this.hitCollision);
        }
    }

    this.spawnWater = function () {
        var proj = this.g.add.sprite(this.p.body.x, this.p.body.y, 'flower');
        this.g.physics.arcade.enable(proj);
        proj.body.gravity.y = this.gravity;
        proj.body.velocity.x = this.speed;
        proj.body.velocity.y = this.initUpVelocity;
        proj.scale.setTo(0.2, 0.2);

        //destroy when out of bounds
        proj.checkWorldBounds = true;
        proj.outOfBoundsKill = true;
        
        this.projList.push(proj);
    }

    this.hitCollision = function (body1, body2) {
        body1.destroy();
    }


}