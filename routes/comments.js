const express = require("express");
const router  = express.Router({mergeParams: true});
const Restaurant = require("../models/restaurant");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find restaurant by id
    console.log(req.params.id);
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {restaurant: restaurant});
        }
    })
});

//Comments Create
router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup rrestaurant using ID
   Restaurant.findById(req.params.id, function(err, restaurant) {
       if(err){
           console.log(err);
           res.redirect("/restaurants");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               restaurant.comments.push(comment._id);
               restaurant.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/restaurants/' + restaurant._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/restaurants/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/restaurants/" + req.params.id);
       }
    });
});

module.exports = router;


// Wingstop Restaurants, Inc. is a chain of nostalgic, aviation-themed restaurants where the sole focus is on chicken wings. Wingstop locations are decorated following a 1930s and 1940s "pre-jet" aviation theme