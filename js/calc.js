$(function ($) {

    initSelect();

    $('.autoSize').autosize({
        append: ''
    });

    $('.orderAddBtn').on ('click', function () {
        var orderBlock = $('.orderBlock:last');

        orderBlock.after(orderBlock.clone());

        initSelect();
        
        return false;
    });

    $('.orderObjectRMm').on ('click', function () {
        $(this).closest('.order_object').remove();
        return false;
    });
    
});

function initSelect() {
    
    $('.select2-container').remove();

    $('.select2').each(function (ind) {
        var $slct = $(this), cls = $slct.attr('data-select-class') || '';

        $slct.select2({
            width: '100%',
            allowClear: false,
            dropdownParent: $slct.parent(),
            minimumResultsForSearch: 5,
            containerCssClass: "select_c2",
            adaptDropdownCssClass: function (c) {
                return cls;
            }
        });
    });
}
