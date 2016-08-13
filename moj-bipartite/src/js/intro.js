 -function() {
   if($(document).ready()) {
     var positionTop = $("#mainItem").position().top,
       preScroll1 = 0,
       preScroll2 = 0;
     function scrollListener(e) {
       var scrollTop = $(".mdl-layout").scrollTop();
       $("a.introjs-hint").each(function(index){
         var top = $(this).position().top;
         top = preScroll1 < scrollTop ? top - (scrollTop - preScroll1) : top + preScroll1 - scrollTop;
         $(this).css('top', top);
       });

       preScroll1 = scrollTop;
     }
     function scrollListener1(e) {
       var scrollTop = $(".mdl-layout").scrollTop();
       console.log(preScroll2);
       $(".introjs-tooltip").each(function() {
         var top = $(this).position().top;
         console.log(top);
         top = preScroll2 < scrollTop ? top - (scrollTop - preScroll2) : top + preScroll2 - scrollTop;
         $(this).css('top', top);
       });
       preScroll2 = scrollTop;
     }



     window.setTimeout(function(){

       introJs().addHints();

       $("a.introjs-hint").click(function() {
       console.log('click');
       window.setTimeout(function() {
         $(".mdl-layout").scroll(scrollListener1);
       }, 1000);
     })

     $(".mdl-layout").scroll(scrollListener);

     },1000);
   }
 }();
