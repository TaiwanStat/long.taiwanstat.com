 -function() {
   if($(document).ready()) {
     function addHint(id, hint) {
      var hintDom = '<a class="introjs-hint">'+
                    '<div class="introjs-hint-dot" />'+
                    '<div class="introjs-hint-pulse" />'+
                    '</a>';
      var tooltipDom =
        '<div class="introjs-tooltip" style="display:none; top:30px">'+
          '<div class="introjs-arrow top" style="display: inherit;"/>'+
          '<div class="introjs-tooltiptext">'+
            '<p>'+
              hint +
            '</p>'+
            '<a class="introjs-button">'+
              'Got it'+
            '</a>'+
          '</div>'+
        '</div>';

      var position = $("#" + id).position();
      $("#" + id).prepend(hintDom);
      $("#" + id).children('.introjs-hint')
        .append(tooltipDom);
      $("#" + id).children(".introjs-hint").on('click', function() {
        var position = $(this).position();
        $(this).children(".introjs-tooltip")
          .toggle('display');
      })

     }
     window.setTimeout(function() {
       var hint1 = '在這裡可以選擇想比對的類別唷，試試看吧！';
       var hint2 = '將游標移至特定區塊上，會單獨顯示該項目中的比例唷，動動滑鼠玩玩看！';
     addHint("forHint", hint1);
     addHint("vis", hint2);
     },1000);
   }
 }();
