//based on tutorial at http://buildnewgames.com/introduction-to-crafty/
// TODO: TRACK zombie kill on head-on-collision. or jsu bounche them back.

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function coinflip(){ return Math.floor( Math.random() * 2 ) ===1; }
   
 /**
 * Returns a random number between min and max
 */
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//TODO: allow Parts of config to  be loaded via JSON
var config = 
{
    
    //TODO: restrucutre these into sub objects
    
  GRID_SIZE:16   //size of a tile
  //how many tiles wide and high are we
  ,GAME_WIDTH:64
  ,GAME_HEIGHT:32
 
 // ,ZOMBIE_COIN_SPAWN_CHANCE:0.9 //chance to spawn zombie when a coin is grabbed
 // ,ZOMBIE_START_COUNT:5 //how many zombies start on the field right away (was zero)
 
  
  ,DRAGON_FIRE_CHANCE:0.04 // 1% chance of it breathing fire. if math.random less than this
  ,DRAGON_COINS_NEEDED:10
   
  ,FAIRY_COINS_NEEDED:5 // every this many coins, make new fairy
  
  ,FIRE_DAMAGE:30
  //,FIRE_COLOUR:'rgb(255, 0, 0)'
  ,FIRE_SPAWN_CHANCE:0.01
  
  
  ,TREE_COLOUR:'rgb(20, 125, 40)'
  
   
  //,ROCK_SPAWN_CHANCE:0.04
  
  //,COIN_SPAWN_CHANCE:0.015
 // ,COIN_COLOUR:'rgb(255, 215, 0)'
  
  ,ARROW_SPEED:10
  ,ARROW_DAMAGE:1
  ,ARROW_SIZE:3
  
  ,BACKGROUND_COLOR:'rgb(0, 0, 0)'
  
  
  ,NPC_COLOUR:'rgb(221, 168, 160)'
  
};
var SCENES =
{
  victory: 'Victory'  
  ,game:'Game'
  ,loading:'Loading'
  ,death:'Death'
 // ,inv:"Inventory"
   
};

//events
var EV = 
{
    
    
};
//file extensions
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
  ,dungeon_sheet:'dungeon16'+EXT.IMG
  ,opensheet_1:'opensource16_1'+EXT.IMG
  ,sword_1:'sword16_1'+EXT.IMG
};

  //audio files
var AUDIO =
{ 
    DEFAULT_VOLUME:0.5,
    //pass in id and length of your sound file
   //workaround since either craftyjs or HTML5 support in chrome sucks for audio, doesnt restart the file after playing it once
   PLAY:function(id,vol)
   {
       if(!vol  || vol >= 1 || vol < 0 ) vol = AUDIO.DEFAULT_VOLUME;//volume
  
       
  
       //add it all ove again d
       Crafty.audio.add(id,id + EXT.AUDIO);
 
       //Crafty.audio.stop(id); //this Should work, just stop and replay. but nooOoOOOOoo.. gottta reDoNnLOOoooOAAD
       var repeats = 1;
       
       Crafty.audio.play(id,repeats,vol); 
   }
 
  ,coin: 'coin-01'   
  ,fairy: 'magic-01'    
  ,shoot: 'gun_shoot'  
  ,reload: 'gun_load'  
  ,fire: 'fire'  
  ,leaves: 'leaves'  
  
  
  
}

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
    ammo:50,
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
var Loot = {id:'Loot'};



var Zombie = 
{
   id:"Zombie",
   speed:0.9,
   attack:3,
   health:50,
   colour:'rgb(0, 255, 0)' ,// legacy :: overwritten by sprites 
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

var Tree = {id:'Tree'}; //TODO color or sprite
var Coin = {id:'Coin'};
var Rock = {id:'Rock'};
var Fire = {id:'Fire'};
var Wall = {id:'Wall'};
var Water = {id:'Water'};
var Shallow = {id:'Shallow'}; 
var Lava = {id:'Lava'}; 
var NPC = {id:'NPC'}; 
var Stairway = {id:'Stairway'}; 


//TODO: allow Parts of config to  be loaded via JSON
var config = 
{  
 
  ZOMBIE_COIN_SPAWN_CHANCE:0.9 //chance to spawn zombie when a coin is grabbed
 
  ,DRAGON_FIRE_CHANCE:0.04 // 1% chance of it breathing fire. if math.random less than this
  ,DRAGON_COINS_NEEDED:10
   
  ,FAIRY_COINS_NEEDED:5 // every this many coins, make new fairy
  
  ,FIRE_DAMAGE:1 
     
  ,ARROW_SPEED:10
  ,ARROW_DAMAGE:1
  ,ARROW_SIZE:3
  
  ,BACKGROUND_COLOR:'rgb(255, 255, 255)'
   
  ,NPC_COLOUR:'rgb(221, 168, 160)'
  
};