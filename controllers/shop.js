const Product = require("../model/products");
const Category = require("../model/category");
const Order = require("../model/order");
const OrderMisafir = require("../model/orderMisafir");
const Size = require("../model/size");
const Color = require("../model/color");
const State = require("../model/state");
const Slider = require("../model/slider");

exports.postSearch = (req, res, next) => {
  let searchPro = req.body.search;

  res.redirect(`/search?search=${searchPro}`);
};
exports.getSearch = (req, res, next) => {
  let searchingPro = new RegExp(req.query.search, "i");
  console.log(searchingPro);
  req.session.h = "f";
  delete req.session.d;
  let urlReq = req.url;
  if (req.user) {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        Product.find({
          $or: [{ categorys: searchingPro }, { name: searchingPro }],
        }).then((products) => {
          Category.find().then((categorys) => {
            State.find().then((state) => {
              Size.find().then((size) => {
                sizeList = size.map((sizeOne) => {
                  if (products.sizeList) {
                    sizeOne.disabled = true;
                    products.sizeList.find((item) => {
                      if (item.toString() === sizeOne.sizeName.toString()) {
                        sizeOne.disabled = false;
                      }
                    });
                  }

                  return sizeOne;
                });

                Color.find().then((color) => {
                  colorList = color.map((colorOne) => {
                    if (products.sizeList) {
                      colorOne.disabled = true;
                      products.colorList.find((item) => {
                        if (item.toString() === colorOne.colorName.toString()) {
                          colorOne.disabled = false;
                        }
                      });
                    }

                    return colorOne;
                  });

                  res.render("shop/proByCat", {
                    products: products,
                    categorys: categorys,
                    sepeti: user.cart.items,
                    state: state,
                    sizeList: sizeList,
                    colorList: colorList,
                    url: urlReq,
                    login: req.session.user2,
                    isAuthcuated: req.session.isAuthcuated,
                    user: req.session.user,
                    isAdmin: req.session.A,
                    orderMisafir: req.session.orderMisafir,
                  });
                });
              });
            });
          });
        });
      })

      .catch((err) => {
        console.log(err);
      });
  } else {
    let sepeti = req.session.sepeti;
    Product.find({
      $or: [{ categorys: searchingPro }, { name: searchingPro }],
    })
      .then((products) => {
        Product.find().then((categorys) => {
          res.render("shop/proByCat", {
            products: products,
            categorys: categorys,
            sepeti: sepeti || [],
            orderMisafir: req.session.orderMisafir,
            url: urlReq,
            isAuthcuated: req.session.isAuthcuated,
          });
        });
      })

      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getIndex = (req, res, next) => {
  req.session.h = "f";
  delete req.session.d;
  let urlReq = req.url;
  if (req.user) {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        Product.find().then((products) => {
          Category.find().then((categorys) => {
            State.find().then((state) => {
              Slider.find().then((slider) => {
                Size.find().then((size) => {
                  sizeList = size.map((sizeOne) => {
                    if (products.sizeList) {
                      sizeOne.disabled = true;
                      products.sizeList.find((item) => {
                        if (item.toString() === sizeOne.sizeName.toString()) {
                          sizeOne.disabled = false;
                        }
                      });
                    }

                    return sizeOne;
                  });

                  Color.find().then((color) => {
                    colorList = color.map((colorOne) => {
                      if (products.sizeList) {
                        colorOne.disabled = true;
                        products.colorList.find((item) => {
                          if (
                            item.toString() === colorOne.colorName.toString()
                          ) {
                            colorOne.disabled = false;
                          }
                        });
                      }

                      return colorOne;
                    });

                    res.render("shop/products", {
                      products: products,
                      categorys: categorys,
                      sepeti: user.cart.items,
                      favurite: user.favurite.items,
                      state: state,
                      slider: slider,
                      sizeList: sizeList,
                      colorList: colorList,
                      url: urlReq,
                      login: req.session.user2,
                      isAuthcuated: req.session.isAuthcuated,
                      user: req.session.user,
                      isAdmin: req.session.A,
                      orderMisafir: req.session.orderMisafir,
                    });
                  });
                });
              });
            });
          });
        });
      })

      .catch((err) => {
        console.log(err);
      });
  } else {
    Product.find()
      .then((products) => {
        Category.find().then((categorys) => {
          Slider.find().then((slider) => {
            res.render("shop/products", {
              products: products,
              categorys: categorys,
              url: urlReq,
              slider: slider,
              orderMisafir: req.session.orderMisafir,
              sepeti: req.session.sepeti || [],

              isAuthcuated: req.session.isAuthcuated,
            });
          });
        });
      })

      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getProDet = (req, res, next) => {
  let h = req.session.h;
  let selectSize = req.session.selectSize;
  let selectColor = req.session.selectColor;
  let urlReq = req.url;
  delete req.session.selectSize;
  delete req.session.selectColor;
  if (req.user) {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        Product.findById(req.params.productId)
          .then((product) => {
            return product;
          })
          .then((product) => {
            Category.find().then((categorys) => {
              Size.find().then((size) => {
                sizeList = size.map((sizeOne) => {
                  if (product.sizeList) {
                    console.log(product);
                    sizeOne.disabled = true;
                    product.sizeList.find((item) => {
                      if (item.toString() === sizeOne.sizeName.toString()) {
                        sizeOne.disabled = false;
                      }
                    });
                  }

                  return sizeOne;
                });

                Color.find().then((color) => {
                  colorList = color.map((colorOne) => {
                    if (product.sizeList) {
                      colorOne.disabled = true;
                      product.colorList.find((item) => {
                        if (item.toString() === colorOne.colorName.toString()) {
                          colorOne.disabled = false;
                        }
                      });
                    }

                    return colorOne;
                  });

                  res.render("shop/productDetails", {
                    products: product,
                    categorys: categorys,
                    sizeList: sizeList,
                    colorList: colorList,
                    isAuthcuated: req.session.isAuthcuated,
                    selectSize: selectSize,
                    selectColor: selectColor,
                    sepeti: user.cart.items,
                    favurite: user.favurite.items,

                    url: urlReq,
                    h: h,
                    isAdmin: req.session.A,
                  });
                });
              });
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Product.findById(req.params.productId)
      .then((product) => {
        return product;
      })
      .then((product) => {
        Category.find().then((categorys) => {
          Size.find().then((size) => {
            sizeList = size.map((sizeOne) => {
              if (product.sizeList) {
                sizeOne.disabled = true;
                product.sizeList.find((item) => {
                  if (item.toString() === sizeOne.sizeName.toString()) {
                    sizeOne.disabled = false;
                  }
                });
              }

              return sizeOne;
            });

            Color.find().then((color) => {
              colorList = color.map((colorOne) => {
                if (product.sizeList) {
                  colorOne.disabled = true;
                  product.colorList.find((item) => {
                    if (item.toString() === colorOne.colorName.toString()) {
                      colorOne.disabled = false;
                    }
                  });
                }

                return colorOne;
              });

              res.render("shop/productDetails", {
                products: product,
                categorys: categorys,
                sizeList: sizeList,
                colorList: colorList,
                isAuthcuated: req.session.isAuthcuated,
                selectSize: selectSize,
                selectColor: selectColor,
                url: urlReq,
                h: h,
                sepeti: req.session.sepeti || [],
              });
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getProByCat = (req, res, next) => {
  const urlReq = req.url;
  console.log(`${urlReq}rere`);
  const categoryid = req.params.categoryid;
  console.log(`${categoryid}r`);

  const model = [];
  if (req.user) {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        Category.find()
          .then((categorys) => {
            model.categorys = categorys;
            console.log(categorys);

            return Product.find({ categorys: categoryid });
          })
          .then((products) => {
            console.log(products);
            res.render("shop/proByCat", {
              products: products,
              categorys: model.categorys,
              selectedCategory: categoryid,
              isAuthcuated: req.session.isAuthcuated,
              sepeti: user.cart.items || [],
              favurite: user.favurite.items || [],

              url: urlReq,
              isAdmin: req.session.A,
            });
          });
      })

      .catch((err) => {
        console.log(err);
      });
  } else {
    Category.find()
      .then((categorys) => {
        model.categorys = categorys;

        return Product.find({ categorys: categoryid });
      })
      .then((products) => {
        res.render("shop/proByCat", {
          products: products,
          categorys: model.categorys,
          selectedCategory: categoryid,
          isAuthcuated: req.session.isAuthcuated,
          sepeti: req.session.sepeti || [],
        });
      })

      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getCart = (req, res, next) => {
  if (req.user) {
    req.user
      .populate("cart.items.productId")

      .then((user) => {
        console.log(`${user.cart.items}lp`);
        Category.find().then((categorys) => {
          res.render("shop/cart", {
            title: "Cart",
            path: "/cart",
            sepeti: user.cart.items, // data using populate
            categorys: categorys,
            favurite: user.favurite.items,

            isAuthcuated: req.session.isAuthcuated,
            isAdmin: req.session.A,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let sepeti = req.session.sepeti;
    if (req.query.delete) {
      const cartItems = sepeti.filter((item) => {
        console.log(`${item.compare}f`);
        console.log(req.query.delete);

        return item.compare !== req.query.delete;
      });

      req.session.sepeti = cartItems;
      res.redirect("/cart");
    }

    Category.find()
      .then((categorys) => {
        res.render("shop/cart", {
          title: "Cart",
          path: "/cart",
          sepeti: sepeti || [],
          categorys: categorys,
          isAuthcuated: req.session.isAuthcuated,
          misafir: req.session.misafir,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
exports.postPlus = (req, res, next) => {
  let sepeti = req.session.sepeti;
  let compare = req.session.compare;

  for (let i = 0; i < sepeti.length; i++) {
    if (sepeti[i].compare === compare) {
      console.log("p");
      sepeti[i].productCount += 1;
    }
  }
  res.redirect("/cart");
};
exports.postEksi = (req, res, next) => {
  let sepeti = req.session.sepeti;
  let compare = req.session.compare;

  for (let i = 0; i < sepeti.length; i++) {
    if (sepeti[i].compare === compare) {
      console.log("p");
      if (sepeti[i].productCount >= 1) {
        sepeti[i].productCount = 1;
      } else {
        sepeti[i].productCount -= 1;
      }
    }
  }
  res.redirect("/cart");
};

exports.ArtCart = (req, res, next) => {
  let productId = req.body.productId;
  let productSize = req.body.size;
  let productColor = req.body.color;

  Product.findById(productId)
    .then((product) => {
      let sizeId = req.body.sizeId;

      g = product._id + sizeId;

      return req.user.addToCart(product._id, productSize, g, productColor);
    })
    .then((product) => {
      res.redirect(`/cart`);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.AzaltCart = (req, res, next) => {
  let productId = req.body.productId;
  let productSize = req.body.size;
  let productColor = req.body.color;

  Product.findById(productId)
    .then((product) => {
      console.log(`${product._id};;`);

      let sizeId = req.body.sizeId;

      g = product._id + sizeId;

      return req.user.azaltCart(product._id, productSize, g, productColor);
    })
    .then((product) => {
      res.redirect(`/cart`);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  if (req.user) {
    let productId = req.body.productId;
    let categoryId = req.body.categoryId;

    let size = req.body.size;
    let color = req.body.color;
    if (req.body.size === "" || req.body.color === "") {
      if (req.body.url === `/products/Details/${productId}`) {
        console.log(req.body.url);
        res.redirect(`/products/Details/${productId}`);
      }
      if (req.body.url === `/products/${categoryId}`) {
        console.log(`${req.body.url}..u.`);
        res.redirect(`/products/${categoryId}`);
      } else {
        console.log(`${req.body.url}..t.`);
        res.redirect("/");
      }
    }

    Product.findById(productId)
      .then((product) => {
        let sizeId = req.body.sizeId;
        let colorId = req.body.colorId;

        g = product._id + sizeId;
        g2 = product._id + colorId;

        return req.user.addToCart(product._id, size, g, color, g2);
      })
      .then((product) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let productId = req.body.productId;
    let categoryId = req.body.categoryId;
    const productName = req.body.name;
    const productDescription = req.body.description;
    const productImg = req.body.image;
    const productPrice = req.body.price;
    let productSize = req.body.size;
    let productColor = req.body.color;
    let productCount = 1;
    let sizeId = req.body.sizeId;
    let colorId = req.body.colorId;
    let compare = productId + sizeId + colorId;
    img = productImg.split(",");
    console.log(`${img}df`);
    req.session.productName = productName;
    req.session.productDescription = productDescription;
    req.session.productPrice = productPrice;
    req.session.productImg = img;
    req.session.productSize = productSize;
    req.session.productColor = productColor;
    req.session.categoryId = categoryId;
    req.session.productId = productId;
    req.session.count = productCount;
    req.session.sizeId = sizeId;
    req.session.colorId = colorId;
    req.session.compare = compare;
    req.session.control = "control";
    let sepeti = req.session.sepeti;

    if (!sepeti) {
      sepeti = [];
    }

    if (req.session.control) {
      if (sepeti.length > 0) {
        for (let i = 0; i < sepeti.length; i++) {
          if (sepeti[i].compare === compare) {
            console.log("p");
            req.session.exsist = "exsist";
            sepeti[i].productCount += 1;
          }
        }
        if (!req.session.exsist) {
          console.log("r");
          sepeti.push({
            productName: productName,
            productDescription: productDescription,
            productPrice: productPrice,
            productImg: productImg,
            productSize: productSize,
            productColor: productColor,
            categoryId: categoryId,
            productId: productId,
            productCount: productCount,
            sizeId: sizeId,
            colorId: colorId,
            compare: compare,
            url: req.url,
          });
          delete req.session.exsist;
        }
        delete req.session.exsist;
      } else {
        console.log("n");

        sepeti.push({
          productName: productName,
          productDescription: productDescription,
          productPrice: productPrice,
          productImg: productImg,
          productSize: productSize,
          productColor: productColor,
          categoryId: categoryId,
          productId: productId,
          productCount: productCount,
          sizeId: sizeId,
          colorId: colorId,
          compare: compare,
        });
      }
    }
    delete req.session.control;
    req.session.sepeti = sepeti;
    console.log(sepeti);

    Product.find()
      .then((products) => {
        Category.find().then((categorys) => {
          res.render("shop/products", {
            products: products,
            categorys: categorys,

            sepeti: req.session.sepeti || [],

            isAuthcuated: req.session.isAuthcuated,
          });
        });
      })

      .catch((err) => {
        console.log(err);
      });
  }
};

exports.deleteProduct = (req, res, next) => {
  let productId = req.body.productId;
  let productSize = req.body.productSizeId;
  console.log(req.url);
  req.user
    .deleteProduct(productSize)
    .then(() => {
      res.redirect("/cart?action=delete");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.deleteFav = (req, res, next) => {
  let productId = req.body.productId;
  let productSize = req.body.productSizeId;
  console.log(req.url);
  req.user
    .deleteFav(productSize)
    .then(() => {
      res.redirect("/favurite?action=delete");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.deleteProductOutUser = (req, res, next) => {
  let sepeti = req.session.sepeti;
  let compare = req.body.compare;

  res.redirect(`/cart?delete=${compare}`);
};

exports.getOrderOutUser = (req, res, next) => {
  Category.find().then((categorys) => {
    res.render("shop/misafirDet", {
      categorys: categorys,
      sepeti: req.session.sepeti || [],
      favurite: user.favurite.items || [],
    });
  });
};
exports.postOrderMisafir = (req, res, next) => {
  let name = req.body.name;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let tel = req.body.tel;
  let productName = req.session.productName;
  let productDescription = req.session.productDescription;
  let productPrice = req.session.productPrice;
  let productImg = req.session.productImg;
  let productSize = req.session.productSize;
  let productColor = req.session.productColor;
  let productCount = req.session.count;
  req.session.siparisVerBtn = "true";
  const order = new OrderMisafir({
    orderId: Math.random(),
    userName: name,
    lastName: lastName,
    email: email,
    tel: tel,
    name: productName,
    description: productDescription,
    price: productPrice,
    image: productImg,
    quantity: productCount,
    size: productSize,
    color: productColor,
  });

  return order
    .save()
    .then((order) => {
      delete req.session.sepeti;
      return order;
    })
    .then((order) => {
      res.redirect(`/order?orderId=${order.orderId}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.session.siparisVerBtn = "true";

  if (req.user) {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const order = new Order({
          user: {
            userId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
          },
          items: user.cart.items.map((p) => {
            return {
              product: {
                _id: p.productId._id,
                name: p.productId.name,
                description: p.productId.description,
                price: p.productId.price,
                image: p.productId.image,
              },
              quantity: p.quantity,
              size: p.size,
              color: p.color,
            };
          }),
          orderId: Math.random(),
        });

        return order.save();
      })

      .then((order) => {
        res.redirect(`/order?orderId=${order.orderId}`);
      })
      .then((order) => {
        return req.user.clearCart();
      })

      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/orderDet");
  }
};

exports.getOrder = (req, res, next) => {
  let siparisBtn = req.session.siparisVerBtn;
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  if (req.user) {
    req.user.populate("cart.items.productId").then((user) => {
      Category.find()
        .then((categorys) => {
          Order.find({ orderId: req.query.orderId }).then((orders) => {
            res.render("shop/order", {
              orders: orders,
              categorys: categorys,
              isAuthcuated: req.session.isAuthcuated,
              sepeti: user.cart.items,
              favurite: user.favurite.items || [],

              urlOfOrder: fullUrl,
              isAdmin: req.session.A,
              orderMisafir: req.session.orderMisafir,
              isAdmin: req.session.A,
              siparisBtn: siparisBtn,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    Category.find()
      .then((categorys) => {
        OrderMisafir.find({ orderId: req.query.orderId }).then((orders2) => {
          res.render("shop/order", {
            categorys: categorys,
            isAuthcuated: req.session.isAuthcuated,
            urlOfOrder: fullUrl,
            orders2: orders2,
            isAdmin: req.session.A,
            sepeti: req.session.sepeti || [],
            siparisBtn: siparisBtn,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.postGuncelle = (req, res, next) => {
  let productId = req.body.productId;
  let productSize = req.body.size;
  let productColor = req.body.color;
  let id = req.body.id;
  const newVeri = req.body.quantity;
  if (req.user) {
    Product.findById(productId)
      .then((product) => {
        let sizeId = req.body.sizeId;
        let colorId = req.body.colorId;

        g = product._id + sizeId;
        g2 = product._id + colorId;

        return req.user.Guncelle(
          product._id,
          productSize,
          g,
          productColor,
          g2,
          newVeri
        );
      })
      .then((product) => {
        res.redirect(`/cart`);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let count = req.body.quantity;
    let sepeti = req.session.sepeti;
    let compare = req.session.compare;

    for (let i = 0; i < sepeti.length; i++) {
      if (sepeti[i].compare === compare) {
        if (parseInt(count) >= 1) {
          sepeti[i].productCount = parseInt(count);
        }
      }
    }
    res.redirect("/cart");
  }
};
exports.getFavurite = (req, res, next) => {
  if (req.user) {
    req.user
      .populate("favurite.items.productId")

      .then((user) => {
        console.log(`${user.cart.items}lp`);
        Category.find().then((categorys) => {
          Product.find().then((products) => {
            res.render("shop/favuraite", {
              title: "Favutaite",
              path: "/favuraite",
              sepeti: user.cart.items, // data using populate
              categorys: categorys,
              favurite: user.favurite.items || [],
              product: products,
              isAuthcuated: req.session.isAuthcuated,
              isAdmin: req.session.A,
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};
exports.postFavurite = (req, res, next) => {
  let productId = req.body.productId;
  let categoryId = req.body.categoryId;

  let size = req.body.size;
  let color = req.body.color;
  if (req.body.size === "" || req.body.color === "") {
    if (req.body.url === `/products/Details/${productId}`) {
      console.log(req.body.url);
      res.redirect(`/products/Details/${productId}`);
    }
    if (req.body.url === `/products/${categoryId}`) {
      console.log(`${req.body.url}..u.`);
      res.redirect(`/products/${categoryId}`);
    } else {
      console.log(`${req.body.url}..t.`);
      res.redirect("/");
    }
  }

  Product.findById(productId)
    .then((product) => {
      let sizeId = req.body.sizeId;
      let colorId = req.body.colorId;

      g = product._id + sizeId;
      g2 = product._id + colorId;

      return req.user.addToFav(product._id, size, g, color, g2);
    })
    .then((product) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
