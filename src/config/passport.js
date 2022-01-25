const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        console.log({ username });
        console.log({ password }, "since passport");
        const user = await User.findOne({ username });

        if (!user)
            return done(null, user, {
                msg: "el usuario no existe",
            });
        const isMatch =
            (await bcrypt.compare(password, user.password)) ||
            password === user.password;
        console.log(isMatch);
        if (!isMatch)
            return done(null, false, {
                msg: "Passoword is not correct",
            });

        return done(null, user);
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);

    done(null, user);
});

module.exports = { LocalStrategy };
