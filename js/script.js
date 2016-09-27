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
    service_popup,
    service_popup_at,
    object_popup,
    baseM = 0.0714286666666667,
    baseWindowWidth = 1440,
    baseFZ = 1.6,
    maxFZ = 1.6,
    minFZ = .7,
    mq_mob = 1039,
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

    $('.subMenu').on ('click', function () {
        $(this).toggleClass('open_sub_menu');
    });
    
    auth_popup = $('#auth_popup').dialog({
        autoOpen: false,
        modal: false,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden ',
        appendTo: '.header .callback_block',
        width: 400,
        collision: "fit flip",
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
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden ',
        appendTo: '.footer .callback_block',
        width: 400,
        draggable: false,
        collision: "fit flip",
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

function getNeighbors(el) {

    var neighbors = el.nextAll(), curTop = el.offset().top, maxHeight = el.height(), ret = 0;

    for (var i = 0; i < neighbors.length; i++) {
        var nghbr = $(neighbors[i]);

        if (nghbr.offset().top != curTop) break;
        maxHeight = Math.max(maxHeight, nghbr.height());
        ret++;
    }

    el.height(maxHeight);

    for (var k = 0; k < ret; k++) {
        $(neighbors[k]).height(maxHeight);
    }

    return ret;
}

function fitRow() {
    var rows = $('.fitRowHeight');

    rows.each(function () {
        var units = $(this).children().css('height', 'auto');

        setTimeout(function () {
            var i = 0;
            do {
                var obj = $(units[i]), nextEls = getNeighbors(obj);
                i += nextEls + 1;
            }
            while (i < units.length - 1);
        }, 10);

    });
}

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
    //return;
    if (wnd.width() <= mq_mob) {

        setTimeout(function () {
            $('.fitImage').each(function (ind) {
                var newImg = new Image(), img = $(this);

                $(newImg).on ('load', function () {
                    var height = newImg.height;
                    var width = newImg.width;

                    //img.css({'width': width * .75, 'height': height * .75});

                    newImg.remove();
                    //console.log('The image size is ' + width + '*' + height);
                });

                newImg.src = this.src;

                var newFZ = wnd.width() / baseWindowWidth * baseFZ;

                newFZ = Math.max(minFZ, Math.min(newFZ, maxFZ));

                var factor = newFZ / baseFZ;

                factor = Math.max(factor, .7);

                img.css({'width': newImg.width * factor, 'height': newImg.height * factor});

                //console.log(newImg, this.width, this.height);

            });
        }, 20);

    } else {
        $('.fitImage').css({'width': '', 'height': ''});
    }

}

function checkDots() { // точка 

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
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden ',
        appendTo: '.wrapper',
        width: 1240,
        draggable: true,
        //position: {my: "center center", at: "center center", of: window},
        open: function (event, ui) {
            var popup = $(this);
            var sld = $(event.target).find('.popupObjectSlider');
            var sld2 = $(event.target).find('.popupObjectFader');

            if (sld.hasClass('slick-initialized')) {
                setTimeout(function () {
                    sld.slick('setPosition');
                    sld2.slick('setPosition');
                    checkPopupOffset(popup);
                }, 1);
            } else {
                initPopupObjectSlider();
                checkPopupOffset(popup);
            }
         
        },
        close: function (event, ui) {

        }
    });

    $('.objectPopup').each(function (ind) {
        $(this).dialog({
            autoOpen: false,
            modal: true,
            closeOnEscape: true,
            closeText: '',
            dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden ',
            appendTo: '.wrapper',
            width: 1240,
            draggable: true,
            //position: {my: "center center", at: "center center", of: window},
            open: function (event, ui) {
                var popup = $(this);
                var sld = $(event.target).find('.popupObjectSlider');
                var sld2 = $(event.target).find('.popupObjectFader');

                if (sld.hasClass('slick-initialized')) {
                    setTimeout(function () {
                        sld.slick('setPosition');
                        sld2.slick('setPosition');
                        checkPopupOffset(popup);
                    }, 1);
                } else {
                    initPopupObjectSlider();
                    checkPopupOffset(popup);
                }
                
            },
            close: function (event, ui) {

            }
        });
    });

    body.delegate('.objectBtn', 'click', function () {
        var target = $($(this).attr('data-popup'));
        
        if (!$(this).closest('.busy').length) {
            if (target.length) {
                target.dialog('open');
            } else {
                object_popup.dialog('open');
            }
        }

        return false;
    });
}

function checkPopupOffset(popup) {

    var dlg = $(popup).closest('.ui-dialog'),
        dlg_top = dlg.css('top').replace('px', '') * 1,
        limit = Math.max(doc.height() - dlg.outerHeight(), 0);
    
    if (dlg_top > limit) {
        dlg.css('top', 30, 0);
        scroll2(0, 800);
    }
}

function scroll2(pos, speed, callback) {

    $('html,body').animate({'scrollTop': pos}, speed);

    if (typeof(callback) == 'function') {
        callback();
    }
}

function setPopupObjectSlideCounter(sld) {
    var sliderHolder = $(sld.$slider).closest('.popupObjectHolder');

    sliderHolder.find('.popupObjectSlideCounter').text('Фото ' + (sld.currentSlide + 1) + ' из ' + sld.slideCount);

    sliderHolder.find('.popupObjectSlider').slick('slickGoTo', sld.currentSlide);

    sliderHolder
        .find('.popupObjectSlider .slide[data-slick-index="' + sld.currentSlide + '"]').addClass('fader-current').siblings().removeClass('fader-current');
}

function setPopupObjectFader(sld) {
    var sliderHolder = $(sld.$slider).closest('.popupObjectHolder');

    sliderHolder
        .find('.popupObjectSlider .slide[data-slick-index="' + sld.currentSlide + '"]').addClass('fader-current').siblings().removeClass('fader-current');

}

function setPopupObjectSlideFader(sld) {
    var sliderHolder = $(sld.$slider).closest('.popupObjectHolder');

    sliderHolder.find('.popupObjectFader').slick('slickGoTo', sld.currentSlide);
}

function initPopupObjectSlider(callback) {

    body.delegate('.popupObjectSlider .slide', 'click', function () {
        var firedEl = $(this);

        if (!firedEl.closest('.busy').length) {
            firedEl.addClass('fader-current').siblings().removeClass('fader-current');

            firedEl.closest('.popupObjectHolder').find('.popupObjectFader').slick('slickGoTo', firedEl.attr('data-slick-index').replace('-', ''));
        }

    });

    $('.popupObjectSlider').not('.slick-initialized').each(function (ind) {
        var sld = $(this);

        sld
            .on('init', function (e, slick) {
                //setPopupObjectSlideCounter(slick);

                $(slick.$list).find('.slide').first().addClass('fader-current');

            })
            .on('afterChange', function (e, slick) {
                //setPopupObjectSlideCounter(slick);

                $(slick.currentTarget).removeClass('busy');
            })
            .on('beforeChange', function (e, slick) {
                //setPopupObjectFader(slick);
                $(slick.currentTarget).addClass('busy');
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
                initialSlide: 0,
                //centerPadding: '0',
                slide: '.slide:not(.new_line)',
                //appendDots: sld.parent().find('.slider_dots'),
                slidesToShow: 1,
                touchThreshold: 10,
                //asNavFor: sld.prevAll('.popupObjectSlider').first(),
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
                        breakpoint: 760,
                        settings: {
                            //slidesToScroll: 3,
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: mq_mob,
                        settings: {
                            //slidesToScroll: 4,
                            slidesToShow: 4
                        }
                    }
                ]
            });
    });

    $('.popupObjectFader').not('.slick-initialized').each(function (ind) {
        var sld = $(this),
            sld_parent = sld.closest('.popupObjectHolder');

        sld
            .on('init', function (e, slick) {
                setPopupObjectSlideCounter(slick);
            })
            .on('afterChange', function (e, slick) {
                setPopupObjectSlideCounter(slick);
            })
            .on('afterChange', function (e, slick) {
                //setPopupObjectSlideFader(slick);
            })
            .slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                swipe: false,
                dots: false,
                arrows: true,
                prevArrow: sld_parent.find('.slider_prev'),
                nextArrow: sld_parent.find('.slider_next'),
                //asNavFor: sld_parent.find('.popupObjectSlider').first(),
                fade: true
            });
    });


    if (typeof callback == 'function') {
        callback();
    }

}

function initServicePopup() {

    $('.servicePopup').each(function (ind) {
        $(this).dialog({
            autoOpen: false,
            modal: true,
            closeOnEscape: true,
            closeText: '',
            dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden ',
            appendTo: '.wrapper',
            width: 1240,
            draggable: true,
            //collision: "fit flip",
            //position: {my: "center center", at: "center center", of: window},
            open: function (event, ui) {
                checkPopupOffset($(this));
            },
            close: function (event, ui) {

            }
        });
    });
    
    service_popup = $('#service_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden ',
        appendTo: '.wrapper',
        width: 1240,
        draggable: true,
        //collision: "fit flip",
        //position: {my: "center center", at: "center center", of: window},
        open: function (event, ui) {
            checkPopupOffset($(this));
        },
        close: function (event, ui) {

        }
    });

    body.delegate('.serviceBtn', 'click', function () {
        var sld = $(this).closest('.slick-slider'), target = $($(this).attr('data-popup'));
        
        if (sld && sld.length) {
            if (!sld.hasClass('busy')) {
                if (target.length) {
                    target.dialog('open');
                } else {
                    service_popup.dialog('open');
                }                
            }
        } else {
            if (target.length) {
                target.dialog('open');
            } else {
                service_popup.dialog('open');
            }
        }
        return false;
    });

    service_popup_at = $('#service_popup_at').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_close_butt_mod_1 dialog_g_size_2 mob_hidden',
        appendTo: '.wrapper',
        width: 1240,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            var $this = $(this);

            var sld = $(ui).find('.slick-initialized');

            $('#service_popup_at .popupObjectHolder').show();

            setTimeout(function () {
                sld.each(function () {
                    $(this).slick('setPosition');
                });
            }, 1);

            initPopupObjectSlider(function () {
                checkPopupOffset($this);
            });

        },
        close: function (event, ui) {

        }
    });

    body.delegate('.serviceBtnAT', 'click', function () {
        var sld = $(this).closest('.slick-slider');

        $('#service_popup_at .popupObjectHolder').hide();

        if (sld && sld.length) {
            if (!sld.hasClass('busy')) {
                service_popup_at.dialog('open');
            }
        } else {
            service_popup_at.dialog('open');
        }

        return false;
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
                initialSlide: 0,
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
                        breakpoint: mq_mob,
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

        checkDots();

        fitRow();
        
        recalcFZ();

        mobFitImages();
        
        setTimeout(function () {

            svg_fallback();
            $('.preloader').addClass('loaded');

            setTimeout(function () {
                $('.preloader').hide();
            }, 1200);
        }, 1500);

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
                            //{
                            //    breakpoint: 600,
                            //    settings: {
                            //        slidesToScroll: 2,
                            //        slidesToShow: 2
                            //    }
                            //},
                            {
                                breakpoint: 760,
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

        rangeSlider.each(function (ind) {
            var sld = $(this);

            if (sld.hasClass('slick-initialized')) {
                sld.slick('unslick');
            }
        });
    }

}

function recalcFZ() {
    var newFZ = (wnd.width() * baseFZ ) / baseWindowWidth;

    newFZ = Math.max(minFZ, Math.min(newFZ, maxFZ));
    
    body.css('font-size', (newFZ > maxFZ ? maxFZ : newFZ) + 'em');
    $('.service_scroll li' +
            //',.slick-dots li' +
        ', .slide' +
        ''
    ).css('font-size', Math.min(16, 10 * (newFZ > maxFZ ? maxFZ : newFZ)) + 'px');
}

function initRangeSlick(state) {

    initRangeSlider(state);

    $(window).on('resize', function () {

        clearTimeout(resizeTimerHndl);

        resizeTimerHndl = setTimeout(function () {
            initRangeSlider(wnd.width() <= mq_mob);
        }, 100);

    });
}


$(window).on('load', function () {

    //setTimeout(function () {
    //    $('.preloader').addClass('loaded');
    //
    //    setTimeout(function () {
    //        $('.preloader').hide();
    //    }, 1100);
    //
    //}, 5000);

    //checkDots();
    //
    //recalcFZ();
    //
    //mobFitImages();

}).on('resize', function () {

    checkDots();

    fitRow();

    recalcFZ();

    mobFitImages();

    $(".ui-dialog-content.popup_v2, .ui-dialog-content.popup").dialog("option", "position", {
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

