$(document).ready(function(){
    // ajax update product in cart
    let urlUpdateCart = 'product/update-cart/';

    $('.numberProductInput').change(function() {
        // call ajax to update cart in session
        let productId = $(this).parent().next().next('.close-td').find('a').attr('href').split('/')[3];
        let totalPriceOfProduct = $(this).parent().next();
        let numberOfProduct = $(this).val();
        let currentSize = $(this).parent().prev().prev().find('option:selected').val();
        let currentInput = $(this);
        $.ajax({
            url: urlUpdateCart.concat(productId),
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                numberOfProduct,
                currentSize
            }),
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
                currentInput.val(result.numberOfProduct);
                totalPriceOfProduct.text(result.priceOfProduct + '.000đ');
                $('.cart-total span').html(result.totalPriceInCart + '.000đ');
            }
        });
    })

    $('#select-size').change(function() {
        // call ajax to update cart in session
        let productId = $(this).parent().next().next().next().next('.close-td').find('a').attr('href').split('/')[3];
        let totalPriceOfProduct = $(this).parent().next().next().next();
        let numberOfProduct = $(this).parent().next().next().find('input').val();
        let currentSize = $(this).find('option:selected').val();
        let currentInput = $(this).parent().next().next().find('input');
        $.ajax({
            url: urlUpdateCart.concat(productId),
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                numberOfProduct,
                currentSize
            }),
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
                currentInput.val(result.numberOfProduct);
                totalPriceOfProduct.text(result.priceOfProduct + '.000đ');
                $('.cart-total span').html(result.totalPriceInCart + '.000đ');
            }
        });
    })
})