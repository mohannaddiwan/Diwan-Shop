const category = require("../model/category");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const crypto = require("crypto"); // reset password
const nodemailer = require("nodemailer");
const validationResult = require("express-validator").validationResult;

exports.getLogIn = (req, res, next) => {
  let ErrorMessage = req.session.ErrorMesage;
  let ErrorPassword = req.session.ErrorPassword;
  req.session.clickLogin = "clickLogin";
  let NoUser = req.session.NoUser;
  delete req.session.ErrorMesage;
  delete req.session.NoUser;
  delete req.session.misafir;
  delete req.session.orderMisafir;
  category.find().then((categorys) => {
    res.render("accunts/logIn", {
      categorys: categorys,
      ErrorMessage: ErrorMessage,
      NoUser: NoUser,
      ErrorPassword: ErrorPassword,
      clickLogin: req.session.clickLogin,
      sepeti: [],
    });
  });
};

exports.postLogIn = (req, res, next) => {
  delete req.session.misafir;
  if (validationResult(req).isEmpty()) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.session.NoUser = "NoUser";
          req.session.save((err) => {
            console.log(err);
            res.redirect("/login");
          });
        }
        bcrypt
          .compare(password, user.password)
          .then((isTrue) => {
            if (isTrue && user.isAdmin === true) {
              // Administor control
              req.session.user = user;
              req.session.user2 = user;

              req.session.isAuthcuated = true;
              req.session.A = true;

              return req.session.save((err) => {
                // sission للتاكد من حفظ

                console.log(err);
                res.redirect("/");
              });
            }
            if (isTrue) {
              req.session.user = user;
              req.session.user2 = user;

              req.session.isAuthcuated = true;

              const url = req.session.urlTo || "/";
              delete req.session.urlTo;
              return req.session.save((err) => {
                console.log(err);
                res.redirect(url);
              });
            }
            req.session.ErrorPassword = "Error Password";
            req.session.save((err) => {
              console.log(err);
              res.redirect("/login");
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.session.ErrorMesage = validationResult(req).array();
    res.redirect("/login");
  }
};

exports.getSignUp = (req, res, next) => {
  const ErrorMessage = req.session.ErrorMesage;
  const Error = req.session.Error;
  const Confirm = req.session.Confirm;
  req.session.clickLogin = "clickLogin";
  var fullUrl = req.protocol + "://" + req.get("host");
  console.log(fullUrl);
  delete req.session.ErrorMesage;
  delete req.session.Error;
  delete req.session.Confirm;
  delete req.session.misafir;
  delete req.session.orderMisafir;

  category.find().then((categorys) => {
    res.render("accunts/signup", {
      categorys: categorys,
      ErrorMessage: ErrorMessage,
      Error: Error,
      Confirm: Confirm,
      url: fullUrl,
      sepeti: [],

      clickLogin: req.session.clickLogin,
    });
  });
};

exports.getConfirmSignUp = (req, res, next) => {
  const ErrorMessage = req.session.ErrorMesage;
  const Error = req.session.Error;
  const Confirm = req.session.Confirm;
  delete req.session.ErrorMesage;
  delete req.session.Error;
  delete req.session.Confirm;
  category.find().then((categorys) => {
    res.render("accunts/Confirm", {
      categorys: categorys,
      ErrorMessage: ErrorMessage,
      Error: Error,
      Confirm: Confirm,
      misafir: req.session.misafir,
      sepeti: [],
    });
  });
};

exports.postSignUp = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    const email = req.body.email;
    const url = req.body.url;

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          req.session.Error = "Email Already Exsist";

          return res.redirect("/signup");
        }
      })
      .then((result) => {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sef.diwan0000@gmail.com",
            pass: "ardsfwrykabtjrbz",
          },
        });

        let mailOptions = {
          from: "sef.diwan0000@gmail.com",
          to: email,
          subject: "sending mail",
          html: `
        <p> Doğrulama maili </p>
        <a href="${url}/signupConfirm/Confirm">Doğrulama maili</a>
        `,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Confirm Email: ${info.response}`);
          }
        });
        req.session.Confirm = "Doğrulama maili gönderildi";
        res.redirect("/signup");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.session.ErrorMesage = validationResult(req).array();
    res.redirect("/signup");
  }
};

exports.postConfirmSignUp = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    const name = req.body.name;
    const lastName = req.body.lastName;
    const tel = req.body.tel;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          req.session.ErrorMesage = "Email Already Exsist";
          return res.redirect("/signup");
        } else {
          bcrypt.hash(password, 10).then((hashPass) => {
            const newUser = new User({
              name: name,
              lastName: lastName,
              tel: tel,
              email: email,
              password: hashPass,
              cart: { items: [] },
              favurite: { items: [] },
            });
            newUser.save();
          });
        }
      })
      .then(() => {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sef.diwan0000@gmail.com",
            pass: "ardsfwrykabtjrbz",
          },
        });

        let mailOptions = {
          from: "sef.diwan0000@gmail.com",
          to: email,
          subject: "sending mail",
          text: "Sucsess Mail",
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`email: ${info.response}`);
          }
        });

        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.session.ErrorMesage = validationResult(req).array();
    res.redirect("/signup");
  }
};

exports.getLogout = (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      return res.redirect("/");
    }
  });
};

exports.getResetPassword = (req, res, next) => {
  let NoUser = req.session.NoUser;

  res.render("accunts/reset-password", { NoUser: NoUser });
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/reset-password");
    }

    const Token = buffer.toString("hex");

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.session.NoUser = "NoUser";
          req.session.save((err) => {
            console.log(err);
            res.redirect("/reset-password");
          });
        }
        user.resetToken = Token;
        user.ExpToken = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sef.diwan0000@gmail.com",
            pass: "ardsfwrykabtjrbz",
          },
        });

        let mailOptions = {
          from: "sef.diwan0000@gmail.com",
          to: email,
          subject: "reset password",
          html: `
        <p> enter new password </p>
        <a href="/reset-password/${Token}">reset password</a>
        `,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`email: ${info.response}`);
          }
        });
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const Token = req.params.Token;
  User.findOne({ resetToken: Token, ExpToken: { $gt: Date.now() } })
    .then((user) => {
      res.render("accunts/NewPass", {
        userId: user._id,
        TokenPassword: Token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPass = (req, res, next) => {
  const newPass = req.body.password;
  const Token = req.body.TokenPassword;
  const userId = req.body.userId;
  let _user;
  User.findOne({
    resetToken: Token,
    ExpToken: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      _user = user;
      return bcrypt.hash(newPass, 10);
    })
    .then((hashedPass) => {
      console.log(hashedPass);
      _user.password = hashedPass;
      _user.resetToken = undefined;
      _user.ExpToken = undefined;
      return _user.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
