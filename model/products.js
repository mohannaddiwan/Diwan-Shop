const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],

  userId: {
    type: Object,
    ref: "User",
    required: true,
  },
  categorys: [
    {
      type: String,
      ref: "Category",
      required: true,
    },
  ],
  sizeList: [
    {
      type: String,
      ref: "Size",
      required: true,
    },
  ],
  colorList: [
    {
      type: String,
      ref: "Color",
      required: true,
    },
  ],
  stateList: [
    {
      type: String,
      ref: "State",
    },
  ],

  data: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
