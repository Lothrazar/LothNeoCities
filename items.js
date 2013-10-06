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
               console.log('weapon set its own via holder');
               this.x=this.holder.x;
               this.y=this.holder.y;
               
           }
       });
       
       
     
   } 
   ,slice:function()
   {
       console.log("slice");
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
     
    
    }


  ,shoot:function(dir)
  {
    if(this.ammo <= 0) 
    { 
         AUDIO.PLAY(AUDIO.reload);////left at default volume
        return; 
        
     }//dont shoot if empty
    
    
    
    //origin is top left, so up and left are negative
    
     
    if(dir===null)
    {
        //default direction to movement
        
        
        var movingUp = (this._movement.y < 0 );//can both be false
        var movingDown = (this._movement.y > 0 );
        
        var movingLeft = (this._movement.x < 0 );
        var movingRight = (this._movement.x > 0 );
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
  //create it, then fire it in given direction
    Crafty.e("Arrow").attr({x: this.x, y: this.y , w: config.ARROW_SIZE, h: config.ARROW_SIZE, z:50}).fired(dir);
  
    this.holder.updateAmmo(-1);//reduce ammo by one since this shot was successful
 
   
    AUDIO.PLAY(AUDIO.shoot,1);
 
    setTimeout(function()
    {
        AUDIO.PLAY(AUDIO.reload);
        
    },180);
  }
});
