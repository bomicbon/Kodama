function FollowerSystem(game, player, collisionGroup) {
    this.g = game;
    this.p = player;
    this.cGroup = collisionGroup;
    this.fList =[]; //follower list
    this.fList.push(new EmptyFollower()); //put an empty one
    this.distance = 2;  //this is the distance between followers
    
    this.timer = 10;    //used to delay the jumps
    this.counterList = [];
    
    this.preload = function() {
    }
    
    this.create = function () {
        for (var i = 0; i < 20; ++i) {
            this.add(); // 
        }
    }
    
    this.update = function() {
        //loop will go through 
        for(var i = this.fList.length - 1; i >= 0; --i) {
            if (i == 0) {
                this.fList[i].velocity.x = this.p.body.velocity.x;
            }
            if (i != 0) {
                this.fList[i].velocity.x = this.fList[i - 1].velocity.x;
            }
            if (i % this.distance == 0) {
                this.g.physics.arcade.collide(this.fList[i].f, this.cGroup);
                this.fList[i].update();
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
                if(index > this.fList.length / this.distance) {
                    this.counterList.splice(i,1);
                }
                else if(this.counterList[i] % this.timer == 0) {
                    this.fList[(index) * this.distance].jump();
                }
            }
        }
        
    }
    
    this.add = function() {
        for(var i = 1; i < this.distance; ++i) {
            this.fList.push(new EmptyFollower());
        }

        var follower = this.g.add.sprite(this.p.body.x, this.p.y, 'blob');
        follower.scale.setTo(0.1,0.1);
        this.g.physics.arcade.enable(follower);
        follower.body.bounce.y = 0.1;
        follower.body.gravity.y = 500;
        this.fList.push(new Follower(follower));
    }
}

function Follower(object) {
    this.f = object;
    this.velocity = {this:x = 0};
    
    this.update = function() {
        this.f.body.velocity.x = this.velocity.x;
    }
    
    this.jump = function() {
        this.f.body.velocity.y = -250;
    }
}

function EmptyFollower() {
    this.velocity = {this:x = 0};

    this.update = function () {
        //empty
    }

    this.jump = function () {
        //nothing
    }
}