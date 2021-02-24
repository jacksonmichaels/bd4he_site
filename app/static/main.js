$(document).ready(function() {
    scroll_to = window.location.hash
    parent.location.hash = ''


    $(".comment").shorten({"showChars" : 700});

    if (scroll_to != "") {
        $('html, body').animate({
            scrollTop:$(scroll_to).offset().top-66
        }, 1000);
    }
   
//    $("#sec-2").click(function() {
//         $('html, body') .animate({
//             scrollTop:        $("#two").offset().top-112
//         }, 1000);
//      return false;
//     });
   
//    $("#sec-3").click(function() {
//         $(' html,body') .animate({
//             scrollTop:        $("#three").offset().top-112
//         }, 1000);
//      return false;
//     });
   
//    $("#sec-4").click(function() {
//      $(this).addClass("active");
//         $('html,body ') .animate({
//             scrollTop:        $("#four").offset().top-112
//         }, 1000);
//      return false;
//     });

});
