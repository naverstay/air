var resizeTimerHndlA, licence_popup;

$(function ($) {

    licence_popup = $('#licence_popup').dialog({
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

    $('.licenceBtn').on ('click', function () {

        licence_popup.dialog('open');

        return false;
    });

    initFeaturesSlider(wnd.width() <= mq_mob);


});

function initFeaturesSlider(state) {
    var featuresSlider = $('.featuresSlider');

    if (state) {

        featuresSlider.each(function (ind) {
            var sld = $(this);

            if (!sld.hasClass('slick-initialized')) {
                sld.slick({
                    dots: true,
                    mobileFirst: true,
                    centerMode: true,
                    infinite: false,
                    arrows: false,
                    //variableWidth: true,
                    speed: 600,
                    zIndex: 1,
                    initialSlide: 1,
                    centerPadding: '30px',
                    slide: '.slide:not(.new_line)',
                    appendDots: sld.parent().find('.slider_dots'),
                    slidesToShow: 1,
                    touchThreshold: 10,
                    responsive: [
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToScroll: 1,
                                slidesToShow: 1
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToScroll: 2,
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 840,
                            settings: {
                                slidesToScroll: 3,
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: mq_mob,
                            settings: {
                                centerPadding: '50px',
                                slidesToScroll: 4,
                                slidesToShow: 4
                            }
                        }
                    ]
                });
            }

        });

    } else {

        featuresSlider.each(function (ind) {
            var sld = $(this);

            if (sld.hasClass('slick-initialized')) {
                sld.slick('unslick');
            }
        });
    }

}

$(window).on('resize', function () {

    clearTimeout(resizeTimerHndlA);

    resizeTimerHndlA = setTimeout(function () {
        initFeaturesSlider(wnd.width() <= mq_mob);
    }, 100);

}).on('scroll', function () {


});

