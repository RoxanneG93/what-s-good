const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   time: { type : Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
