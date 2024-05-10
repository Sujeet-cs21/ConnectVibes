const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../models/user');
const Post=require('../models/post');
const requireLogin=require('../middleware/requireLogin');

// to get user profile
router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id userName Photo")
        .then(posts => {
          res.status(200).json({ user, posts });
        })
        .catch(err => {
          return res.status(422).json({ error: err });
        });
    })
    .catch(err => {
      return res.status(404).json({ error: "User not found" });
    });
});


// to follow user
router.put("/follow", requireLogin, (req, res) => {
  
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.user._id } },
    { new: true }
  )
    .then(updatedUser => {
      
      return User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.body.followId } },
        { new: true }
      );
    })
    .then(updatedFollower => {
      res.json(updatedFollower);
    })
    .catch(err => {
      res.status(422).json({ error: err.message });
    });
});


// to unfollow user
router.put("/unfollow", requireLogin, (req, res) => {
  
  User.findByIdAndUpdate(
    req.body.followId,
    { $pull: { followers: req.user._id } },
    { new: true }
  )
    .then(updatedUser => {

      return User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.followId } },
        { new: true }
      );
    })
    .then(updatedFollower => {
      res.json(updatedFollower);
    })
    .catch(err => {
      res.status(422).json({ error: err.message });
    });
});


// to update profile pic
router.put("/uploadProfilePic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { Photo: req.body.pic } },
    { new: true }
  )
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      res.status(422).json({ error: err });
    });
});



module.exports=router;