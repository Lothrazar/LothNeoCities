Crafty.c(Player.id, 
{
  health:1,//avoid zero just in case
  coins:0,
  ammo:0,
  kills:0,
  misses:0,
  is_drowning:false,
  is_burning_lava:false,
  is_burning_fire:false,
  speed_flat:Player.speed,
  speed_current:Player.speed,
  speed_shallow:Player.speed/3,
  speed_water:Player.speed/6,
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
      .onHit(Shallow.id,this.enterWaterShallow,this.leaveWaterShallow)
      .onHit(Water.id,this.enterWaterDeep,this.leaveWaterDeep)
      .onHit(Lava.id,this.enterLava,this.leaveLava)
      ;
    this.attr(
    {
      w: Game.map_grid.tile.width-4,//override grid dfeaults
      h: Game.map_grid.tile.height-4
    });
    
    
    this.bind('Moved',this.onMoved);
    
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
 
    this.updateCoins( Player.coins );
    this.updateAmmo(Player.ammo);
    this.updateKills(Player.stats.kills);
    this.updateMisses(Player.stats.misses);
    
    
    //update kills and misses TODO
    
  }
  // be careful
  ,setSpeed:function(newspeed)
  { 
      if(newspeed <= 0 )  //dont do this
      {
          console.log('warning, speed zero or less');
          return;
      }
      if(this.speed_current != newspeed)
      { //if its already the same as current, do nothing
        this.speed_current = newspeed;
        this.fourway(newspeed); 
      }
  }
 
  ,enterWaterDeep:function()
  {   
      this.is_drowning = true;
      this.setSpeed(this.speed_water);
  }
  ,leaveWaterDeep:function()
  { 
      this.is_drowning = false; 
      this.setSpeed(this.speed_flat);
  }
  ,enterWaterShallow:function()
  { 
      this.setSpeed(this.speed_shallow);
  }
  ,leaveWaterShallow:function()
  {  
      this.setSpeed(this.speed_flat);
  }
  
  ,enterLava:function()
  {
      this.is_burning_lava = true;
  }
  ,leaveLava:function()
  {
      this.is_burning_lava = false;
      
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
        
    },180);
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
      Crafty.trigger('PlayerTookDamage');
      if(this.health <= 0)
      { 
         Crafty.trigger('Death');
      }
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
  
   ,onMoved:function()
  {
      //this works
      if(this.is_drowning)
      { 
        this.updateHealth( -1  );
      }
      if(this.is_burning_lava)
      {
          
        this.updateHealth( -5  );
      }
  }
});
