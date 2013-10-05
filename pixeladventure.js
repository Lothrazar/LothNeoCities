
 

Crafty.scene(SCENES.game, function() 
{
 
  // A 2D array to keep track of all occupied tiles
  /*
   var map = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) 
  {
    map[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) 
    {
      map[i][y] = false;
    }
  }
 */
  //Crafty.e actually returns a reference to that entity!
  this.player = Crafty.e(Player.id).at(Player.start_x, Player.start_x); 


//Crafty.viewport.follow(this.player);
       // this.camera = Crafty.e("Camera").camera(this.player);
 this.dragon = Crafty.e(Dragon.id).at(25, 25);
  
   
   //shortcuts so my map looks like a grid
   var R=Rock.id, W=Wall.id, C=Coin.id, F=Fire.id,Z=Zombie.id,T=Water.id;
   
   var map = 
   [
     [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W] // 0
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W] // 1  
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,W,W,W,W,W,W,W,Z,W,W,W,W,W,W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,W,W,W,W,W,W,W,W,W,W,W,W] // 2
    ,[W,W,W,W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,Z,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,W,W,W,W,W,Z,W,W,W,W,W,W,W,W] // 3
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 4
    ,[W,0,0,0,0,0,0,0,0,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 5
    ,[W,W,W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,W] // 6
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 7
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,T,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,C,0,0,0,0,0,0,0,W] // 8
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,T,T,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 9
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,T,0,0,0,T,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 10
    ,[W,0,0,Z,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 11
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 12
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,Z,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 13
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 14
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 15
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 16
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 17
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 18
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,C,0,0,0,0,0,0,0,0,0,0,0,0,W] // 19
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 20
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W] // 21
    ,[W,W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,W,W] // 22
    ,[W,W,W,W,Z,W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,W,W,W,W] // 23
    ,[W,W,W,W,W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,W,W,W,W] // 24
    ,[W,W,W,W,W,W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W,0,0,W,W,W,W,W] // 25
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W] // 26
    ,[W,0,0,0,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,Z,0,0,0,0,0,0,0,0,W] // 27
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W] // 28
    ,[W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,W] // 29
    ,[W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W] // 30
    ,[W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W] // 30
    
   ];
 
    
    
 
  var o,id;
  
  for (var x = 0; x < Game.map_grid.width; x++)   for (var y = 0; y < Game.map_grid.height; y++) 
  {   
     // Crafty.e('Darkness').at(x,y);
     
     try{
      id = map[y][x] ; 
      
      if( id ) //checks for false/zero
      { 
         o = Crafty.e( id ).at( x , y );

        //o.attr({alpha:1});
 
      }
      
      
      }catch(e){console.log(e,x,y);}
  }
  
   
  //Create a menu/HUD at the bottom of the screen with a button
  var menuBkg = Crafty.e("2D, DOM, Color");
      menuBkg.color('rgb(0,0,0)');
      menuBkg.attr({ w:Game.hud.width, h: Game.hud.height , x:0-20, y:Game.height() - Game.hud.height});
  
  //fixes
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
         Crafty.e(Zombie.id).at(50,10);
      }  
       
      var coins_current = Crafty(Player.id).coins;
      
      if(coins_current > 0 && coins_current % 5 == 0)
      { 
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
     assets.push(IMG.dungeon_sheet);
	 //audio files
	 assets.push(AUDIO.coin);
	 assets.push(AUDIO.shoot);
     assets.push(AUDIO.fire);
 
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
     
      
    Crafty.sprite(16, IMG.dungeon_sheet, 
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
         
     } );
    
    
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
    
    min_y:0,
    min_x:0,
    
    max_x:config.GAME_WIDTH-1,
    max_y:config.GAME_HEIGHT-1,
    
    
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