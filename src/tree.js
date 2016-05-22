function treeGroup(game, player, water) {
    this.p = player;
    this.g = game;
    
    this.wGroup = water;
    this.treeGroup = this.g.add.group();
    
    this.health = 0;
    this.maxHealth = 100;
    //waterHeal is how fast the water will grow the tree
    this.waterHeal = 0.2;
    
    this.create = function() {
        this.add(300, 300,1,10);
    }
    
    this.update = function() {
        //if water overlaps with a tree, call overlapping function
        this.g.physics.arcade.overlap(this.treeGroup, this.wGroup, this.overlapping, null, this);
    }
    
    //add an tree given x, y, width, height
    this.add = function(x, y, width, heigth) {
        var tree = this.treeGroup.create(x,y, 'flower');       
        tree.scale.setTo(width, heigth) 
        this.g.physics.arcade.enable(tree);
        tree.health = this.health;
        tree.immovable = true;
    }
    
    this.overlapping = function(tree, water) {
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