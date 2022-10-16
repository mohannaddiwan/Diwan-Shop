const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const userRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");
const accuntsRouter = require("./routes/accunts");
const User = require("./model/user");
const mongoose = require("mongoose");
require("dotenv").config();

const cookieParser = require("cookie-parser");

//----- for saving data in server (savin data of admin in server)
const session = require("express-session");
//-----{ for saving in database

const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb+srv://mohannaddiwan:mongodb@nodeblog.6k24q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  collection: "storeSession",
});
//----- for saving in database }
const multer = require("multer"); // uoloading file

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // the file will be saving in this path
    cb(null, "./public/img/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});

//---{ Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage }).array("image", 10));
app.use(express.static("node_modules"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({
    secret: "User", // Encryption key
    resave: false,
    saveUninitialized: false,
    cookie: {
      //  session End Time
      maxAge: 3600000,
    },
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById({ _id: req.session.user._id })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(userRouter);
app.use(adminRouter);
app.use(accuntsRouter);

//--- Middleware }
app.set("views", "./views");

app.set("view engine", "pug");
const PORT = process.env.PORT || 3000;
mongoose
  .connect(
    "mongodb+srv://mohannaddiwan:mongodb@nodeblog.6k24q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
