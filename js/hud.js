HUD = {};
HUD.height = 94;
HUD.width = 64*16;//Game.width * Game.u;
HUD.colour = 'rgb(0,0,0)';
HUD.x = 0;
HUD.y = 0;
HUD.color = 'rgb(0,0,0)';
//HUD.width, h: HUD.height , x:0, y:Game.height_px+30 });


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

/*    console.log('TODO ALL my hardcoded hud values from Game.vars');
  //Create a menu/HUD at the bottom of the screen with a button
  var menuBkg = Crafty.e("2D, DOM, Color");
      menuBkg.color('rgb(0,0,0)');
      menuBkg.attr({ w:Game.hud.width, h: Game.hud.height , x:0, y:0 });
  
  //fixes
  var X_SPACING = 9;
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
      
    var lblWeapon= Crafty.e("MenuLabel");
      lblWeapon.text('Gun'); 
      lblWeapon.attr({ x:menuBkg.x+64*X_SPACING, y:menuBkg.y+Y_SPACING });   
  
  this.bind('UpdateHUD', function() 
  {  
  //#TODO find a way to loop these?
    var p = Game.player || Crafty(Player.id);
    
    hudHealth.text(p.health);
    hudAmmo.text(p.ammo);
    hudCoins.text(p.coins);
    
    if(p.gun)
        lblWeapon.text(p.gun.name);
  
  });*/