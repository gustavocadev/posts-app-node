const { Router } = require("express");
const passport = require("passport");
const User = require("../models/User");
const Post = require("../models/Post");
const { isAuth } = require("../middlewares/isAuth");
const bcrypt = require("bcrypt");

const router = Router();

router.get("/", isAuth, async (req, res) => {
    const user = req.user;
    const users = await User.find();
    // I found all the posts a add the username
    const posts = await Post.find().lean();
    const allPosts = await Promise.all(
        posts.map(async (post) => {
            // console.log(post);
            const userWhoPost = await User.findById(post.user).lean();
            const { createdAt, ...everyPost } = post;
            console.log(everyPost);
            return {
                ...everyPost,
                createdAt: new Date(createdAt).toDateString(),
                username: userWhoPost.username,
            };
        })
    );

    res.render("index", {
        allPosts,
        users,
        user,
        username: user.username,
    });
});

// Show view
router.get("/login", (req, res) => {
    // mostrar el formulario del login
    res.render("login");
});

// Do an Action
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
    }),
    (req, res) => {
        res.redirect("/");
    }
);

// Show view
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Do an Action
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.redirect("/signup");

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        password: passwordHash,
    });

    await user.save();

    res.redirect("/login");
});

// show view

router.get("/:id", async (req, res) => {
    const { username } = req.user;

    if (!username) return res.redirect("/");

    const user = await User.findOne({ username }).lean();

    console.log(user, "id🏚️🏚️");
    if (!user) {
        res.redirect("/");
    }
    res.render("dashboard", {
        user,
    });
});

router.get("/users/logout", async (req, res) => {
    req.logout();

    res.redirect("/login");
});

module.exports = router;
