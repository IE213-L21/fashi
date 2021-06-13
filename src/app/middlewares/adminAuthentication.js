module.exports = function adminAuthentication(req, res, next) {
    // kiểm tra người dùng có role admin hay không?
    // nếu ko thì redirect sang trang admin login
    // lưu session
    next();
}