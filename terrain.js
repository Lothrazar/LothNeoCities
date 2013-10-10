


Crafty.c('Tree1', 
{
  init: function() 
  {
    this.requires('Actor, Color, spr_tree_1');
    this.color(config.TREE_COLOUR);
  },
});

  
Crafty.c(Tree.id, 
{
  init: function() 
  { 
    this.requires('Actor, Solid, spr_tree_0');  
  },
});


Crafty.c(Wall.id, 
{
  init: function() 
  {
    this.requires('Actor, Solid, spr_wall_greydk'); 
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
    this.attr({z:-1});
  },
});

Crafty.c(Lava.id, 
{
  init: function() 
  {
    this.requires('Actor,  spr_lava'); 
    this.attr({z:-1});
  },
});
 

Crafty.c(Stairway.id,
{
   init:function()
   {
        this.requires('Actor,  spr_stair_1');//TODO: texture temporary
       
       
   } 
   ,content:null
   ,map_id:1
   
   ,pickup:function(holder)
   { 
       console.log('call new scene at ', this.map_id);  
       Maps.current = this.map_id;
       // if(Game.player)Game.player._move_x(16); 
         
        Crafty.scene(SCENES.game); 
   }
});