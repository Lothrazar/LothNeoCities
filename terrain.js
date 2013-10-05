

  
Crafty.c(Tree.id, 
{
  init: function() 
  {
    this.requires('Actor, Color, Solid');
    this.color(config.TREE_COLOUR);
  },
});
 
Crafty.c(Wall.id, 
{
  init: function() 
  {
    this.requires('Actor, Solid, spr_wall_black'); 
  },
});



Crafty.c(Water.id, 
{
  init: function() 
  {
    this.requires('Actor,  spr_water'); 
  },
});


Crafty.c(Shallow.id, 
{
  init: function() 
  {
    this.requires('Actor,  spr_waterdk'); 
  },
});
