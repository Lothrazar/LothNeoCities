Crafty.c('Sword',
{
    holder:null,
   init:function()
   {
       
        this.requires('Actor,  sword_1');
       //
       this.rotation=20;
       
       this.bind('EnterFrame',function()
       {
           console.log('ef', this.rotation,this.slicing);
           if(this.slicing)
           {
               this.rotation = this.rotation + 1;
               if(this.rotation > this.end) 
               {
                   this.slicing=false;
                   this.rotation = this.start;
                   this.destroy();
               }
               
           } 
           //it has a holder
           if(this.holder)
           {
              // console.log('weapon set its own via holder');
               this.x = this.holder.x;
               this.y = this.holder.y;
               
           }
       });
       
       
     
   } 
   ,slice:function()
   {
     //  console.log("slice");
       this.slicing=true;
       this.start=10;
       this.end=70;
       
   }
});


Crafty.c('Gun',
{
    holder:null,
   init:function()
   {
        this.requires('Actor');//TODO: holder and icon ?
     
        this.holder = Game.player;
    }


  ,shoot:function(dir)
  { 
    if(this.holder.ammo <= 0) 
    { 
         AUDIO.PLAY(AUDIO.reload);////left at default volume
        return; 
        
     }//dont shoot if empty
    
    
    
    //origin is top left, so up and left are negative
    
     
    if(dir===null)
    {
        dir = '';
        //default direction to movement
 
        var movingUp = (this.holder._movement.y < 0 );//can both be false
        var movingDown = (this.holder._movement.y > 0 );
        
        var movingLeft = (this.holder._movement.x < 0 );
        var movingRight = (this.holder._movement.x > 0 );
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
        
    
    }
   // console.log('shoot',this.holder.x,this.holder.y,dir);
  //create it, then fire it in given direction
    Crafty.e("Arrow").attr({x: this.holder.x, y: this.holder.y , w: Arrow.size, h: Arrow.size, z:50}).fired(dir);
  
    this.holder.updateAmmo(-1);//reduce ammo by one since this shot was successful
 
   
    AUDIO.PLAY(AUDIO.shoot,1);
 
    setTimeout(function()
    {
        AUDIO.PLAY(AUDIO.reload);
        
    },180);
  }
});




Crafty.c(Loot.id,
{
   init:function()
   {
        this.requires('Actor,  spr_stair_1');//TODO: texture temporary
        
   } 
   ,content:null
   ,pickup:function(holder)
   { 
      
       
       if(this.content)
       { 
           //todo: fill contents with gun, sword, etc
            holder.addToInventory(this.content);
       }
       else
       {
           console.log('pickup null Loot');
       }
       this.destroy();
       
   }
});
 
Crafty.c(Arrow.id,
{
  damage:0,
  init: function() 
  {
    this.damage = Arrow.attack;
    this.requires('2D, Canvas, Color, Collision');
    this.color('red');
    //my size
    this.attr({ w: 5, h: 2, z:50})
    
    this.onHit('Solid',this.hitSolid);
    this.onHit('Enemy',this.hitEnemy);
    this.onHit(Zombie.id,this.hitEnemy);
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
      
      console.log(data[0].obj);
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

      if(dir == 'se'){this.x+10;this.y+=10;}//TODO: hmm workaround so it doesnt get stuck in my ?foot?
      
      this.bind("EnterFrame", function() 
      {
          
          this.move(dir, Arrow.speed);
          if(this.x > Crafty.viewport.width || this.x < 0) 
          {
              console.log('Arrow.destroy. TODO: count as a  miss');
              this.destroy();
          }
      });
      return this;
  }
});


