function FollowerSystem(game, player, collisionGroup) {
    this.g = game;
    this.p = player;
    this.cGroup = collisionGroup;
    this.fList = [];
    this.distance = 20;
    
    this.timer = 10;
    this.counterList = [];
    
    this.preload = function() {
        
    }
    
    this.create = function() {
        for (var i = 0; i < 10; ++i){
        this.add();
        }
    }
    
    this.update = function() {
        
        for(var i = 0; i < this.fList.length; ++i) {
            var followerBody = this.fList[i].f.body;
            this.g.physics.arcade.collide(this.fList[i].f, this.cGroup);
            
            //follower is on left of player
            if(followerBody.center.x < this.p.body.center.x  - this.distance * (i+1)) {
                followerBody.velocity.x = 200;
            }
            //follower is on right of player
            else if(followerBody.center.x > this.p.body.center.x + this.distance * (i+1)) {
                followerBody.velocity.x = -200;
            }
            //called when found a follower that doesn't need to move
            else {
                followerBody.velocity.x = 0;
            }
        }
        
        //called when jump is made
        if(this.p.body.velocity.y == -250) {
            this.counterList.push(0);
        }
        if(this.counterList.length > 0) {
            for(var i = 0; i < this.counterList.length; ++i) {
                this.counterList[i] += 1;
                var index = this.counterList[i] / this.timer;
                if(index > this.fList.length) {
                    this.counterList.splice(i,1);
                }
                else if(this.counterList[i] % this.timer == 0) {
                    this.fList[index-1].jump();
                }
            }
        }
        
    }
    
    this.add = function() {
        var follower = this.g.add.sprite(this.p.body.x, this.p.body.y, 'blob');
        follower.scale.setTo(0.1,0.1);
        this.g.physics.arcade.enable(follower);
        follower.body.bounce.y = 0.1;
        follower.body.gravity.y = 500;
        this.fList.push(new Follower(follower));
    }
}

function Follower(object) {
    this.f = object;
    
    this.update = function() {
        
    }
    
    this.jump = function() {
        this.f.body.velocity.y = -250;
    }
}