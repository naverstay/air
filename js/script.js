var wnd, resizeTimerHndl,
    myMap,
    mapMarkers = [],
    html,
    body,
    header,
    breadcrumbsSpacer,
    popupObjectSlider,
    doc,
    auth_popup,
    callback_popup,
    object_popup,
    mq_mob = 1040,
    baseM = 0.0714286666666667,
    baseWindowWidth = 1000,
    baseFZ = 1.4,
    maxFZ = 1.5,
    map_pins = [
        [59.958597, 30.403975],  // SPB
        [55.776365, 37.571426] // Moscow
    ];

$(function ($) {

    wnd = $(window);
    doc = $(document);
    html = $('html');
    body = $('body');
    header = $('.header');

    breadcrumbsSpacer = $('.breadcrumbsSpacer');

    var lang_switcher = $("#lang_switcher");

    lang_switcher // выбор языка
        .iconselectmenu({
            width: 'auto',
            appendTo: lang_switcher.parent(),
            change: function (event, data) {
                var firedEl = $(event.currentTarget);

                firedEl.addClass('selected').siblings().removeClass('selected');

                setLangIcon(data.item.element[0]);
            }
        })
        .find('option:selected').each(function () {
        setLangIcon(this);
    });

    $('.openMenu').on ('click', function () { // открытие меню
        body.toggleClass('menu_open');
        return false;
    });

    auth_popup = $('#auth_popup').dialog({
        autoOpen: false,
        modal: false,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 ',
        appendTo: '.header .callback_block',
        width: 400,
        draggable: false,
        open: function (event, ui) {

        },
        close: function (event, ui) {

        }
    });

    $('.callbackBtn').on ('click', function () {
        all_dialog_close_gl();
        auth_popup.dialog('open');
        return false;
    });


    callback_popup = $('#callback_popup').dialog({
        autoOpen: false,
        modal: false,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 ',
        appendTo: '.footer .callback_block',
        width: 400,
        draggable: false,
        open: function (event, ui) {

        },
        close: function (event, ui) {

        }
    });

    $('.footerCallbackBtn').on ('click', function () {
        all_dialog_close_gl();
        callback_popup.dialog('open');
        return false;
    });

    objectPopup();

    all_dialog_close(); // закрытие всех диалогов

});

function svg_fallback() { // замена СВГ на ПНГ 

    if (html.hasClass('ie8')) {
        $('img[src$=".svg"]').each(function (ind) {
            $(this).attr('src', $(this).attr('src').replace(/\.svg$/, '.png'));
        });
    }

}

function setLangIcon(option) { // установка иконки в языковое меню
    var opt = $(option),
        select = opt.closest('select'),
        icon = select.next('.ui-selectmenu-button').find('.ui-icon');

    icon.html('<img src="' + opt.attr("data-icon") + '" >');
}

$.widget("custom.iconselectmenu", $.ui.selectmenu, { // кастомный дропдайн с иконками
    _renderItem: function (ul, item) {
        var li = $("<li>"),
            wrapper = $("<div class='lang_item'>");

        if (item.disabled) {
            li.addClass("ui-state-disabled");
        }

        if (item.element[0].selected) {
            li.addClass("selected");
        }

        $("<img>", {
            src: item.element.attr("data-icon"),
            "class": "ui-icon " + item.element.attr("data-class")
        })
            .appendTo(wrapper);

        $("<span class='lang_label'>")
            .text(item.label)
            .appendTo(wrapper);

        return li.append(wrapper).appendTo(ul);
    }

});

function initMap() {

    if ($('#ya_map').length) {

        $('.mapBtn').on ('click', function () { // смена карты

            if (wnd.width() >= mq_mob) {
                var firedEl = $(this);

                firedEl.addClass('office_current').siblings().removeClass('office_current');

                $('.mapBtnMob').removeClass('office_current').eq(firedEl.index()).addClass('office_current');

                setMapCenter(map_pins[firedEl.index()]);
            }

            return false;
        });

        $('.mapBtnMob').on ('click', function () { // смена карты для мобил

            if (wnd.width() < mq_mob) {
                var firedEl = $(this);

                firedEl.addClass('office_current').siblings().removeClass('office_current');

                $('.mapBtn').removeClass('office_current').eq(firedEl.index()).addClass('office_current');

                setMapCenter(map_pins[firedEl.index()]);
            }

            return false;
        });

        function init() {

            myMap = new ymaps.Map("ya_map", {
                center: [59.958597 - .02, 30.403975 - .1],
                zoom: 12,
                controls: []
            }, {
                //searchControlProvider: 'yandex#search'
            });

            myMap.behaviors.disable('scrollZoom');

            setPins();

        }

        function setMapCenter(lat_lng) {
            if (myMap != void 0) {
                myMap.setCenter([lat_lng[0], lat_lng[1] - (wnd.width() >= mq_mob ? .1 : 0)], 12);
            }
        }

        function setPins() {

            for (var i = 0; i < map_pins.length; i++) {
                var pin = map_pins[i];


                var myPlacemark = new ymaps.Placemark(pin, {
                    //hintContent: 'Собственный значок метки',
                    //balloonContent: 'Это красивая метка'
                }, {
                    // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: 'i/pin.png',
                    // Размеры метки.
                    iconImageSize: [79, 92],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    iconImageOffset: [-3, -92]
                });

                mapMarkers.push(myPlacemark);

                myMap.geoObjects.add(myPlacemark);

            }

            setMapCenter(map_pins[0]);
        }

        ymaps.ready(init);

        $(window).on('resize', function () {
            setMapCenter(map_pins[$('.mapBtn.office_current').index()]);
        });
    }
}

function ieCheck() { // проверка ИЕ
    html = $('html');

    var myNav = navigator.userAgent.toLowerCase();

    if ((myNav.indexOf('msie') != -1) || !!myNav.match(/trident.*rv\:11\./)) {
        html.addClass('ie');

        if (/msie 8/ig.test(myNav)) {
            html.addClass('ie8');
        }

    } else if (myNav.indexOf('safari') != -1 && myNav.indexOf('chrome') == -1) {
        html.addClass('safari');
    } else if (myNav.indexOf('firefox') != -1) {
        html.addClass('firefox');
    }

    if ((myNav.indexOf('windows') != -1)) {
        html.addClass('windows');
    }

}

function mobFitImages() {

    if (wnd.width() <= mq_mob) {

        setTimeout(function () {
            $('.fitImage').each(function (ind) {
                var newImg = new Image(), img = $(this);

                $(newImg).on ('click', function () {
                    var height = newImg.height;
                    var width = newImg.width;

                    img.css({'width': width * .75, 'height': height * .75});

                    newImg.remove();
                    //console.log('The image size is ' + width + '*' + height);
                });

                newImg.src = this.src;

                img.css({'width': newImg.width * .75, 'height': newImg.height * .75});

                //console.log(newImg, this.width, this.height);

            });
        }, 50);

    } else {
        $('.fitImage').css({'width': '', 'height': ''});
    }

}

function checkDots() {

    var dotWatcher = $('.dotWatcher'), li = dotWatcher.find('li').removeClass('no_dot');

    for (var i = 0; i < li.length; i++) {
        var obj = $(li[i]);

        if (dotWatcher.offset().top != obj.offset().top) {
            obj.addClass('no_dot');
            break;
        }
    }
}

function objectPopup() {

    object_popup = $('#object_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 ',
        appendTo: '.wrapper',
        width: 1240,
        draggable: true,
        open: function (event, ui) {

            var sld = $(event.target).find('.popupObjectSlider');

            if (sld.hasClass('slick-initialized')) {
                setTimeout(function () {
                    sld.slick('setPosition');
                }, 1);
            } else {
                initPopupObjectSlider();
            }

        },
        close: function (event, ui) {

        }
    });

    body.delegate('.objectBtn', 'click', function () {
        if (!$(this).closest('.busy').length) {
            object_popup.dialog('open');
        }

        return false;
    });

}

function setPopupObjectSlideCounter(sld) {
    var sliderHolder = $(sld.$slider).closest('.popupObjectHolder');

    sliderHolder.find('.popupObjectSlideCounter').text('Фото ' + sld.currentSlide + ' из ' + sld.slideCount);
}

function initPopupObjectSlider() {

    $('.popupObjectSlider').each(function (ind) {
        $(this)
            .on('init', function (e, slick) {
                setPopupObjectSlideCounter(slick);

            })
            .on('afterChange', function (e, slick) {
                setPopupObjectSlideCounter(slick);
            })
            .slick({
                dots: false,
                mobileFirst: true,
                centerMode: false,
                infinite: false,
                arrows: false,
                //variableWidth: true,
                speed: 600,
                zIndex: 1,
                initialSlide: 1,
                //centerPadding: '56px',
                slide: '.slide:not(.new_line)',
                //appendDots: sld.parent().find('.slider_dots'),
                slidesToShow: 1,
                touchThreshold: 10,
                responsive: [
                    {
                        breakpoint: 480,
                        settings: {
                            //slidesToScroll: 1,
                            slidesToShow: 1
                        }
                    },
                    //{
                    //    breakpoint: 600,
                    //    settings: {
                    //        //slidesToScroll: 2,
                    //        slidesToShow: 2
                    //    }
                    //},
                    {
                        breakpoint: 840,
                        settings: {
                            //slidesToScroll: 3,
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 1040,
                        settings: {
                            //slidesToScroll: 4,
                            slidesToShow: 4
                        }
                    }
                ]
            });
    });

}

function initObjectSlider() {

    $('.objectSlider').each(function (ind) {
        var sld = $(this);

        sld
            .on('beforeChange', function (slick, e, r) {

                $(slick.currentTarget).addClass('busy');

            })
            .on('afterChange', function (slick, e, r) {

                $(slick.currentTarget).removeClass('busy');

            })
            .slick({
                dots: true,
                mobileFirst: true,
                centerMode: true,
                infinite: false,
                arrows: true,
                speed: 600,
                zIndex: 1,
                initialSlide: 2,
                centerPadding: '50px',
                slide: '.slide',
                prevArrow: sld.parent().find('.slider_prev'),
                nextArrow: sld.parent().find('.slider_next'),
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
                            slidesToScroll: 3,
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 1040,
                        settings: {
                            centerMode: false,
                            slidesToScroll: 3,
                            slidesToShow: 3
                        }
                    }
                ]
            });

    });

    objectPopup();
}

window.onload = new function () {  // дубль функции $(window).on('load'... для ИЕ 

    setTimeout(function () {
        ieCheck();

        $('.preloader').addClass('loaded');

        setTimeout(function () {
            svg_fallback();
            $('.preloader').hide();
        }, 1200);

    }, 500);
};

function initRangeSlider(state) {
    var rangeSlider = $('.rangeSlider');

    if (state) {

        rangeSlider
            .on('beforeChange', function (slick, e, r) {

                $(slick.currentTarget).addClass('busy');

            })
            .on('afterChange', function (slick, e, r) {

                $(slick.currentTarget).removeClass('busy');

            })
            .each(function (ind) {
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
                        centerPadding: '56px',
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
                                breakpoint: 1040,
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

        rangeSlider.each(function (ind) {
            var sld = $(this);

            if (sld.hasClass('slick-initialized')) {
                sld.slick('unslick');
            }
        });
    }

}

function recalcFZ() {
    var newFZ = wnd.width() / baseWindowWidth * baseFZ;

    body.css('font-size', (newFZ > maxFZ ? maxFZ : newFZ) + 'em');
}

function initRangeSlick(state) {

    initRangeSlider(state);

    $(window).on('resize', function () {

        clearTimeout(resizeTimerHndl);

        resizeTimerHndl = setTimeout(function () {
            initRangeSlider(wnd.width() <= 1040);
        }, 100);

    });
}


$(window).on('load', function () {

    $('.preloader').addClass('loaded');

    setTimeout(function () {
        $('.preloader').hide();
    }, 1200);

    checkDots();

    recalcFZ();

    //mobFitImages();

}).on('resize', function () {

    checkDots();

    recalcFZ();

    $(".ui-dialog-content.popup_v2").dialog("option", "position", {
        my: "center center",
        at: "center center",
        of: window
    });

}).on('scroll', function () {

    var tabScrollWatch = $('.tabScrollWatch'), scrollTop = doc.scrollTop();

    if (breadcrumbsSpacer.length) {
        body.toggleClass('breadcrumbs_fixed', breadcrumbsSpacer.offset().top < scrollTop + header.height());
    }

    body.toggleClass('header_overlay', scrollTop >= ($('.overlayMarker').height() - header.height()));

    //body.toggleClass('open_tabs', scrollTop > 0 && scrollTop < (tabScrollWatch.offset().top + tabScrollWatch.height()) - wnd.height() * .75);


});

function all_dialog_close() {
    body.on('click', '.ui-widget-overlay', all_dialog_close_gl);
}

function all_dialog_close_gl() {
    $(".ui-dialog-content").each(function () {
        var $this = $(this);
        if (!$this.parent().hasClass('always_open')) {
            $this.dialog("close");
        }
    });
}

function toggleFSVideo(id, state) {
    // if state == 'hide', hide. Else: show video
    var div = document.getElementById(id);
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    var func = state == 'hide' ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
}

