const { request } = require("express");

const isAuth = (req = request, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
        return;
    }
    next();
};

module.exports = { isAuth };
