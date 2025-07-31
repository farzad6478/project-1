
// File=server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const User = require("./models/User");
const Estate = require("./models/Estate");
const estateRoutes = require("./routes/estateRoutes");

const app = express();

// تنظیمات محیطی
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET;

// Middlewareها
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔐 بررسی توکن برای مسیرهای محافظت‌شده
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ success: false, message: "توکن ارسال نشده" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "توکن معتبر نیست" });
  }
};

// 📥 ثبت ملک (با احراز هویت)
app.post("/api/estate", verifyToken, async (req, res) => {
  try {
    const newEstate = new Estate(req.body);
    await newEstate.save();
    res.status(201).json({ success: true, message: "ملک با موفقیت ثبت شد", estate: newEstate });
  } catch (error) {
    console.error("❌ خطا در ثبت ملک:", error);
    res.status(500).json({ success: false, message: "خطای سرور" });
  }
});

// 🧭 مسیرهای عمومی
app.use("/api", estateRoutes);

// 🌐 اتصال به پایگاه داده
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ اتصال به MongoDB برقرار شد"))
  .catch((err) => console.error("❌ خطا در اتصال:", err));

// 🔑 سیستم ورود کاربر
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "کاربر پیدا نشد" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "رمز عبور اشتباه است" });
    }

    // ایجاد JWT
    const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ success: true, message: `خوش آمدی ${user.username}!`, token });
  } catch (error) {
    console.error("❌ خطا در ورود:", error);
    res.status(500).json({ success: false, message: "خطای سرور" });
  }
});

// 🧪 تغییر رمز عبور برای تست
const updateUserPassword = async () => {
  try {
    const user = await User.findOne({ username: "09353410301" });
    if (user) {
      const newPassword = "NewStrongPassword123!";
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();
      console.log("✅ رمز عبور جدید با موفقیت اعمال شد");
    } else {
      console.log("❌ کاربر یافت نشد. ابتدا باید ثبت شود");
    }
  } catch (err) {
    console.error("❌ خطا در تغییر رمز عبور:", err);
  }
};
updateUserPassword(); // فقط تستی

// 🎯 پاسخ برای صفحه اصلی و تست
app.get("/", (req, res) => {
  res.send("🌟 سرور سامانه معاملات ملکی فعال است!");
});

app.get("/api/ping", (req, res) => {
  res.json({ message: "سلام از سمت سرور!" });
});

// 🚀 راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`🚀 سرور در حال اجرا روی http://localhost:${PORT}`);
});
console.log("📡 مقدار URI دیتابیس:", process.env.MONGO_URI);
