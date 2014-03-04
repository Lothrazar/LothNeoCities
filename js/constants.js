//based on tutorial at http://buildnewgames.com/introduction-to-crafty/
// TODO: TRACK zombie kill on head-on-collision. or jsu bounche them back.

function getRandomInt (min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function coinflip(){ return Math.floor( Math.random() * 2 ) ===1; }
   
 /**
 * Returns a random number between min and max
 */
function getRandomArbitary (min, max) 
{
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
 
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
  
 var IMG_ROOT = 'assets/sprites/';
var IMG =
{
    
  coin: IMG_ROOT + 'goldCoin'+EXT.IMG
  ,rock:IMG_ROOT + 'rock0'+EXT.IMG
  ,flame:IMG_ROOT + 'flame'+EXT.IMG
  ,zombie:IMG_ROOT + 'zombie'+EXT.IMG
  ,rocks:IMG_ROOT + 'rock_sprites'+EXT.IMG
  ,dungeon_sheet:IMG_ROOT + 'dungeon16'+EXT.IMG
  ,opensheet_1:IMG_ROOT + 'opensource16_1'+EXT.IMG
  ,sword_1:IMG_ROOT + 'sword16_1'+EXT.IMG
  ,purple:IMG_ROOT + 'purple16'+EXT.IMG
  ,player:IMG_ROOT + 'player-sprites'+EXT.IMG
};
 

  //audio files
var AUDIO_ROOT ='assets/audio/';
  
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
 
  
  ,coin: AUDIO_ROOT +  'coin-01'   
  ,fairy:AUDIO_ROOT +  'magic-01'    
  ,shoot: AUDIO_ROOT + 'gun_shoot'  
  ,reload: AUDIO_ROOT + 'gun_load'  
  ,fire: AUDIO_ROOT + 'fire'  
  ,leaves: AUDIO_ROOT + 'leaves'   
}

 

var Zombie = 
{
   id:"Zombie",
   speed:1,
   attack:9,
   health:1 
 
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

var Arrow =
{
   id:"Arrow"
  ,speed:7
  ,attack:1
  ,size:3
  
}

var Tree = {id:'Tree'}; //TODO color or sprite
var Coin = {id:'Coin'};
var Rock = {id:'Rock'}; 
var Wall = {id:'Wall'};
var Water = {id:'Water'};
var Shallow = {id:'Shallow'}; 
var Lava = {id:'Lava'}; 
var NPC = {id:'NPC'}; 
var Stairway = {id:'Stairway'}; 
 
 
 
var Fire = {id:'Fire',attack:3};
var Loot = {id:'Loot'};
var Grass = {id:'Grass'};
var WoodFloor = {id:'WoodFloor'};
 