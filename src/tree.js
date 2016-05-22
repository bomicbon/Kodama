function treeGroup(game, player, water) {
    this.p = player;
    this.g = game;
    
    this.wGroup = water;
    this.treeGroup = this.g.add.group();
    
    this.health = 0;
    this.maxHealth = 100;
    //waterHeal is how fast the water will grow the tree
    this.waterHeal = 5;
    
    this.create = function() {
        this.add(300, 300,1,1);
    }
    
    this.update = function() {
        //if water overlaps with a tree, call overlapping function
        this.g.physics.arcade.collide(this.treeGroup, this.wGroup.projList, this.overlapping, null, this);
        for (var i = 0; i < this.treeGroup.length; i++) {
            object = this.treeGroup.getAt(i);
            if (object.health == this.maxHealth) {
                object.loadTexture('flower', 0);
            }
        }
    }
    
    //add an tree given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var tree = this.treeGroup.create(x,y, 'flower_black');       
        tree.scale.setTo(width, heigth) 
        this.g.physics.arcade.enable(tree);
        tree.health = this.health;
        tree.body.immovable = true;
    }
    
    this.overlapping = function(tree, water) {
        //water hit animation
        this.wGroup.hitCollision(water, null);
        //add to tree health when water overlaps with it
        //console.log(tree.health);
        tree.health += this.waterHeal;
        if(tree.health > this.maxHealth){
            tree.health = this.maxHealth;
        }
        
        //changes tint depending on its health
        var percentHealed = tree.health / this.maxHealth;
        tree.tint = percentHealed.toFixed(2) * 0xFFFFFF;
    }
}