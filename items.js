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
