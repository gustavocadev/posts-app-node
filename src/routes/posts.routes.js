const { Router } = require("express");
const Post = require("../models/Post");

const router = Router();

// router.get('/', () => {})

router.post("/posts/new", async (req, res) => {
    const { description } = req.body;

    const post = new Post({ description, user: req.user._id });

    await post.save();

    res.redirect("/");
});

module.exports = router;
