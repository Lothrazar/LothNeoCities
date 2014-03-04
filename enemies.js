
Crafty.c(Zombie.id, 
{
  speed :  Zombie.speed,
  health : Zombie.health,
  attack : Zombie.attack, 
  init: function() 
  {
    this.requires('Enemy, Walking, spr_zombie'); //removed Solid
    
    //replaced spr over colour
   // this.color(config.ZOMBIE_COLOUR);
 
  }//end zombie init
 
  
  ,collect: function() 
  {
    this.destroy(); 
  }
}); //end of Zombie definition


//keep fairy as enemy just for bullets
Crafty.c(Fairy.id, 
{
  init: function() 
  {
    this.requires('Enemy, Flying, Color');
    this.color(Fairy.colour);
    this.attr(
    {  
      speed:1
    });
     
  },
 
  collect: function() 
  {
    this.destroy();
  }
});// end Faeire


Crafty.c(Dragon.id, 
{  
  init: function() 
  {
    this.requires('Enemy, Flying, Color');
    this.color(Dragon.colour);
 
    this.attr(
    {  
      speed : Dragon.speed
    });
      /* 
      if(Math.random() < config.DRAGON_FIRE_CHANCE)
      {
         //spit fire out 
         Crafty.e('Fire').at(Math.floor(this.x/config.GRID_SIZE), Math.floor(this.y/config.GRID_SIZE));
       
      }
    */
    
     
  },
   
  collect: function() 
  {
    this.destroy();   
  }
});//end Dragon


//keep fairy as enemy just for bullets
Crafty.c(Fairy.id, 
{
  init: function() 
  {
    this.requires('Enemy, Flying, Color');
    this.color(Fairy.colour);
    this.attr(
    {  
      speed:1
    });
     
  },
 
  collect: function() 
  {
    this.destroy();
  }
});// end Faeire



