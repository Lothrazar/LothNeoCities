
 
  
Crafty.c(Tree.id, 
{
  init: function() 
  { 
    this.requires('Actor, Solid, spr_tree_'+getRandomInt(0,15));  
  },
});

Crafty.c(Rock.id, 
{
  init: function() 
  {
      
      
    this.requires('Actor, Solid, spr_rock'+getRandomInt(0,15)); //spr_sheet_stone Color, 
    // this.color(config.ROCK_COLOUR);
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