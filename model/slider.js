const mongoose = require("mongoose");

const sliderSchema = mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("slider", sliderSchema);
