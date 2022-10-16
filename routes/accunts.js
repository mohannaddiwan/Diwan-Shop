const express = require("express");
const router = express.Router();
const check = require("express-validator").check;

const accuntsController = require("../controllers/accunts");

router.get("/login", accuntsController.getLogIn);

router.post(
  "/login",
  check("email").not().isEmpty().withMessage("Email Should be Not Empty"),
  check("password")
    .isLength({ min: 1 })
    .withMessage("Password Should Be more than 5 characters "),
  accuntsController.postLogIn
);

router.get("/signup", accuntsController.getSignUp);

router.post(
  "/signupConfirm",
  check("name").not().isEmpty().withMessage("UserName Should Be Not Empty"),
  check("email").not().isEmpty().withMessage("Email Should be Not Empty"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password Should Be more than 5 characters "),
  check("ConfirmPassword").custom((value, { req }) => {
    // custom function take 2 parameter first parameter value second parameter meta {is object} we used {because we will use req only}
    if (value === req.body.password) return true;
    else throw "Passwords Not Equals";
  }),
  accuntsController.postConfirmSignUp
);
router.get("/signupConfirm/Confirm", accuntsController.getConfirmSignUp);
router.post(
  "/signup",
  check("email").not().isEmpty().withMessage("Email Should be Not Empty"),
  accuntsController.postSignUp
);
router.get("/logout", accuntsController.getLogout);
router.get("/reset-password", accuntsController.getResetPassword);
router.post("/reset-password", accuntsController.postResetPassword);
router.get("/reset-password/:Token", accuntsController.getNewPassword);
router.post("/new-password", accuntsController.postNewPass);

module.exports = router;
