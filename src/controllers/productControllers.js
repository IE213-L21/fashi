
class productControllers{

    //trang chủ
    index(req,res,next){
             res.render('index')
    }

    //Trang blog
    blog(req,res){
        res.render('blogs/blog')
    }

    //Trang chi tiết blog
    blog_details(req,res){
        res.render('blog_details')
    }

    //Trang thanh toán
    check_out(req,res){
        res.render('check-out')
    }

    //Trang liên hệ
    contact(req,res){
        res.render('contact')
    }

    //Trang câu hỏi
    faq(req,res){
        res.render('faq')
    }

    //Trang đăng nhâp
    login(req,res){
        res.render('login')
    }

    //Trang đăng kí
    register(req,res){
        res.render('register')
    }

    //Trang chi tiết sản phẩm
    product(req,res,next){
        return res.render('product',)           
    }

    //Trang danh mục sản phẩm
    shop(req,res){
        res.render('shop')
    }

    //Trang giỏ hàng
    shopping_cart(req,res){
        res.render('shopping-cart')
    }
}

module.exports = new productControllers