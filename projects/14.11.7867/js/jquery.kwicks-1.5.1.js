(function($){
  $.fn.kwicks = function(options) {
    var defaults = {
      isVertical: false,
      sticky: false,
      defaultKwick: 0,
      event: 'mouseover',
      spacing: 0,
      duration: 500
    };
    var o = $.extend(defaults, options);
    var WoH = (o.isVertical ? 'height' : 'width');
    var LoT = (o.isVertical ? 'top' : 'left'); 
    
    return this.each(function() {
      container = $(this);
      var kwicks = container.children('li');
      var normWoH = kwicks.eq(0).css(WoH).replace(/px/,''); 
      if(!o.max) {
        o.max = (normWoH * kwicks.size()) - (o.min * (kwicks.size() - 1));
      } else {
        o.min = ((normWoH * kwicks.size()) - o.max) / (kwicks.size() - 1);
      }
      if(o.isVertical) {
        container.css({
          width : kwicks.eq(0).css('width'),
          height : (normWoH * kwicks.size()) + (o.spacing * (kwicks.size() - 1)) + 'px'
        });       
      } else {
        container.css({
          width : (normWoH * kwicks.size()) + (o.spacing * (kwicks.size() - 1)) + 'px',
          height : kwicks.eq(0).css('height')
        });       
      }
      var preCalcLoTs = []; 
      for(i = 0; i < kwicks.size(); i++) {
        preCalcLoTs[i] = [];
        
        for(j = 1; j < kwicks.size() - 1; j++) {
          if(i == j) {
            preCalcLoTs[i][j] = o.isVertical ? j * o.min + (j * o.spacing) : j * o.min + (j * o.spacing);
          } else {
            preCalcLoTs[i][j] = (j <= i ? (j * o.min) : (j-1) * o.min + o.max) + (j * o.spacing);
          }
        }
      }
      
      kwicks.each(function(i) {
        var kwick = $(this);

        if(i === 0) {
          kwick.css(LoT, '0px');
        } 

        else if(i == kwicks.size() - 1) {
          kwick.css(o.isVertical ? 'bottom' : 'right', '0px');
        }

        else {
          if(o.sticky) {
            kwick.css(LoT, preCalcLoTs[o.defaultKwick][i]);
          } else {
            kwick.css(LoT, (i * normWoH) + (i * o.spacing));
          }
        }

        if(o.sticky) {
          if(o.defaultKwick == i) {
            kwick.css(WoH, o.max + 'px');
            kwick.addClass('active');
          } else {
            kwick.css(WoH, o.min + 'px');
          }
        }
        kwick.css({
          margin: 0,
          position: 'absolute'
        });
        
        kwick.bind(o.event, function() {
         
          var prevWoHs = []; 
          var prevLoTs = []; 
          kwicks.stop().removeClass('active');
          for(j = 0; j < kwicks.size(); j++) {
            prevWoHs[j] = kwicks.eq(j).css(WoH).replace(/px/, '');
            prevLoTs[j] = kwicks.eq(j).css(LoT).replace(/px/, '');
          }
          var aniObj = {};
          aniObj[WoH] = o.max;
          var maxDif = o.max - prevWoHs[i];
          var prevWoHsMaxDifRatio = prevWoHs[i]/maxDif;
          kwick.addClass('active').animate(aniObj, {
            step: function(now) {
       
              var percentage = maxDif != 0 ? now/maxDif - prevWoHsMaxDifRatio : 1;
             
              kwicks.each(function(j) {
                if(j != i) {
                  kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage) + 'px');
                }
                if(j > 0 && j < kwicks.size() - 1) {
                  kwicks.eq(j).css(LoT, prevLoTs[j] - ((prevLoTs[j] - preCalcLoTs[i][j]) * percentage) + 'px');
                }
              });
            },
            duration: o.duration,
            easing: o.easing
          });
        });
      });
      if(!o.sticky) {
        container.bind("mouseleave", function() {
          var prevWoHs = [];
          var prevLoTs = [];
          kwicks.removeClass('active').stop();
          for(i = 0; i < kwicks.size(); i++) {
            prevWoHs[i] = kwicks.eq(i).css(WoH).replace(/px/, '');
            prevLoTs[i] = kwicks.eq(i).css(LoT).replace(/px/, '');
          }
          var aniObj = {};
          aniObj[WoH] = normWoH;
          var normDif = normWoH - prevWoHs[0];
          kwicks.eq(0).animate(aniObj, {
            step: function(now) {
              var percentage = normDif != 0 ? (now - prevWoHs[0])/normDif : 1;
              for(i = 1; i < kwicks.size(); i++) {
                kwicks.eq(i).css(WoH, prevWoHs[i] - ((prevWoHs[i] - normWoH) * percentage) + 'px');
                if(i < kwicks.size() - 1) {
                  kwicks.eq(i).css(LoT, prevLoTs[i] - ((prevLoTs[i] - ((i * normWoH) + (i * o.spacing))) * percentage) + 'px');
                }
              }
            },
            duration: o.duration,
            easing: o.easing
          });
        });
      }
    });
  };
})(jQuery);