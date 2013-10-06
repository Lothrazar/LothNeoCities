var Player =
{
    // initial stats
    id:'PlayerCharacter',
    speed:1.5,
    health:1000,
    coins:0,
    ammo:5,
    colour:'rgb(85, 26, 139)',
    start_x:1,
    start_y:1,
    stats:
    {
        misses:0,
        kills:0,
    } 
};

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
  
  weapon:null,
  gun:null,
  inventory:[],
  init: function() 
  { 
    this.requires('Actor, Fourway, Color, Collision, Solid')
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
      .onHit(NPC.id,this.hitNPC)
      .onHit(Loot.id,this.pickupLoot)
      ; 
    this.attr(
    {
      w: Game.map_grid.tile.width-4,//override grid dfeaults
      h: Game.map_grid.tile.height-4
    });
    
    
      this.gun = Crafty.e('Gun').at(this.x,this.y);
   this.gun.holder = this;//for updateammo reverse call
    
    this.bind('Moved',this.onMoved);
    
    this.z = 999;//prevent player rendering behind the water
    
    this.bind('KeyDown', function(e) 
    {
       
      switch(e.key )
      {
          
          case Crafty.keys.E: 
              //this.shoot(null);
          break;
          case Crafty.keys.Q:
          break;
          case Crafty.keys.F:   
          console.log('sword', this.x  ,this.y );
                this.weapon =  Crafty.e('Sword').at( this.x/config.GRID_SIZE  ,this.y/config.GRID_SIZE );
                
                this.weapon.holder=this;//tell the sword hey, i am holding you. move with me
               
          console.log(this.weapon);
                
                this.weapon.slice();
                
               
          console.log('this.weapon.slice');
          break;
          case Crafty.keys.TAB:  
            
          break;
          case Crafty.keys.Add:
          
          break;
          case Crafty.keys.NUMPAD_0:
            Crafty.scene(SCENES.inv);
            
          break;
          case Crafty.keys.NUMPAD_1:
            this.shoot('sw');
          break;
          case Crafty.keys.NUMPAD_2:
            this.shoot('s'); 
          break;
          case Crafty.keys.NUMPAD_3:
            this.shoot('se'); 
          break;
          case Crafty.keys.NUMPAD_4:
            this.shoot('w'); 
          break;
          case Crafty.keys.NUMPAD_5:
             
          break;
          case Crafty.keys.NUMPAD_6:
            this.shoot('e'); 
          break;
          case Crafty.keys.NUMPAD_7:
            this.shoot('nw'); 
          break;
          case Crafty.keys.NUMPAD_8:
            this.shoot('n'); 
          break;
          case Crafty.keys.NUMPAD_9:
            this.shoot('ne'); 
          break;
          case Crafty.keys.SHIFT:
            this.teleportTo(10,10);
          break;
          case Crafty.keys.SPACE:
          
          break;
          case Crafty.keys.CTRL:
             this.checkInventory();
          break;
          case Crafty.keys.ALT:
          
          break;
         
          
          
          
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
  ,checkInventory:function()
  {
      //TODO : this
      console.log(this.inventory);
  }
  ,addToInventory:function(item)
  {
      console.log('add',item);
      this.inventory.push(item);
  }
  ,teleportTo:function(_x,_y)
  { 
     this.x = _x * config.GRID_SIZE;
     this.y = _y * config.GRID_SIZE;
     
      
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
  
  ,shoot:function(dir)
  {
      this.gun.shoot(dir);
  }

,hitNPC:function(data)
{
    var npc = data[0].obj;
    
    npc.speak("Hello you");
    
}
,pickupLoot:function(data)
{
    var loot = data[0].obj;
    loot.pickup(this);//picked up by me the player
}
  
  ,fightZombie:function(data)
  {
      var zombie = data[0].obj;
    this.updateHealth(-1 * zombie.attack);
   // zombie.collect();//  This destroys the zombie in one hit.  Zombie.collect
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
      
      if(this.weapon)
      {
            //whenever I move, also move my weapon as well
            //relative position is fixed
         // this.weapon.x = this.x;
          //this.weapon.y = this.y;
          
      }
  }
});
