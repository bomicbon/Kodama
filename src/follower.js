function FollowerSystem(game, player, jumpVelocity, collisionGroup) {
    this.g = game;
    this.p = player;
    this.cGroup = collisionGroup;
    this.fList =[]; //follower list
    this.fList.push(new EmptyFollower()); //put an empty one
    this.distance = 5;  //this is the distance between followers
    this.jumpV = jumpVelocity; //jump velocity of the player
    
    this.timer = 3;    //used to delay the jumps
    this.counterList = [];
    
    this.preload = function() {
    }
    
    this.create = function () {
        for (var i = 0; i < 8; ++i) {
            this.add('animal'); // 
        }
    }
    
    this.update = function() {
        //loop will go through the list of followers
        for (var i = this.fList.length - 1; i >= 0; --i) {

            //variables for checking if player stars moving left or right
            var toLeft = false;
            var toRight = false;

            //inital dummy for follower list to get player velocity
            if (i == 0) {
                this.fList[i].velocity.x = this.p.body.velocity.x;
                
                if (this.p.body.touching.left || this.p.body.touching.right) {
                    this.fList[i].velocity.x = 0;
                }
                
            }
            
            //called for all other indexes > 0
            if (i > 0) {
                //check if player starts moving left or right and set the variable
                if (this.fList[i].velocity.x == 0 && this.fList[i - 1].velocity.x != 0) {
                    if (this.fList[i-1].velocity.x < 0) toLeft = true;
                    else { toRight = true; }
                }

                //passes down the velocity of the previous index to the current one
                this.fList[i].velocity.x = this.fList[i - 1].velocity.x;
            }

            //checks if the follower is a real one and updates the collision
            //also sets the position when player starts moving left or right
            if (i % this.distance == 0 && i > 0) {
                this.g.physics.arcade.collide(this.fList[i].f, this.cGroup);
                this.fList[i].update();
                if (toLeft) {
                    this.fList[i].f.body.x = this.p.body.x + (i * this.distance);
                }
                else if (toRight) {
                    this.fList[i].f.body.x = this.p.body.x - (i * this.distance);
                }
            }
        }
        
        //called when jump is made
        if(this.p.body.velocity.y == this.jumpV) {
            this.counterList.push(0); //starts a timer for jumps to occur
        }
        if (this.counterList.length > 0) {
            //loops through the timer list
            for(var i = 0; i < this.counterList.length; ++i) {
                this.counterList[i] += 1;
                var index = this.counterList[i] / this.timer;
                //stop the timer at the end of the follower list
                if(index > this.fList.length / this.distance) { 
                    this.counterList.splice(i,1);
                }
                //call jump when the delay is reached
                else if(this.counterList[i] % this.timer == 0) {
                    this.fList[(index) * this.distance].jump();
                }
            }
        }
        
    }
    
    //given a image name, this will add a follower to the list
    this.add = function (followerImage) {
        //add empty follower to list for the desired delay (distance)
        for(var i = 1; i < this.distance; ++i) {
            this.fList.push(new EmptyFollower());
        }

        //follower phaser sprite
        var follower = this.g.add.sprite(this.p.body.x, this.p.y, followerImage);
        follower.scale.setTo(1.0, 1.0);

        //follower phaser physics
        this.g.physics.arcade.enable(follower);
        follower.body.bounce.y = 0.1;
        follower.body.gravity.y = this.p.body.gravity.y;
        follower.body.collideWorldBounds = true;

        //add new follower to the follower list
        this.fList.push(new Follower(follower, this.jumpV));
    }

    //this function will remove the first follower in the list
    //mainly used for "using" a follower
    this.removeFirst = function () {
        this.fList.splice(1, this.distance);
    }
    
    //this is used to remove a follower given an index [0 to n]
    this.removeIndex = function(index) {
        this.fList.splice(index + 1, this.distance);
    }
}

function Follower(object, jumpVelocity) {
    this.f = object;
    this.jumpV = jumpVelocity;

    this.velocity = {this:x = 0};
    
    this.update = function () {
        //update the phaser physics velocity with the member variable
        this.f.body.velocity.x = this.velocity.x;
    }
    
    this.jump = function () {
        if(this.f.body.touching.down)
            this.f.body.velocity.y = this.jumpV;
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