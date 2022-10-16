const Product = require("../model/products");
const Category = require("../model/category");
const Size = require("../model/size");
const Color = require("../model/color");
const State = require("../model/state");
const Slider = require("../model/slider");
const Order = require("../model/order");
const OrderMisafir = require("../model/orderMisafir");

exports.getAdminProduct = async (req, res, next) => {
  try {
    let products = await Product.find()
      .populate("userId", "name -_id")
      .select("image description price userId");
    let categorys = await Category.find();
    res.render("admin/admin-products", {
      products: products,
      categorys: categorys,
      action: req.query.action,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCategorys = async (req, res, next) => {
  try {
    let categorys = await Category.find();

    res.render("admin/admin-categories", {
      categorys: categorys,
      action: req.query.action,
      isAuthcuated: req.session.isAuthcuated,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddProduct = async (req, res, next) => {
  try {
    let products = await Product.find();
    let categorys = await Category.find();
    let sizeList = await Size.find();
    let colorList = await Color.find();
    let state = await State.find();
    res.render("admin/add-product", {
      products: products,
      categorys: categorys,
      action: req.query.action,
      sizeList: sizeList,
      colorList: colorList,
      isAuthcuated: req.session.isAuthcuated,
      state: state,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const image = req.files;
    const array = [];
    image.forEach((element) => {
      array.push(element.filename);
    });

    const ids = req.body.categoryIds;
    const sizeIds = req.body.sizeIds;
    const colorIds = req.body.colorIds;
    const stateIds = req.body.state;
    const New = req.body.newAdded;

    const product = new Product({
      name: name,
      description: description,
      price: price,
      userId: req.user,
      categorys: ids,
      sizeList: sizeIds,
      colorList: colorIds,
      stateList: stateIds,
      image: array,
      newAdded: New,
    });

    await product.save();
    let categorys = await Category.find();
    categorys = categorys.map((category) => {
      if (product.categorys) {
        product.categorys.find((item) => {
          if (item.toString() === category._id.toString()) {
            category.selected = true;
          }
        });
      }

      return category;
    });
    let size = await Size.find();
    sizeList = size.map((sizeOne) => {
      if (product.sizeList) {
        product.sizeList.find((item) => {
          if (item.toString() === sizeOne.sizeName.toString()) {
            sizeOne.selected = true;
          }
        });
      }

      return sizeOne;
    });
    let color = await Color.find();
    colorList = color.map((colorOne) => {
      if (product.colorList) {
        product.colorList.find((item) => {
          if (item.toString() === colorOne.colorName.toString()) {
            colorOne.selected = true;
          }
        });
      }

      return colorOne;
    });

    let state = await State.find();
    stateList = state.map((stateOne) => {
      if (product.stateList) {
        product.stateList.find((item) => {
          if (item.toString() === stateOne.product_durumu.toString()) {
            stateOne.selected = true;
          }
        });
      }
      return stateOne;
    });

    res.redirect("/admin/admin-products?action=Products Mange");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    let products = await Product.findById(req.params.productId);
    res.cookie("image", products.image);

    let categorys = await Category.find();
    categorys = categorys.map((category) => {
      if (products.categorys) {
        products.categorys.find((item) => {
          console.log(item.toString());
          if (item.toString() === category.CategoryName.toString()) {
            category.selected = true;
          }
        });
      }

      return category;
    });

    let size = await Size.find();
    sizeList = size.map((sizeOne) => {
      if (products.sizeList) {
        products.sizeList.find((item) => {
          if (item.toString() === sizeOne.sizeName.toString()) {
            sizeOne.selected = true;
          }
        });
      }

      return sizeOne;
    });

    let color = await Color.find();
    colorList = color.map((colorOne) => {
      if (products.colorList) {
        products.colorList.find((item) => {
          if (item.toString() === colorOne.colorName.toString()) {
            colorOne.selected = true;
          }
        });
      }

      return colorOne;
    });

    let state = await State.find();
    stateList = state.map((stateOne) => {
      if (products.stateList) {
        products.stateList.find((item) => {
          if (item.toString() === stateOne.product_durumu.toString()) {
            stateOne.selected = true;
          }
        });
      }
      return stateOne;
    });

    res.render("admin/edit-product", {
      title: "Edit Product",
      path: "/admin/products",
      products: products,
      categorys: categorys,
      sizeList: sizeList,
      colorList: colorList,
      isAuthcuated: req.session.isAuthcuated,
      state: state,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  // const image =req.body.image || req.cookies.image  ;
  const id = req.body.id;
  const ids = req.body.categoryIds;
  const sizeIds = req.body.sizeIds;
  const colorIds = req.body.colorIds;
  const stateIds = req.body.state;

  const image = req.files;
  const array = [];
  image.forEach((element) => {
    console.log(element.filename);
    array.push(element.filename);
  });

  Product.updateOne(
    { _id: id },
    {
      $set: {
        name: name,
        description: description,
        price: price,
        image: array,
        categorys: ids,
        sizeList: sizeIds,
        colorList: colorIds,
        stateList: stateIds,
      },
    }
  )

    .then((result) => {
      // console.log(result);
      res.redirect("/admin/admin-products?action=edit");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getAddCategory = (req, res, next) => {
  Category.find()
    .then((categorys) => {
      res.render("admin/add-category", {
        categorys: categorys,
        isAuthcuated: req.session.isAuthcuated,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddCategory = (req, res, next) => {
  const CategoryName = req.body.CategoryName;
  const image = req.files;
  const array = [];
  image.forEach((element) => {
    console.log(element.filename);
    array.push(element.filename);
  });

  const category = new Category({ CategoryName: CategoryName, image: array });
  category
    .save()
    .then((result) => {
      res.redirect("/admin/admin-categorys?action=Categories Mange");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getaddSliderPhotos = (req, res, next) => {
  res.render("admin/sliderMange");
};
exports.postaddSliderPhotos = (req, res, next) => {
  const image = req.files;
  const array = [];
  image.forEach((element) => {
    array.push(element.filename);
  });

  const slider = new Slider({ image: array });
  slider
    .save()
    .then((result) => {
      res.redirect("/admin/add-sliderPhotos?action=slider Mange");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;
  Category.findById(categoryId).then((categorys) => {
    res.render("admin/edit-category", {
      categorys: categorys,
      isAuthcuated: req.session.isAuthcuated,
    });
  });
};

exports.postEditCategory = (req, res, next) => {
  const CategoryName = req.body.CategoryName;
  const id = req.body.id;
  const image = req.files;
  const array = [];
  image.forEach((element) => {
    console.log(element.filename);
    array.push(element.filename);
  });

  Category.updateOne(
    { _id: id },
    {
      $set: {
        CategoryName: CategoryName,
        image: array,
      },
    }
  )

    .then((category) => {
      res.redirect("/admin/admin-categorys?action=edit");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId })
    .then((result) => {
      console.log(`${productId} deleted`);
      res.redirect("/admin/admin-products?action=Product Mange");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postDeleteCategory = (req, res, next) => {
  const categoryId = req.body.categoryId;
  Category.deleteOne({ _id: categoryId })
    .then((result) => {
      console.log(`${categoryId} deleted`);
      res.redirect("/admin/admin-categorys?action=Categories Mange");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddSize = (req, res, next) => {
  Category.find()
    .then((categorys) => {
      res.render("admin/add-size", {
        categorys: categorys,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddSize = (req, res, next) => {
  const sizeSchema = new Size({ sizeName: req.body.sizeName });

  sizeSchema
    .save()
    .then((result) => {
      res.redirect("/admin/add-size");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddState = (req, res, next) => {
  Category.find()
    .then((categorys) => {
      res.render("admin/add-state", {
        categorys: categorys,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddState = (req, res, next) => {
  const state = new State({ product_durumu: req.body.productDurumu });

  state
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")

    .then((user) => {
      Category.find().then((categorys) => {
        Order.find().then((orders) => {
          OrderMisafir.find().then((orders2) => {
            res.render("shop/order", {
              orders: orders,
              orders2: orders2,
              categorys: categorys,
              isAuthcuated: req.session.isAuthcuated,
              isAdmin: req.session.A,
              orderMisafir: req.session.orderMisafir,
              sepeti: user.cart.items,
              favurite: user.favurite.items,
            });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteOrder = (req, res, next) => {
  let orderId = req.body.orderId;
  console.log(orderId);

  OrderMisafir.deleteOne({ _id: orderId })
    .then((data) => {
      console.log(data);

      res.redirect("/admin/orders");
    })
    .catch((err) => {
      console.log(err);
    });
  Order.deleteOne({ _id: orderId })
    .then((data) => {
      console.log(data);

      res.redirect("/admin/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
