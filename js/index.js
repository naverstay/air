var video_popup, off_review_popup;

$(function ($) {

    breadcrumbsSpacer = $('.breadcrumbsSpacer');

    $('.tabBlock').tabs({
        active: 0,
        activate: function (e, u) {

            var sld = $(u.newPanel).find('.slick-initialized');

            setTimeout(function () {
                sld.slick('setPosition');
            }, 1);

        }
    });

    $('.reviewSlider').each(function (ind) {
        var sld = $(this);

        sld.slick({
            dots: true,
            infinite: false,
            arrows: true,
            speed: 600,
            zIndex: 1,
            initialSlide: 0,
            slide: '.slide',
            asNavFor: sld.closest('.reviewHolder').find('.reviewAuthorSlider, .reviewNameSlider'),
            prevArrow: sld.closest('.reviewHolder').find('.slider_prev'),
            nextArrow: sld.closest('.reviewHolder').find('.slider_next'),
            appendDots: sld.closest('.reviewHolder').find('.slider_dots'),
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 10
        });
    });

    $('.reviewAuthorSlider').each(function (ind) {
        var sld = $(this);

        sld.slick({
            dots: false,
            infinite: false,
            arrows: false,
            fade: true,
            speed: 600,
            zIndex: 1,
            initialSlide: 0,
            slide: '.slide',
            asNavFor: sld.closest('.reviewHolder').find('.reviewNameSlider, .reviewSlider'),
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 10
        });
    });

    $('.reviewNameSlider').each(function (ind) {
        var sld = $(this);

        sld.slick({
            dots: false,
            infinite: false,
            arrows: false,
            fade: true,
            speed: 600,
            zIndex: 1,
            initialSlide: 0,
            slide: '.slide',
            asNavFor: sld.closest('.reviewHolder').find('.reviewSlider, .reviewAuthorSlider'),
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 10
        });
    });

    initObjectSlider();

    initRangeSlick(wnd.width() <= mq_mob);

    initMap();

    initServicePopup();
    
    video_popup = $('#video_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_2 dialog_g_size_1 ',
        appendTo: '.wrapper',
        width: 800,
        draggable: false,
        collision: "fit flip",
        position: {my: "center center", at: "center center", of: window},
        open: function (event, ui) {
            checkPopupOffset($(this));
            
            toggleFSVideo('banner_video');
            body.addClass('show_overlay');

        },
        close: function (event, ui) {
            toggleFSVideo('banner_video', 'hide');
            body.removeClass('show_overlay');
        }
    });

    $('.playVideo').on ('click', function () {

        video_popup.dialog('open');

        return false;
    });

    off_review_popup = $('#off_review_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden ',
        appendTo: '.wrapper',
        width: 720,
        draggable: true,
        collision: "fit flip",
        position: {my: "center center", at: "center center", of: window},
        open: function (event, ui) {
            checkPopupOffset($(this));
        },
        close: function (event, ui) {

        }
    });

    $('.offReviewBtn').on ('click', function () {

        off_review_popup.dialog('open');

        return false;
    });

});

$(window).on('resize', function () {

}).on('scroll', function () {

    var tabScrollWatch = $('.tabScrollWatch'), scrollTop = doc.scrollTop();

    body.toggleClass('header_overlay', scrollTop >= ($('.overlayMarker').height() - header.height()));

    //body.toggleClass('open_tabs', scrollTop > 0 && scrollTop < (tabScrollWatch.offset().top + tabScrollWatch.height()) - wnd.height() * .75);


});

