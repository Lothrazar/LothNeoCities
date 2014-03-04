var Player =
{
    // initial stats
    id:'PlayerCharacter',
    speed:1.2,
    health:100,
    damage_timeout:0,
    coins:0,
    ammo:25,
    colour:'rgb(85, 26, 139)',
    start_x:1,
    start_y:1,
    invinc_frames:30,//how many frames we stay invincible after taking a hit
    stats:
    {
        misses:0,
        kills:0,
    } 
};
 

Crafty.c(Player.id, 
{
  health:Player.health, 
  coins:0,
  ammo:0,
  kills:0,
  misses:0,
  is_drowning:false,
  is_burning_lava:false,
  is_burning_fire:false,
  speed_flat:Player.speed,
  speed_current:Player.speed,//deprec speeds
  speed_shallow:Player.speed,// (Player.speed / 3).toFixed(3),
  speed_water: Player.speed,//(Player.speed / 6).toFixed(3),
  
 //TODO consolidate data here
  weapon:null,
  gun:null,
  inventory:[],
  init: function() 
  { 
      //when persist is on, player gets copied again, since player was creted inside the Scene.game 
    this.requires('Actor, Fourway, SpriteAnimation, link_s, Collision, Solid, Persist')//Persist
      .fourway(Player.speed)
       
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
      .onHit(Stairway.id,this.takeStairway)
      ; 
      
       
      
    this.onHit('Solid', this.onHitSolid);
    this.bind('Moved',this.onMoved);
    this.bind('PlayerTookDamage',this.onTookDamage);
    this.attr(
    {
         w: Game.u //- 1-1//override grid dfeaults
        ,h: Game.u //- 1-1
    });
    
    this.bind('NewDirection',this.onDirectionChanged);
    
    this.gun = Crafty.e('Gun').at(this.x,this.y);
    this.gun.holder = this;//for updateammo reverse call
    this.gun.name = "gun.name";
    
    
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
      
               //at my position relative to the grid unit
                this.weapon =  Crafty.e('Sword').at( this.x/Game.u  ,this.y/Game.u );
                
                this.weapon.holder=this;//tell the sword hey, i am holding you. move with me
               
                console.log(this.weapon);
                
                this.weapon.slice();
                
               
                   console.log('this.weapon.slice');
          break;
          case Crafty.keys.TAB:  
            console.log('TAB');
          break;
          case Crafty.keys.Add:
          
          break;
          case Crafty.keys.NUMPAD_0:
            //Crafty.scene(SCENES.inv);
            
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
             this.weapon_change(null);
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
              this.shoot(null);
          break;
          case Crafty.keys.CTRL:
             this.checkInventory();
          break;
          case Crafty.keys.ALT:
          
          break; 
          case Crafty.keys[1]:
         
              this.ability(1); 
          break;
      }
    });
    
    this.health = Player.health;
     
    this.updateCoins( Player.coins );
    this.updateAmmo(Player.ammo);
    this.updateKills(Player.stats.kills);
    this.updateMisses(Player.stats.misses);
    
    this.bind('EnterFrame', this.tick);
    
    //update kills and misses TODO     
  }
  ,ability:function(id)
  {
      switch(id)
      {
          case 1:
            this.dash();
          break;
          
      }
  }
  ,dash:function()
  {
      if(this.speed_timeout  > 0)
      {
          //we are already dashing, or in a delay
          return;
      }
      this.speed_timeout = 20;
      this.setSpeed(5);
      
  }
  
  //every game cycle
  ,tick:function()
  {
      if(this.damage_timeout>0) this.damage_timeout--;
      if(this.speed_timeout>0)
      {
          this.speed_timeout--;
          if(this.speed_timeout == 0)
          {
               this.setSpeed(Player.speed);
              
          }
          
      }
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
      //not used yet but it works
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
      //todo: change to this.weapon
      this.gun.shoot(dir);
  }

    ,weapon_change:function(w)
    {
        console.log('weapon_change');
        if(w) this.weapon = w;
    }
    
    ,hitNPC:function(data)
    {
        var npc = data[0].obj;
        
        npc.speak("Hello you");
        
    }
    ,takeStairway:function(data)
    {
        var stair = data[0].obj;
        stair.pickup(this);//hit by me the player
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
      //stairway.collect
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
    this.updateHealth(-1* Fire.attack);
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
      if(inc < 0)
      {
          //we are taking damage already, so disable this one
          if(this.damage_timeout > 0)
          {
              //.log('damage timeout safe');
              return; 
          }
          //its not zero, so we took damage
          Crafty.trigger('PlayerTookDamage');
          
           if(this.health <= 0)
          { 
             Crafty.trigger('Death');
          }
      } 
      
      this.health += inc; 
      Crafty.trigger('UpdateHUD');
       
  }
  
  
  ,onTookDamage:function()
  {
      this.damage_timeout = Player.invinc_frames;
      
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
  //functions to force movement
  ,_move_x:function(delta_x)
  {
      this.x += delta_x; 
  }
  ,_move_y:function(delta_y)
  {
      this.y += delta_y; 
  }
  // Stops the movement
  //underscore speed and movement are craftyjs variables

  
  
  ,onHitSolid: function(e) 
  {  
     if (!this._movement) 
     { //this case never happens anymore
            this._speed = 0;
            return;
     }
       
       //assume its x blocking our path
        
      this._move_x(-1 *  this._movement.x  );//back up by one horizontal step
      if (this.hit('Solid') != false)  //are we still in collision
      { 
         this._move_x( this._movement.x  );//step back to where we were before
      }
      
      //are we stil colliding? check upward movement. but if the above fixed us, do nothing
      if(this.hit('Solid'))
      {
            this._move_y(-1 *  this._movement.y  );//backup by one vertical step
            if (this.hit('Solid') != false)  
            { 
                this._move_y(   this._movement.y  );//back to where we started
            }
            //by this point, reversing x or y seperately did not avoid the collision. so it must be diagonal 
           if(this.hit('Solid'))// if its still a problem
           {
               //still didnt work. so must be a collision on both sides at once 
                this._move_x(-1 *  this._movement.x  );
                this._move_y(-1 *  this._movement.y  );
                
                
                
                //.log("done the diagonal undo",this.x,this.y);
           } 
       } 
       
  
  }
    ,onDirectionChanged:function(o)
    { 
          this.west = (o.x < 0 );//to the left
          this.east = (o.x > 0  );// right
            
          this.north = (o.y < 0 );
          this.south = (o.y > 0 );
          ///http://programmateur.lqbs.fr/blog/creating-an-eternal-animation-with-crafty-js/
          
        if(o.x === 0 && o.y === 0)
        {
            this.onStopMoving(o); 
        }
        else
        { 
            this.removeComponent('link_s');
            this.removeComponent('link_e');
            this.removeComponent('link_w'); ;
            this.removeComponent('link_n'); 
            if(this.north) this.addComponent('link_n');
            if(this.south) this.addComponent('link_s');
            if(this.east) this.addComponent('link_e');
            if(this.west) this.addComponent('link_w');
            //if(this.so) this.animate("link_n", 0, 0, 16);
            //link_s:[0,0]
        }
        //.log(this.north,this.east,this.south,this.west);
    }
    
    ,onStopMoving:function()
    {
       // this.addComponent('link_s');
    }
    ,skipNextMoves:0
   ,onMoved:function(o)
  {    
      // o contains previous location from before the move
      /*are we on the map or off edge 
        Game.width_px = Game.width * Game.u;
        Game.height_px = Game.height * Game.u;*/
      if(0 >  this.x || this.x >  Game.width_px
      || 0 >  this.y || this.y >  Game.height_px  )
      { 
          Crafty.trigger('PlayerOffScreen'); 
      }
       
      //this works
      if(this.is_drowning)
      { 
        this.updateHealth( -1  );
        
        
        
        
        if(this.skipNextMoves > 0)
        {
            this.skipNextMoves--;
            
            this.x = o.x;
            this.y = o.y;
            //.log('move undo from drowning'); 
        }   
        else 
        {
            this.skipNextMoves = 4;
            //.log('move CONTINUE from drowning');
        }
      }
      if(this.is_burning_lava)
      { 
        this.updateHealth( -5  );
      }
      
    
  }
});
