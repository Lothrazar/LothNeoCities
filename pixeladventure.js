//based on tutorial at http://buildnewgames.com/introduction-to-crafty/
// TODO: TRACK zombie kill on head-on-collision. or jsu bounche them back.

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//events
var EV = 
{
    
    
};
var EXT=
{
    IMG:'.png'
    ,AUDIO:'.mp3'
};
 
   //single images
var IMG=
{
  coin:'goldCoin'+EXT.IMG
  ,rock:'rock0'+EXT.IMG
  ,flame:'flame'+EXT.IMG
  ,zombie:'zombie'+EXT.IMG
  ,rocks:'rock_sprites'+EXT.IMG
};

  //audio files
var AUDIO =
{ 
    //pass in id and length of your sound file
   //workaround since either craftyjs or HTML5 support in chrome sucks for audio, doesnt restart the file after playing it once
   PLAY:function(id,vol)
   {
       if(!vol ) vol = 1;//volume
  
       //add it all ove again d
       Crafty.audio.add(id,id + EXT.AUDIO);
 
       //Crafty.audio.stop(id); //this Should work, just stop and replay. but nooOoOOOOoo.. gottta reDoNnLOOoooOAAD
       Crafty.audio.play(id,1,vol); 
   }
 
  ,coin: 'coin-01'   
  ,fairy: 'magic-01'    
  ,shoot: 'gun_shoot'  
  ,reload: 'gun_load'  
  ,fire: 'fire'  
  ,leaves: 'leaves'  
  
  
  
}
   
var SCENES =
{
  victory: 'Victory'  
  ,game:'Game'
  ,loading:'Loading'
  ,death:'Death'
   
};

var Zombie = 
{
   id:"Zombie",
   speed:0.9,
   attack:3,
   health:1,
   colour:'rgb(0, 255, 0)' ,// legacy :: overwritten by sprites 
};

var Player =
{
    id:'PlayerCharacter',
    speed:1.5,
    health:10,
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

var Dragon = 
{
    id:"Dragon",
  attack:5,
  speed:1.75,
  colour:'rgb(0, 0, 0)' 
};

var Fairy =
{
    id:'Fairy',
    attack: -10,
    colour:'rgb(255, 105, 180)'
};

var Tree = {id:'Tree'}; 
var Coin = {id:'Coin'};
var Rock = {id:'Rock'};
var Fire = {id:'Fire'};


//TODO: allow Parts of config to  be loaded via JSON
var config = 
{
    
    //TODO: restrucutre these into sub objects
    
  GRID_SIZE:16   //size of a tile
  //how many tiles wide and high are we
  ,GAME_WIDTH:64
  ,GAME_HEIGHT:32
 
  ,ZOMBIE_COIN_SPAWN_CHANCE:0.9 //chance to spawn zombie when a coin is grabbed
  ,ZOMBIE_START_COUNT:5 //how many zombies start on the field right away (was zero)
 
  
  ,DRAGON_FIRE_CHANCE:0.04 // 1% chance of it breathing fire. if math.random less than this
  ,DRAGON_COINS_NEEDED:10
   
  ,FAIRY_COINS_NEEDED:5 // every this many coins, make new fairy
  
  ,FIRE_DAMAGE:1
  ,FIRE_COLOUR:'rgb(255, 0, 0)'
  ,FIRE_SPAWN_CHANCE:0.01
  
  
  ,TREE_COLOUR:'rgb(20, 125, 40)'
  
   
  ,ROCK_SPAWN_CHANCE:0.04
  
  ,COIN_SPAWN_CHANCE:0.015
  ,COIN_COLOUR:'rgb(255, 215, 0)'
  
  ,ARROW_SPEED:10
  ,ARROW_DAMAGE:1
  ,ARROW_SIZE:3
  
  ,BACKGROUND_COLOR:'rgb(173, 255, 164)'
  
  
  ,NPC_COLOUR:'rgb(221, 168, 160)'
  
};

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
      .onHit('Fire',this.collectFire)
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

Crafty.c('Fire', 
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



/********************* end of object definitions ***********************/

Crafty.scene(SCENES.game, function() 
{
 
  // A 2D array to keep track of all occupied tiles
  
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) 
  {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) 
    {
      this.occupied[i][y] = false;
    }
  }

  var map =  this.occupied;
  //Crafty.e actually returns a reference to that entity!
 this.player = Crafty.e(Player.id).at(Player.start_x, Player.start_x); 
 // this.occupied[this.player.at().x][this.player.at().y] = true;
  
  
 //Crafty.e('Stairway').at( 20 , 20 );
 //this.occupied[20][20] = true;

  //Crafty.e('NPC').at(6, 6);
   
   //spawner function that is used later
   this.spawn_random_zombie = function()
   {
      var tries=0, MAX_FAILS = 10;
      
      //try to make only one. but might be occupied
      while(tries < MAX_FAILS)
      {
        tries++;
      
      
        //try and make a random zombie
        var randX = Crafty.math.randomInt(0,Game.map_grid.width-1);
        var randY = Crafty.math.randomInt(0,Game.map_grid.height-1);
        
        if(this.occupied[randX][randY] == false)
        { 
           Crafty.e(Zombie.id).at(randX,randY);
           return;//stop looping
        }
      }
   };
  
  //lay out where objects will be made
  //map[Player.start_x][Player.start_y] = Player.id;
  //for now keep border
  for (var x = 0; x < Game.map_grid.width; x++)   {map[x][0] = Tree.id;map[x][Game.map_grid.height-1] = Tree.id;}
  for (var y = 0; x < Game.map_grid.height; y++)  {map[0][y] = Tree.id;map[Game.map_grid.width-1][y] = Tree.id;}
  
  map[1][4] = Rock.id;
  map[2][4] = Rock.id;
  map[3][4] = Rock.id;
  map[4][4] = Rock.id;
  map[5][4] = Rock.id;
  map[6][4] = Rock.id;
  map[9][4] = Rock.id;
  
  map[1][5] = Fire.id;
  map[2][6] = Fire.id;
  map[3][8] = Fire.id;
  map[4][10] = Fire.id;
  map[5][12] = Fire.id;
  map[6][16] = Fire.id;
  map[9][20] = Fire.id;
  
  
  map[1][12] = Coin.id;
  map[3][6] = Coin.id;
  map[8][8] = Coin.id;
  map[17][10] = Coin.id;
  map[25][12] = Coin.id;
  map[16][16] = Coin.id;
  map[19][20] = Coin.id;
  
  var random = false;
  
 //remember to check for occupied squares
  for (var x = 0; x < Game.map_grid.width; x++) 
  {
    for (var y = 0; y < Game.map_grid.height; y++) 
    {
        
        if(random == false)
        { 
            if(typeof map[x][y] != 'undefined' && map[x][y] != false)
            { 
              Crafty.e(map[x][y]).at( x , y );
            }
        }
        else
        {
            
                         
              var at_edge = x == 0 || x == Game.map_grid.width -1 || y == 0 || y == Game.map_grid.height -1;
              
              // Place a tree at every edge square on our grid of  tiles
              if (at_edge && !this.occupied[x][y]) 
              { 
                 // Place a tree entity at the current tile
                 Crafty.e(Tree.id).at( x , y );
                 this.occupied[x][y] = true; 
              } 
              
              //TODO: neighbours http://jsfiddle.net/evFBq/
              //else
              if (Math.random() < config.ROCK_SPAWN_CHANCE && !this.occupied[x][y]) 
              { 
                 Crafty.e(Rock.id).at( x, y);
                 this.occupied[x][y] = true;
              }
              // var max_coins = 5;
              if (Math.random() < config.COIN_SPAWN_CHANCE) 
              {
                //Crafty(Coin.id).length < max_coins &&
                if ( !this.occupied[x][y]) 
                {
                  Crafty.e(Coin.id).at(x, y);
                 this.occupied[x][y] = true;
                }
              } 
        
              if (Math.random() < config.FIRE_SPAWN_CHANCE) 
              { 
                if ( !this.occupied[x][y]) 
                {
                  Crafty.e(Fire.id).at(x, y);
                 this.occupied[x][y] = true;
                }
              } 
   
        }  //end if random is true          
    }//end y for loop
  }//end x for loop
 
 //make initial mobs
  var zombiesSpawned = 0;
  
  if(random == false) while(zombiesSpawned < config.ZOMBIE_START_COUNT)
  {
    this.spawn_random_zombie(); 
    //even if the spawn failed, count anyway so we dont loop forever
    zombiesSpawned++;
  }


  //fairys and dragons both fly, so do not occupy squares
  this.dragon = Crafty.e(Dragon.id).at(25, 25);
  
  
      //Create a menu/HUD at the bottom of the screen with a button
  var menuBkg = Crafty.e("2D, DOM, Color");
      menuBkg.color('rgb(0,0,0)');
      menuBkg.attr({ w:Game.hud.width, h: Game.hud.height , x:0-20, y:Game.height() - Game.hud.height});
  
  var X_SPACING = 10;
  var Y_SPACING = 1;
  
  var lblHealth = Crafty.e("MenuLabel");
      lblHealth.text('Health'); 
      lblHealth.attr({ x:menuBkg.x+X_SPACING, y:menuBkg.y+Y_SPACING });
      
   var hudHealth = Crafty.e("MenuData");
      hudHealth.text('0'); 
      hudHealth.attr({ x:menuBkg.x+8*X_SPACING, y:menuBkg.y+Y_SPACING }); 
      
   var lblAmmo = Crafty.e("MenuLabel");
      lblAmmo.text('Ammo'); 
      lblAmmo.attr({ x:menuBkg.x+12*X_SPACING, y:menuBkg.y+Y_SPACING });    
  
    var hudAmmo = Crafty.e("MenuData");
      hudAmmo.text('0'); 
      hudAmmo.attr({ x:menuBkg.x+20*X_SPACING, y:menuBkg.y+Y_SPACING }); 
    
    var lblCoins = Crafty.e("MenuLabel");
      lblCoins.text('Coins'); 
      lblCoins.attr({ x:menuBkg.x+28*X_SPACING, y:menuBkg.y+Y_SPACING });    
  
    var hudCoins = Crafty.e("MenuData");
      hudCoins.text('0'); 
      hudCoins.attr({ x:menuBkg.x+32*X_SPACING, y:menuBkg.y+Y_SPACING }); 
 
      
  this.bind('UpdateHUD', function() 
  {  
  //#TODO find a way to loop these?
    hudHealth.text(Crafty(Player.id).health);
    hudAmmo.text(Crafty(Player.id).ammo);
    hudCoins.text(Crafty(Player.id).coins);
  
  });
  
  this._CoinCollect = this.bind('CoinCollect', function() 
  {
    if (!Crafty(Coin.id).length) 
    { 
     Crafty.scene(SCENES.victory);
    }
    else
    {
      
      if(Math.random() < config.ZOMBIE_COIN_SPAWN_CHANCE)
      {
        this.spawn_random_zombie(); 
      }  
      
      
      var coins_current = Crafty(Player.id).coins;
      
      if(coins_current > 0 && coins_current % 5 == 0)
      {
        //console.log("%5 fairy event");
        
        Crafty.e(Fairy.id).at(50, 5);
      }
      
    }
  });
  
  this.show_failure = this.bind('PlayerTookDamage',function(e)
  { 
    if(Crafty(Player.id).health <= 0)
    {
      Crafty.scene(SCENES.death);
    }
  });
   
   Crafty.trigger('UpdateHUD');
    
}//end scene definition, first function
, function() 
{
//unbind some functions
  this.unbind('CoinCollect', this._CoinCollect);
  
}//second function passed to scene
);//end Game scene
  
   
   
  
  
  //victory scene also takes two functions
Crafty.scene(SCENES.victory, function() 
{
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Victory!  Press ESC to play again.');
 
  this.restart_game = this.bind('KeyDown', function(e) 
  {
    if(e.key == Crafty.keys['ESC'])  Crafty.scene(SCENES.death);
  });
}, 
function() 
{
  this.unbind('KeyDown', this.restart_game);
});  
   
   
Crafty.scene(SCENES.death, function() 
{
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Death! Your health has hit zero!  Press ESC to play again.');
 
  this.restart_game = this.bind('KeyDown', function(e) 
  {
    if(e.key == Crafty.keys['ESC'])  Crafty.scene(SCENES.game);
  });
}, 
function() 
{
  this.unbind('KeyDown', this.restart_game);
});  
   


// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene(SCENES.loading, function()
{
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    //.css($text_css)
    ;
 
 
	 //load all images
	 var assets = [];
	 assets.push(IMG.coin); 
	 assets.push(IMG.flame);
     assets.push(IMG.zombie);
	 //audio files
	 assets.push(AUDIO.coin);
	 assets.push(AUDIO.shoot);
     assets.push(AUDIO.fire);
     //TODO: these lower 3 unused
     assets.push(AUDIO.leaves);
	 assets.push(AUDIO.reload);
     assets.push(AUDIO.fairy);
	 
	 assets.push(IMG.rocks );
 
  Crafty.load(assets, function()
  { 
  	//after load action finishes, do this
    Crafty.sprite(16, IMG.coin, 
    {
      'spr_coin':    [0, 0]
    });
    Crafty.sprite(16, IMG.flame, 
    {
      'spr_flame':    [0, 0]
    });
    
    
    Crafty.sprite(16, IMG.zombie, 
    {
          'spr_zombie':    [0, 0]
    });
    
    
    
     Crafty.sprite(16, IMG.rocks, 
     { 
          spr_rock0:    [0, 0] 
         ,spr_rock1:    [0, 1] 
         ,spr_rock2:    [0, 2] 
         ,spr_rock3:    [0, 3] 
         ,spr_rock4:    [1, 0] 
         ,spr_rock5:    [1, 1] 
         ,spr_rock6:    [1, 2] 
         ,spr_rock7:    [1, 3] 
         ,spr_rock8:    [2, 0] 
         ,spr_rock9:    [2, 1] 
         ,spr_rock10:   [2, 2] 
         ,spr_rock11:   [2, 3] 
         ,spr_rock12:   [3, 3] 
         ,spr_rock13:   [3, 0] 
         ,spr_rock14:   [3, 1] 
         ,spr_rock15:   [3, 2] 
         
     } );
    
    //dont load here. wait for on demand
  //  Crafty.audio.add('coin-01','coin-01.mp3');
   // Crafty.audio.add('magic-01','magic-01.mp3');
  //  Crafty.audio.add('gun_shoot','gun_shoot.mp3');
   // Crafty.audio.add('gun_load','gun_load.mp3');
    //Crafty.audio.add('coin-01','coin-01.mp3');
    
    
    // Now that our sprites are ready to draw, start the game
    Crafty.scene(SCENES.game);
  })
});
   
   
//finally we can start the game
Game = 
{
  // Initialize and start our game
  start: function() 
  {
    // Start crafty and set a background color so that we can see its working
    
    Crafty.init(Game.width(), Game.height() +   Game.hud.height);
     
    Crafty.background(config.BACKGROUND_COLOR);
     Crafty.scene(SCENES.loading); 
  }
  
  ,
  map_grid: 
  {
    //how many tiles each direction
    width: config.GAME_WIDTH,
    height: config.GAME_HEIGHT,
    //size of each tile
    tile: 
    {
      width: config.GRID_SIZE,
      height: config.GRID_SIZE
    }
  },
   
  hud:
  {
    height: config.GRID_SIZE + 4,
    width: config.GAME_WIDTH * config.GRID_SIZE
  },
  
  width: function() 
  {
    return this.map_grid.width * this.map_grid.tile.width ;
  },
  height: function() 
  {
    return this.map_grid.height * this.map_grid.tile.height;
  }
}; //end of Game.