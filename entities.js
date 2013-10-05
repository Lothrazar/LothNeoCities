
 
// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', 
{
  init: function() 
  {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) 
  {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    }
    else 
    {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});


Crafty.c('Arrow',
{
  damage:0,
  init: function() 
  {
    this.damage = config.ARROW_DAMAGE;
    this.requires('2D, Canvas, Color, Collision');
    this.color('red');
    //my size
    this.attr({ w: 5, h: 2, z:50})
    
    this.onHit('Solid',this.hitSolid);
    this.onHit('Enemy',this.hitEnemy);
    this.onHit(Player.id,this.hitPlayer);
  }
  //Enemy
  
  ,hitSolid:function(e)
  { 
    Crafty(Player.id).updateMisses(1);//misseda shot lol
    this.destroy();
  }
  ,hitEnemy:function(data)
  { 
    //deal damage to the enemy, might not kill it    
    data[0].obj.updateHealth(-1 * this.damage);
    
   //destroy bullet every time
    
    this.destroy();
  } 
  
  
  ,hitPlayer:function(e)
  {
    //console.log('hitPlayer'); 
  } 
  
  
  //start the bullets movement. run after you create with Crafty.e
  ,fired: function(dir) 
  {
      this.bind("EnterFrame", function() 
      {
          this.move(dir, config.ARROW_SPEED);
          if(this.x > Crafty.viewport.width || this.x < 0) 
              this.destroy();
      });
      return this;
  }
});
 
//  custom shortcut for a grid object drawn on our 2D canvas. thatis: Actor == '2d, Canvas, Grid ' 
Crafty.c('Actor', 
{
  label:'',
  
  init: function() 
  {
    this.requires('2D, Canvas, Grid, Mouse');
    this.textShowing = false;
    this.label = this._entityName;
    this.text = null;
    this.bind('MouseOver', function() 
    {  
    return;//DISABLED 
      //if text is already showing, dont double show.
      if(this.textShowing) {return;}
      
      
      var text = Crafty.e("2D, DOM, Text").attr({ x: this.x, y: this.y }).text('this.label');
      
      this.textShowing = true;
      setTimeout(function()
      { 
        text.destroy();
        this.textShowing = false;
      },1000);
    });
    
  }
});

 



//an Object is a solid actor with a color (used for trees,rocks,etc)
Crafty.c('Object', 
{
  init: function() 
  {
    this.requires('Actor, Color, Solid');
  }
});

// This is the player-controlled character, it is an actor with a bunch of extra stuff
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
      .onHit('Stairway',this.stairway)
      ;
    this.attr({
      w: Game.map_grid.tile.width-4,//override grid dfeaults
      h: Game.map_grid.tile.height-4
    });
    
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
  
   // console.log('killedEnemy');
    
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


//all our objects 
Crafty.c(Tree.id, 
{
  init: function() 
  {
    this.requires('Object');
    this.color(config.TREE_COLOUR);
  },
});
 
 

//all enemies must come from this. special type of actor
//used by arrows (ammo) to distinguish betweens actors, objects, and enemies
//all enemies have health
Crafty.c('Enemy', 
{
  health:1,//minimum to start. customized in subclass
  init: function() 
  {
    this.requires('Actor');    
  }
  
  ,updateHealth:function(inc)
  {
    this.health += inc;
    
    if(this.health <= 0) 
    {
      this.destroy();
       
     Crafty(Player.id).killedEnemy(this);
       
    }
     
  } 
});

//a type of enemythat walks on the ground and avoids all things Solid 
Crafty.c('Walking', 
{
  speed:0.1,
  init: function() 
  {
    this.requires('Actor, Collision'); 
    this.attr(
    {  
      w: config.GRID_SIZE, 
      h: config.GRID_SIZE, 
      dX: this.speed, 
        dY: 0
    });
    this.bind('EnterFrame', function () 
    {
    
       //just move myself based on my speed
        this.x += this.dX;
        this.y += this.dY;
     
    });
    
    this.onHit('Solid', this.turnCorner);
    
  }
  
  ,turnCorner:function(e)
  {
    var turn = (Math.random() < 0.5) ? -1 : 1;//randomly turn left or right
    //to avoid looping
    
    if(this.dY == 0)//not going up or down
    {

      this.x -= this.dX; //first, back up from this step that put us inside the block
      this.dY = turn * this.dX;//by same amt
      this.dX = 0;
 
    }
    else if(this.dX == 0)//not going left or right
    {
      this.y -= this.dY; //first, back up from this step that put us inside the block
      
      this.dX = turn * this.dY;//convert that Y movement into X movement
      this.dY = 0; //halt movement in Y direction
 
    }
    
  }//end turncorner 
});//end EnemyWalking



Crafty.c('Flying',  // TODO: make fairy and dragon inherit this
{ 
  angle:0,
  angle_direction:0, // +1 or -1 for CW or CCW
  speed_rotation : 0.04,//how fast it turns corners
  speed:0,
  timer_movement:0, //count timer for the is_turning flag
  timer_movement_max : 50 , //when timer hits this max, swap the is_turning flag
  is_turning:false, //boolean to tell if turning in an arc, or going straight
  speed:0.1,
  init: function() 
  {
    this.requires('Actor');

    this.attr(
    {  
      speed : this.speed,
      w: config.GRID_SIZE, 
      h: config.GRID_SIZE, 
      z:11 , //z-index
        dX: 0, 
        dY: 0
    });
     
    //enterframe: this makes it move with our deltas (dX, dY)
    this.bind('EnterFrame', function () 
    {
      //first , decide if we are hitting the wall
      
       if (this.y <= 0 || this.y >= Game.height() || this.x <= 0 || this.x >= Game.width() ) 
       {
         //if so pull a full 180
         this.angle += Math.PI; 
       }
      
      
      //then, decide if we will go straight, or turn. 
      
      if(this.timer_movement > this.timer_movement_max)  
      { 
        // switch between straight and turning
        
        this.is_turning = !this.is_turning;
        //this is where we randomize if we are turning CW or CCW for this 'timer' segment
        this.angle_direction = (Math.random() < 0.5) ? 1 : -1;
        
        //reset timer
        this.timer_movement = 0;
          
      }
      //else keep doing what we are doing (straight or corner)
      
      if(this.is_turning)
      {
        //if we are turning, then change the angle. 
          
        this.angle += this.angle_direction * this.speed_rotation;
      }
      //otherwise angle stays the same
      
      
      this._move();
     
      //TODO: move event (dragon spit fire, etc)
    
    })
     
  },
  
  _move:function()
  { 
    
     //keep it within 360 , mock modular arithmatic
     if(this.angle > 2*Math.PI) this.angle  -= 2*Math.PI;
    //angular movement
    
    
    //trig used for both straight and turning
    //if we are going straight, then the angle just doesnt change every time
    
    this.x +=  Math.sin(this.angle) * this.speed;
        this.y +=  Math.cos(this.angle) * this.speed;
    
    
    this.timer_movement ++;
  }
  
});//end EnemyFlying

Crafty.c(Zombie.id, 
{
  speed :  Zombie.speed,
  health : Zombie.health,
  init: function() 
  {
    this.requires('Enemy, Walking, spr_zombie'); //removed Solid
    
    //replaced spr over colour
   // this.color(config.ZOMBIE_COLOUR);
 
  }//end zombie init
 
  
  ,collect: function() 
  {
    this.destroy();
   
    Crafty.trigger('PlayerTookDamage', this);//check for death. TODO name change from firecollect to healthchangeevent
  }
}); //end of Zombie definition


Crafty.c('NPC', 
{
  init: function() 
  {
    this.requires('Actor,Walking, Color,Mouse');
    this.color(config.NPC_COLOUR);
    this.bind('MouseOver', function() 
    {
            
      //this.color("yellow");
            
          
      var text = Crafty.e("2D, DOM, Text").attr({ x: this.x, y: this.y }).text("Hello");
      
      setTimeout(function()
      { 
        text.destroy();
      },1000);
    });
  },
});

Crafty.c('Stairway', 
{
  init: function() 
  {
    this.requires('Actor, Solid, Color');
    this.color('rgb(139,119,101)');
     
  },
    collect: function() 
  {
    console.log('stairway todo');
  }
});

Crafty.c(Dragon.id, 
{  
  init: function() 
  {
    this.requires('Enemy, Flying, Color');
    this.color(Dragon.colour);
 
    this.attr(
    {  
      speed : config.DRAGON_SPEED 
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
    Crafty.trigger('PlayerTookDamage', this);  
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


 
////////////menu stuff
Crafty.c('MenuLabel', 
{
  init: function() 
  {
    this.requires("2D, DOM, Text");
     
    this.css({"font": "9pt Arial", "color": "#F00", "text-align": "left"});
    this.attr({ w:64, h:16 }); 

  }
});

Crafty.c('MenuData', 
{
  init: function() 
  {
    this.requires("2D, DOM, Text");
     
    this.css({"font": "9pt Arial", "color": "#F00", "text-align": "left"});
    this.attr({ w:64, h:16 }); 
    
  }
});

