$(document).ready(function(){
    let numberProductsInCart = $('.cart-icon > a > span').text();
    if(numberProductsInCart == 0){
        $('.cart-icon > a > span').css('visibility', 'hidden');
    }
    else {
        $('.cart-icon > a > span').css('visibility', 'visible');
    }
})
