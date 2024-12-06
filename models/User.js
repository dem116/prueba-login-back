const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    content: {
      menu: { type: mongoose.Schema.Types.ObjectId, ref: "WeekMenu" },
      list: [{ type: mongoose.Schema.Types.ObjectId, ref: "ItemLista" }],
    },
  });
  
  module.exports = mongoose.model("User", userSchema);
  