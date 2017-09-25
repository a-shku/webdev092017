$(document).ready(function(){
    blur();
  })
  $(window).resize(function(){
    blur();
  });
  
  function blur() {
    var imgWidth = $('.blur__back').width(),
        blurSection = $('.blur'),
        blur = $('.blur-form__img'),
        // del =parseInt($('.works-section-3__arrow').css("margin").substr(0,5), "10"),
        posY = blurSection.offset().top - blur.offset().topgu,
        posX = blurSection.offset().left - blur.offset().left;

        
    
    blur.css({
        'background-size': imgWidth + 'px' + ' ' + 'auto',
        'background-position': posX + 'px' + ' ' + posY + 'px'
    })

  }