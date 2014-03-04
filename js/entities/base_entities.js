
 
// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', 
{
  init: function() 
  {
    this.attr(
    {
      w: Game.u,//unit
      h: Game.u
    });
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) 
  {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.u, y: this.y/Game.u }
    }
    else 
    {
      this.attr({ x: x * Game.u, y: y * Game.u});
      return this;
    }
  }
});


 
//  custom shortcut for a grid object drawn on our 2D canvas. thatis: Actor == '2d, Canvas, Grid ' 
Crafty.c('Actor', 
{
  label:'',
  
  init: function() 
  {
    this.requires('2D, Canvas, Grid');
    this.textShowing = false;
    this.label = this._entityName;
    this.text = null;
    /*
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
    */
  }
});

 Crafty.c('Darkness', 
{
  init: function() 
  {
    this.requires('Actor, Color') ;//      .color(config.FIRE_COLOUR)
    
    this.color('rgb(0,0,0)');
    
    this.attr({alpha:0.8});
  } 
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
    console.log('enemytookdamage',this.health);
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
    //randomize initial direction of up/down, left/right
    var UD=0, LR=0;
    if(coinflip()) 
    {
      //move vertically   , so pick up or down at random
       if(coinflip()) UD = -1* this.speed; else  UD = this.speed; 
    }
    else
    {
        //move horiz
       if(coinflip()) LR = -1* this.speed; else  LR = this.speed;
    }
    //it will never happen with both zero now

    this.attr(
    {  
      w: Game.u, 
      h: Game.u, 
      dX: LR, 
      dY: UD
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
      w: Game.u, 
      h: Game.u, 
      z:11 , //z-index
        dX: 0, 
        dY: 0
    });
     
    //enterframe: this makes it move with our deltas (dX, dY)
    this.bind('EnterFrame', function () 
    {
      //first , decide if we are hitting the wall
      
       if (this.y <= 0 || this.y >= Game.height_px || this.x <= 0 || this.x >= Game.width_px ) 
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


Crafty.c('Speak',
{
  init: function() 
  {
    this.requires('Actor');
    
   }
   ,speaking:false
    ,speak : function(msg,timeout) 
    { 
        if(this.speaking)
        {
            console.log('already speaking');
            return;
        }
        console.log("NEW MSG");
        if(!msg) msg="empty";
        if(timeout<=0) timeout=100000;
        
      var text = Crafty.e("2D, DOM, Text").attr({ x: this.x, y: this.y }).text(msg);
      this.speaking = true;
     
//todo; set speaking false after
    }
    
    
  
});

Crafty.c("EntityMouseOver",
{
    
  init: function() 
  {
    this.bind('MouseOver', function() 
    {
            this.mouseover();
    });
  }
  
 , mouseover:function(){}
});

Crafty.c('NPC', 
{
  init: function() 
  {
    this.requires('Speak, Color, Solid');//walking
    this.color('red');//'rgb(221, 168, 160)'
 
 
  },
});

Crafty.c('Teleport', 
{
  init: function() 
  {
    this.requires('Actor, Solid, Color');
    this.color('rgb(139,119,101)');
     
  }
 //TODO; when player walks on this, TP them somewhere else
  
});



Crafty.c('SceneChanger', 
{
    
    //when player walks on this, change to new scene
  init: function() 
  {
    this.requires('Actor, Solid, Color');
    this.color('rgb(139,119,101)');
     
  }
  ,to_scene:function()
  {
      //TODO: how to really do this
      return this.my_scene;
  }
  
  
});



 
