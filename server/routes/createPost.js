const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const {route} = require('./auth');
const Post = require('../models/post');

router.get('/allPosts',requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id userName Photo")
		.populate("comments.postedBy", "_id userName")
		.sort('-createdAt')
        .then(posts => {res.json(posts)})
        .catch(err => {console.log(err)})
})

router.post('/createPost',requireLogin, (req, res) => {
    const { body, pic} = req.body;
    if (!body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    const post = new Post({
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err)
        })
})

router.get('/myPosts',requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id userName")
        .populate("comments.postedBy", "_id userName")
				.sort('-createdAt')
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
	.populate('postedBy', '_id userName Photo')
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
	  .populate('postedBy', '_id userName Photo')
    .then(result => {
      res.json(result);
  })
  .catch(err => {
    res.status(422).json({ error: err });
    });
})

router.put('/comment',requireLogin, (req, res) => {
		const comment = {
			comment: req.body.text,
			postedBy: req.user._id
		}
		Post.findByIdAndUpdate(req.body.postId, {
			$push: { comments: comment }
		}, {
			new: true
		})
		.populate("comments.postedBy", "_id userName")
		.populate("postedBy", "_id userName Photo")
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			res.status(422).json({ error: err });
		});
});

//delete-post
router.delete('/deletePost/:postId',requireLogin, (req, res) => {
	Post.findOne({ _id: req.params.postId })
		.populate("postedBy", "_id")
		.then((post, err) => {
		if (err || !post) {
			return res.status(422).json({ error: err });
		}
		if (post.postedBy._id.toString() === req.user._id.toString()) {
		    post.remove()
			.then(result => {
				return res.json({ message: "Successfully deleted" });
			})
			.catch(err => {
				console.log(err);
			});
		}
	})
})

// to show following post
router.get("/myfollwingpost", requireLogin, (req, res) => {
	Post.find({ postedBy: { $in: req.user.following } })
		.populate("postedBy", "_id name Photo")
		.populate("comments.postedBy", "_id name")
		.then(posts => {
			res.json(posts)
		})
		.catch(err => { console.log(err) })
})

module.exports = router;