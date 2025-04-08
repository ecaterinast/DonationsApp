/*
    Custom JS
*/
(function ($) {
    "use strict";
    var fullHeight = function () {
        $(".js-fullheight").css("height", $(window).height());
        $(window).resize(function () {
            $(".js-fullheight").css("height", $(window).height());
        });
    };
    fullHeight();
    $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
    });

    $("#sidebar ul li a").on("click", function(){
        $("#sidebar ul li").removeClass('active');
        $(this).parent().addClass('active');
    })
})(jQuery);
