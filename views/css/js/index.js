$(document).ready(function () {



    $(window).scroll(function () {
        if ($(document).scrollTop() > 50) {
            $('nav').addClass('shrink');
        } else {
            $('nav').removeClass('shrink');
        }
    });
    
    

    $('.navbar-collapse a:not(.dropdown-toggle)').click(function(){
    $(".navbar-collapse").collapse('hide');
});
    

//    $(window).scroll(function () {
//        var scrolled = $(window).scrollTop();
//        //console.log($('.bg').offset());
//        $('.intro2').animate({
//            top:-scrolled * 5 + 'px'
//        }, 5);
//    });


    var divs = document.getElementsByClassName('left');
    var count = divs.length;
    //console.log(count);
    $(window).scroll(function () {



        var scrolled = $(window).scrollTop();
        if (scrolled>=1400) {
            i = 0;
            setTimeout(function () {
                $(divs[i]).animate({left:'0px'},"slow");
    
                // as an example the 
                //fade should take .4 second
                i++;
            }, 300)
//            console.log('0.5');
//            $(divs).animate({
//               opacity:'0.5' 
//            });
//            
//            
//        }
//        if(scrolled>1500){
//            console.log('1');
//            $(divs).animate({
//               opacity:'1' 
//            });
            //$(divs).animate({left:'0px'},"slow");
      }
    });
    
    initMap();
    function initMap() {
        var uluru = {lat:30.6747, lng: 76.8634};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }
    
    $("a[href^='#']").on("click",function(e){
        $("html, body").animate({
    scrollTop: $($(this).attr("href")).offset().top
  }, 1000);

    
    
    if($(window.location.hash).length > 1){
        console.log(window.location.hash);
        $('html, body').animate({ scrollTop: $(window.location.hash).offset().top}, 1000);
}
});

});
