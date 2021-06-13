$(document).ready(function(){
    let numberProduct = parseInt($('.numberProductInput').val());
    $('.numberProductInput').change(function() {
        // set price of each product row
        let numberProduct = parseInt($(this).val());
        let priceEachProductInCart = $(this).parent().prev('.price-each-product-in-cart').text().split('.')[0]
        let totalPriceEachProductInCart = numberProduct * priceEachProductInCart
        $(this).parent().next('.total-price-each-product').text(totalPriceEachProductInCart + '.000đ');
        // set total price of cart
        let totalPriceOfCart = 0;
        $('.total-price-each-product').each( function() {
            totalPriceOfCart += parseInt($(this).text().split('.')[0]);
            console.log('')
        })
        $('.cart-total > span').text(totalPriceOfCart + '.000đ');
    })
    console.log('Arsenal');
})