//not an object since its not solid, its collectable
Crafty.c(Coin.id, 
{
  init: function() 
  {
    this.requires('Actor,  spr_coin')
      //.color(config.COIN_COLOUR) //'Color'
      ;
  },
 
  collect: function() 
  {
    this.destroy();
    Crafty.trigger('CoinCollect', this);
  }
});


Crafty.c(Fire.id, 
{
  init: function() 
  {
    this.requires('Actor, spr_flame') ;//      .color(config.FIRE_COLOUR)
  },
 
  collect: function() 
  {
    this.destroy();
    Crafty.trigger('PlayerTookDamage', this);  
  }
});

 
 
Crafty.c(Rock.id, 
{
  init: function() 
  {
      
      
    this.requires('Actor, Solid, spr_rock'+getRandomInt(0,15)); //spr_sheet_stone Color, 
    // this.color(config.ROCK_COLOUR);
  },
});

 