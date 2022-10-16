const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  ExpToken: Date,

  isAdmin: Boolean,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        id: { type: String, required: true },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
  },
  favurite: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        id: { type: String, required: true },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.azaltCart = function (product, size, g, color) {
  const index = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  const indexId = this.cart.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.size.toString() === size.toString();
    }
  });

  const indexId2 = this.cart.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.color.toString() === color.toString();
    }
  });
  const updatedCartItems = [...this.cart.items];

  let itemQuantity = 1;

  if (index >= 0 && indexId >= 0 && indexId2 >= 0) {
    updatedCartItems[indexId].id = g;

    itemQuantity = this.cart.items[indexId].quantity - 1;
    if (itemQuantity === 0) {
      itemQuantity = 1;
    }
    updatedCartItems[indexId].quantity = itemQuantity;
    updatedCartItems[indexId].size = size;
    updatedCartItems[indexId2].color = color;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: itemQuantity,
      size: size,
      color: color,
      id: g,
    });
  }

  this.cart = {
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.addToCart = function (product, size, g, color, g2) {
  const index = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  const indexId = this.cart.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.size.toString() === size;
    }
  });

  const indexId2 = this.cart.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.color.toString() === color;
    }
  });
  const updatedCartItems = [...this.cart.items];

  let itemQuantity = 1;

  if (index >= 0 && indexId >= 0 && indexId2 >= 0) {
    updatedCartItems[indexId].id = g;

    itemQuantity = this.cart.items[indexId2].quantity + 1;
    updatedCartItems[indexId2].quantity = itemQuantity;
    updatedCartItems[indexId].size = size;
    updatedCartItems[indexId2].color = color;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: itemQuantity,
      size: size,
      color: color,
      id: g2,
    });
  }

  this.cart = {
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.deleteProduct = function (productId) {
  const cartItems = this.cart.items.filter((item) => {
    return item.id.toString() !== productId.toString();
  });
  this.cart.items = cartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.deleteFav = function (productId) {
  const cartItems = this.favurite.items.filter((item) => {
    return item.id.toString() !== productId.toString();
  });
  this.favurite.items = cartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.favurite = { items: [] };
  return this.save();
};

userSchema.methods.Guncelle = function (product, size, g, color, g2, yeniVeri) {
  const index = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  const indexId = this.cart.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.size.toString() === size.toString();
    }
  });

  const indexId2 = this.cart.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.color.toString() === color.toString();
    }
  });
  const updatedCartItems = [...this.cart.items];

  let itemQuantity = 1;

  if (index >= 0 && indexId >= 0 && indexId2 >= 0) {
    updatedCartItems[indexId].id = g;

    itemQuantity = yeniVeri;
    updatedCartItems[indexId2].quantity = itemQuantity;
    updatedCartItems[indexId].size = size;
    updatedCartItems[indexId2].color = color;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: itemQuantity,
      size: size,
      color: color,
      id: g2,
    });
  }

  this.cart = {
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.addToFav = function (product, size, g, color, g2) {
  const index = this.favurite.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  const indexId = this.favurite.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.size.toString() === size;
    }
  });

  const indexId2 = this.favurite.items.findIndex((cp) => {
    if (cp.productId.toString() === product._id.toString()) {
      return cp.color.toString() === color;
    }
  });
  const updatedCartItems = [...this.favurite.items];

  let itemQuantity = 1;

  if (index >= 0 && indexId >= 0 && indexId2 >= 0) {
    updatedCartItems[indexId].id = g;

    itemQuantity = this.favurite.items[indexId2].quantity + 1;
    updatedCartItems[indexId2].quantity = itemQuantity;
    updatedCartItems[indexId].size = size;
    updatedCartItems[indexId2].color = color;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: itemQuantity,
      size: size,
      color: color,
      id: g2,
    });
  }

  this.favurite = {
    items: updatedCartItems,
  };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
