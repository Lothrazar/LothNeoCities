
//finally we can start the game
//custom wrapper of my constants, and starting crafty
Game = {};
Game.player = null;//pointer to player (I may phase this out)

//hud size
 
Game.u = 16;//size of each tile. short for unit

Game.width  = 64;//how many tiles each direction
Game.height = 32;

//the same thing but for indexed by zero arrays
Game.max_x = Game.width  -1;
Game.max_y = Game.height -1;
    
Game.min_y = 0 ;
Game.min_x = 0;

//pixel version
Game.width_px =  Game.width * Game.u;
Game.height_px = Game.height * Game.u;

//Game.map_grid phased out
Game.start = function() 
{
    // Start crafty and set a background color so that we can see its working
    
    Crafty.init( Game.width_px,  Game.height_px + 90);
     
    Crafty.background('rgb(162, 255, 151)');//('rgb(255, 255, 255)');
    Crafty.scene(SCENES.loading); 
} 
 

Crafty.scene(SCENES.game, function() 
{ 
     if(Game.args)
     {
         //used to pass arguments between reloads of this scene
     }
     //first time?
    if( Game.player === null)
    { 
        Game.player = Crafty.e(Player.id).at(Player.start_x, Player.start_x);   
        
        //TODO: smarter fairy spawning
        Crafty.e(Fairy.id).at(50, 5);
    }
   
    this.setmap = function(newMap)
    {  
      
          var id;
          
          for (var x = 0; x < Game.width; x++)   for (var y = 0; y < Game.height; y++) 
          {   
              this.entity_map = [];
              
             // Crafty.e('Darkness').at(x,y);
             
   
              id = newMap[y][x] ; //id of the block or item or whatever for Crafty to create. such as Rock.id or Tree.id
              //right now we setting empty space as zero
              
              if( id ) //checks for false/zero
              {  
                 Crafty.e( id ).at( x , y ); 
              }
               
                   
          }
          
          
   }
    
   if(!Maps.current) Maps.current = 0;//as good as parsing to int
    
   this.setmap(Maps.list[Maps.current]);//trust that CURRENT has been set as initial
  
 //  this.dragon = Crafty.e(Dragon.id).at(25, 25);//maybe hardcoded
    
  //Create a menu/HUD at the bottom of the screen with a button
  var menuBkg = Crafty.e("2D, DOM, Color");
      menuBkg.color(HUD.color );
      menuBkg.attr({ w:HUD.width, h: HUD.height , x: HUD.x , y:Game.height_px + HUD.y });
      
    //fixes
    var X_SPACING = 9;
    var Y_SPACING = 1;
  
    var lblHealth = Crafty.e("MenuLabel").text('Health').attr({ x:menuBkg.x   +X_SPACING, y:menuBkg.y+Y_SPACING }); 
    var lblAmmo  = Crafty.e("MenuLabel").text('Ammo').attr(   { x:menuBkg.x+12*X_SPACING, y:menuBkg.y+Y_SPACING });  
    var lblCoins = Crafty.e("MenuLabel").text('Coins').attr(  { x:menuBkg.x+28*X_SPACING, y:menuBkg.y+Y_SPACING });  
    var lblWeapon= Crafty.e("MenuLabel").text('Gun').attr(    { x:menuBkg.x+64*X_SPACING, y:menuBkg.y+Y_SPACING });  
    
    
    HUD.hudHealth = Crafty.e("MenuData").text('0').attr({ x:menuBkg.x+8*X_SPACING, y:menuBkg.y+Y_SPACING }); 
    HUD.hudAmmo   = Crafty.e("MenuData").attr({ x:menuBkg.x+20*X_SPACING, y:menuBkg.y+Y_SPACING }).text('0').attr({ x:menuBkg.x+20*X_SPACING, y:menuBkg.y+Y_SPACING }); 
    HUD.hudCoins  = Crafty.e("MenuData").text('0').attr({ x:menuBkg.x+32*X_SPACING, y:menuBkg.y+Y_SPACING });
 
       
  
  
  this.bind('UpdateHUD', function() 
  {  
    var p = Game.player || Crafty(Player.id);
    
  //#TODO find a way to loop these?
    HUD.hudHealth.text(p.health);
    HUD.hudAmmo.text(p.ammo);
    HUD.hudCoins.text(p.coins);
    
    if(p.gun)     lblWeapon.text(p.gun.name);
  
  });

  
  
  this._offscreen = this.bind('PlayerOffScreen',function()
  { 
  	 
  	 
      var west = (Game.player.x < Game.min_x );//to the left
      var east = (Game.player.x+1 >= Game.width_px  );// right
      
      var north = (Game.player.y < Game.min_y );
      var south = (Game.player.y > Game.height_px );
 
     
      if(Maps.network[Maps.current])
      {
      	console.log('PlayerOffScreen',Game.player.x , Game.player.y);
      
      	
          var network = Maps.network[Maps.current];
      
          var newMap = null;
          //flip them to the opposite side of the map too
 
          if(east && network.e >=0)  
          {  
              newMap = network.e; //send to far west side
              
              Game.player.x = Game.min_x ;//+ 2*Game.u;  
          }
           
          if(west && network.w >=0)  
          {  
              newMap = network.w;//go to west side
              Game.player.x = Game.width_px - Game.u;
          }
 
          if(north && network.n >=0)
          {  
               newMap = network.n;
               Game.player.y = Game.height_px -  Game.u;
          }
    
          if(south && network.s >=0)  
          {
              console.log("off map SOUTH from ",  Game.player.x  );
              newMap = network.s;
              Game.player.y = Game.min_y ;//+ 3*Game.u;
              console.log("TO",  Game.player.x  );
          } 
          if(newMap !== null)
          {  
          	
      console.log(north,east,south,west);
      console.log("END OF LEAVESCREEN EVENT",Game.player.x , Game.player.y);
          	
          	
              Maps.current = newMap;
              Crafty.scene(SCENES.game);
              return;
          }
      }   
      //either no network, or no newmap found
      //so keep the player on the screen
      //which side is it off
      if( west ) Game.player.x = Game.player.x * -1;//flip back onto the map
      if( north ) Game.player.y = Game.player.y * -1;//flip back onto the map
      
      if( east ) Game.player.x -= 2*(Game.player.x - Game.width_px ) ;//flip back onto the map
      if( south ) Game.player.y -= 2*(Game.player.y - Game.height_px) ;//flip back onto the map
  
      
  });
  
  
   /*
  this._CoinCollect = this.bind('CoinCollect', function() 
  { 
      console.log('CoinCollect unused event');
     
    if (!Crafty(Coin.id).length) 
    { 
      Crafty.scene(SCENES.victory);
    }
    else
    { 
        
        console.log('TODO zombie randomizer');
      if(Math.random() < 0.5)
      {
         Crafty.e(Zombie.id).at(50,10);
      }  
       
      var coins_current =  Game.player.coins;// Crafty(Player.id).coins;
     
      if(Game.player.coins > 0 && Game.player.coins % 5 == 0)
      { 
        Crafty.e(Fairy.id).at(50, 5);
      } 
       
    }
  });
  */
      
    this.show_failure = this.bind('Death',function(e)
    {
       Game.player.destroy();
      Crafty.scene(SCENES.death);
    });
   
   //set initial hud
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
    .attr({ x: 0, y:  Game.height_px /2 - 24, w: Game.width_px,color:'red' })
    //.css($text_css)
    ;
  
	 //load all images
	 var assets = [];
	 assets.push(IMG.coin); 
	 assets.push(IMG.flame);
     assets.push(IMG.zombie);
     assets.push(IMG.dungeon_sheet);
     assets.push(IMG.opensheet_1);
	 //audio files
	 assets.push(AUDIO.coin);
	 assets.push(AUDIO.shoot);
     assets.push(AUDIO.fire);
 
     assets.push(AUDIO.leaves);
	 assets.push(AUDIO.reload);
     assets.push(AUDIO.fairy);
	 
	 assets.push(IMG.rocks );
	 assets.push(IMG.sword_1);
	 assets.push(IMG.purple);;
     assets.push(IMG.player);

 
  Crafty.load(assets, function()
  { 
     var SHEET_RES = 16;
  	//after load action finishes, do this
    Crafty.sprite(SHEET_RES, IMG.coin, 
    {
      'spr_coin':    [0, 0]
    });
    Crafty.sprite(SHEET_RES, IMG.flame, 
    {
      'spr_flame':    [0, 0]
    });
    
    
    Crafty.sprite(SHEET_RES, IMG.zombie, 
    {
          'spr_zombie':    [0, 0]
    });
    
    
    
     Crafty.sprite(SHEET_RES, IMG.rocks, 
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
     
      
    Crafty.sprite(SHEET_RES, IMG.dungeon_sheet,  // dungeon16.png
     { 
          spr_wall_black:    [2, 0] 
         ,spr_wall_blue:     [3, 0] 
         ,spr_wall_green:    [4, 0] 
         ,spr_wall_bluelt:   [5, 0] 
         ,spr_wall_red:      [6, 0] 
         ,spr_wall_purp:     [7, 0] 
         ,spr_wall_brown:    [8, 0] 
         ,spr_wall_grey:     [9, 0] 
         ,spr_wall_greydk:  [10, 0] 
         ,spr_wall_yellow:  [16, 0] 
         ,spr_wall_white:   [17, 0] 
         ,spr_door:         [19, 0] 
         ,spr_lava:         [27, 0] 
         ,spr_water:        [28, 0] 
         ,spr_waterdk:      [29, 0] 
         
         ,spr_stair_1:      [3, 1] 
         
     } );
     Crafty.sprite(SHEET_RES, IMG.sword_1,//'opensource16_1.png'
     {
          sword_1 : [0,0]  
         //go to 16  
        
     });
     Crafty.sprite(SHEET_RES,IMG.purple,
     {
        player:[0,0]
     });
     
     Crafty.sprite(SHEET_RES-1,IMG.player,
     {
         link_s:[0,0]
        ,link_w:[1,0]
        ,link_n:[2,0]
        ,link_e:[3,0]
     });
     
     
     var open_count = 8; 
    
     Crafty.sprite(SHEET_RES,IMG.opensheet_1,//'opensource16_1.png'
     {
          spr_tree_0 :  [0,0] 
         ,spr_tree_1 :  [1,0]   
         ,spr_tree_2 :  [2,0]   
         ,spr_tree_3 :  [3,0] 
         ,spr_tree_4 :  [4,0] 
         ,spr_tree_5 :  [5,0] 
         ,spr_tree_6 :  [6,0] 
         ,spr_tree_7 :  [7,0] 
         ,spr_tree_8 :  [8,0] 
         ,spr_tree_9 :  [9,0] 
         ,spr_tree_10 : [10,0] 
         ,spr_tree_11 : [11,0] 
         ,spr_tree_12 : [12,0] 
         ,spr_tree_13 : [13,0] 
         ,spr_tree_14 : [14,0] 
         ,spr_tree_15 : [15,0] 

        
         ,spr_grass :  [2,15] 
         ,spr_grass_0 :  [3,5] 
         
         ,spr_bush_0 : [4,15]
         ,spr_bush_1 : [5,15]
         ,spr_bush_2 : [6,15]
         ,spr_bush_3 : [7,15]
         ,spr_bush_4 : [8,15]
         ,spr_bush_5 : [9,15]
         ,spr_bush_6 : [10,14]
         ,spr_bush_7 : [11,14]
         ,spr_bush_8 : [12,14]
         ,spr_bush_9 : [13,14]
         ,spr_bush_10 : [14,14]
         ,spr_bush_11 : [15,14]

         ,spr_fruit_bush_0 : [11,15]
         ,spr_fruit_bush_1 : [12,15]
         ,spr_fruit_bush_2 : [13,15]
         ,spr_fruit_bush_3 : [14,15]
         ,spr_fruit_bush_4 : [15,15]
         ,spr_fruit_bush_5 : [14,13]
         ,spr_fruit_bush_6 : [15,13]
         
         ,spr_leaf_0 : [10,15]
         
         ,spr_wood_pnl_grey :  [4,2]
         ,spr_wood_pnl_brown : [5,2] 
         
         ,spr_wood_flr_brown :  [6,2] 
       //  ,spr_wood_flr_brown :  [6,2] 
        
     });
    //
    
    // Now that our sprites are ready to draw, start the game
     Crafty.scene(SCENES.game);
 
  })
});
   
   
