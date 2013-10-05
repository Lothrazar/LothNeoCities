
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
