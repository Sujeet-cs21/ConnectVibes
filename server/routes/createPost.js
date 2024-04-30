const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const {route} = require('./auth');
const Post = require('../models/post');

router.get('/allPosts',requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id userName")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/createPost',requireLogin, (req, res) => {
    const { body, pic} = req.body;
    // console.log(pic);
    if (!body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    // console.log(req.user);
    const post = new Post({
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
      // console.log(result);
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err)
        })
})

router.get('/myPosts',requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id userName")
        .then(mypost => {
            res.json(mypost)
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
      $push: { likes: req.user._id }
  }, {
      new: true
  })
  .then(result => {
      res.json(result);
  })
  .catch(err => {
      res.status(422).json({ error: err });
  });
});

router.put('/unlike',requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
    .then(result => {
      res.json(result);
  })
  .catch(err => {
      res.status(422).json({ error: err });
  });
})

module.exports = router;