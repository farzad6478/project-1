const express = require("express");
const router = express.Router();
const { createEstate, getAllEstates } = require("../controllers/estateController");
const authenticateToken = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// 📥 ثبت ملک جدید - فقط با توکن معتبر و اعتبارسنجی ورودی
router.post(
  "/add-estate",
  authenticateToken,
  [
    body("title").notEmpty().withMessage("عنوان ملک الزامی است"),
    body("price").isNumeric().withMessage("قیمت باید عدد باشد"),
    body("location").notEmpty().withMessage("موقعیت الزامی است"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ ثبت ملک جدید توسط:", req.user.username); // لاگ‌گیری ساده
    createEstate(req, res, next);
  }
);

// 📤 دریافت لیست املاک
router.get("/estates", getAllEstates);

module.exports = router;
