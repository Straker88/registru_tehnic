$(document).ready(function () {
    "use strict";

    $('ul.navbar-nav > li').click(function (e) {
        $('ul.navbar-nav > li').removeClass('active');
        $(this).addClass('active');
    });
});
