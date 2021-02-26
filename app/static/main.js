$(document).ready(function() {
    scroll_to = window.location.hash
    parent.location.hash = ''


    if ($(window).width() <=  990) {
        $(".comment").shorten({"showChars" : 70});
        $(".navbar-brand").html('BD4HE')
    } else { 
        $(".comment").shorten({"showChars" : 700});
        $(".navbar-brand").html('Big Data for Health Equity (BD4HE) Research Collaborative')
    }

    if (scroll_to != "") {
        $('html, body').animate({
            scrollTop:$(scroll_to).offset().top-66
        }, 1000);
    }
});

$( window ).resize(function() {
    if ($(window).width() <=  990) {
        $(".comment").shorten({"showChars" : 70});
        $(".navbar-brand").html('BD4HE')
    } else { 
        $(".comment").shorten({"showChars" : 700});
        $(".navbar-brand").html('Big Data for Health Equity (BD4HE) Research Collaborative')
    }
});