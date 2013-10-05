Crafty.c(Player.id, 
{
  health:1,//avoid zero just in case
  coins:0,
  ammo:0,
  kills:0,
  misses:0,
  init: function() 
  {
      
    this.requires('Actor, Fourway, Color, Collision')
      .fourway(Player.speed)
      .color(Player.colour) 
      .onHit(Coin.id,this.collectCoin)
      .onHit(Fire.id,this.collectFire)
      .onHit(Dragon.id,this.fightDragon)
      .onHit(Fairy.id,this.fightFairy)
      .onHit(Zombie.id,this.fightZombie)
      .onHit(Water.id,this.enterWater,this.leaveWater)
      ;
    this.attr({
      w: Game.map_grid.tile.width-4,//override grid dfeaults
      h: Game.map_grid.tile.height-4
    });
    
    this.z = 999;//prevent player rendering behind the water
    
    this.bind('KeyDown', function(e) 
    {
      if(e.key == Crafty.keys.SPACE)
      {
        
        this.shoot();
      }
    });
    
    this.health = Player.health;
    
    this.onHit('Solid', this.stopMovement);
    //set initial values
    this.updateHealth(0);//add zero just to refresh display
    this.updateCoins( Player.coins );
    this.updateAmmo(Player.ammo);
    this.updateKills(Player.stats.kills);
    this.updateMisses(Player.stats.misses);
    
    
    //update kills and misses TODO
    
  }
  
  ,enterWater:function()
  { 
      this.fourway(Player.speed-1);
  }
  ,leaveWater:function()
  { 
      this.fourway(Player.speed);
  }
  
  ,shoot:function()
  {
    if(this.ammo <= 0) 
    { 
         AUDIO.PLAY(AUDIO.reload);//TODO: give this a unique sound
        return; 
        
     }//dont shoot if empty
    
    
    
    //origin is top left, so up and left are negative
    
    var movingUp = (this._movement.y < 0 );//can both be false
    var movingDown = (this._movement.y > 0 );
    
    var movingLeft = (this._movement.x < 0 );
    var movingRight = (this._movement.x > 0 );
     
    var  dir = '';
    
    //valid directions are (n,s,e,w,ne,nw,se,sw)
    
    //first decide if N or W
    if(movingUp) dir = 'n';
    if(movingDown) dir = 's';
    
    //either dir is empty;  or it is n/s, so it gets added to the end
    dir += (movingLeft) ? 'w' : '';
    dir += (movingRight) ? 'e' : '';
    
    //we will never add both 'w' and 'e', add at most one of them or neither
    
    
    //if player is stationary, dir will still be emtpy string at this point
    if(dir == '') {return; }
    
    
  //create it, then fire it in given direction
    Crafty.e("Arrow").attr({x: this.x, y: this.y , w: config.ARROW_SIZE, h: config.ARROW_SIZE, z:50}).fired(dir);
  
    this.updateAmmo(-1);//reduce ammo by one since this shot was successful
 
   
    AUDIO.PLAY(AUDIO.shoot,1);
 
    setTimeout(function()
    {
        AUDIO.PLAY(AUDIO.reload);
        
    },200);
  }

  
  ,fightZombie:function(data)
  {
    this.updateHealth(-1 * Zombie.attack);
    data[0].obj.collect();// Zombie.collect
  }
  
  ,stairway:function(data)
  { 
      data[0].obj.collect();
  }
  
  ,fightFairy:function(data)
  {
    this.updateHealth( -1 * Fairy.attack);//instant death
    data[0].obj.collect(); // Fairy.collect
    
    
    AUDIO.PLAY(AUDIO.fairy);
  }
  
  ,fightDragon:function(data)
  {
    this.updateHealth(-1* Dragon.attack);//instant death
    data[0].obj.collect(); // Dragon.collect
  }
  
  
  ,collectFire:function(data)
  {
    this.updateHealth(-1*config.FIRE_DAMAGE);
    data[0].obj.collect(); // Fire.collect
    AUDIO.PLAY(AUDIO.fire);
  }
  
 ,collectCoin:function(data)
  {
    this.updateCoins(1);
    data[0].obj.collect(); // Coin.collect
    
    AUDIO.PLAY(AUDIO.coin);
 
    
  }
  //update health by increment and the display as well
  ,updateHealth:function (inc)
  {
    this.health += inc;
 
    Crafty.trigger('UpdateHUD');
  }
  //update  by increment and the display as well
  ,updateCoins:function (inc)
  {
    this.coins += inc;
 
    
    Crafty.trigger('UpdateHUD');
  }
  
  ,updateAmmo:function (inc)
  {
    this.ammo += inc;
 
    Crafty.trigger('UpdateHUD');
  }
  
  ,updateKills:function(inc)
  {
  
    this.kills+= inc;
      
      Crafty.trigger('UpdateHUD');
  }
  ,updateMisses:function(inc)
  {
    this.misses+= inc;
 
    
    Crafty.trigger('UpdateHUD');
  }
  
  ,killedEnemy:function(enemy)
  {
  // if (enemy.__c.Zombie == true) //then it was a zombie, else soem other guy
   
    this.updateKills(1);
  }
   
  // Stops the movement
  //underscore speed and movement are craftyjs variables
  ,stopMovement: function(e) 
  {
  
    if (this._movement) 
    {
      this.x -= this._movement.x;
      if (this.hit('Solid') != false) 
      {
        this.x += this._movement.x;
        this.y -= this._movement.y;
        if (this.hit('Solid') != false) 
        {
          this.x -= this._movement.x;
          this.y -= this._movement.y;
        }
      }
    } 
    else 
    {
      this._speed = 0;
    }
  }
  
});
