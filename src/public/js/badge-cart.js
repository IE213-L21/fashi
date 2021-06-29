$(document).ready(function () {
    let numberProductsInCart = $('.cart-icon > a > span').text();
    if (numberProductsInCart == 0) {
        $('.cart-icon > a > span').css('visibility', 'hidden');
    }
    else {
        $('.cart-icon > a > span').css('visibility', 'visible');
    }

    /* // add-to-cart
    $('li.add-to-cart').click(function (e) {
        e.preventDefault();
        let url = $(this).find('a').attr('href');
        let productId = url.split('/')[3];
        let numberOfProduct = 4;
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                numberOfProduct,
            }),
            success: function (result) {
                $('.cart-icon > a > span').text(result.totalProducts);
                let numberProductsInCart = $('.cart-icon > a > span').text();
                if (numberProductsInCart == 0) {
                    $('.cart-icon > a > span').css('visibility', 'hidden');
                }
                else {
                    $('.cart-icon > a > span').css('visibility', 'visible');
                }
                if (result.isInCart == 0) {

                    alert('New product in cart');
                }
                else {
                    if($('.remove-from-cart > a').attr('href').split('/')[3] == productId) {

                    }
                    
                }
            }
        });
        alert('Add product successfully');
    })

    // remove from cart
    $('td.si-close').click(function (e) {
        e.preventDefault();
        let url = $(this).find('a').attr('href');
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
            }),
            success: function (result) {
                $('.cart-icon > a > span').text(result.totalProducts);
            }
        });
        alert('Remove product successfully');
    }); */
})
