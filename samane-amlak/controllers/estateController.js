const Estate = require("../models/Estate");

// 📤 ثبت ملک جدید
exports.createEstate = async (req, res) => {
  try {
    const { title, location, price, description } = req.body;

    const newEstate = new Estate({
      title,
      location,
      price,
      description
    });

    await newEstate.save();
    res.status(201).json({ success: true, message: "✅ ملک با موفقیت ثبت شد" });
  } catch (error) {
    console.error("❌ خطا در ثبت ملک:", error);
    res.status(500).json({ success: false, message: "❌ ثبت انجام نشد" });
  }
};

// 📥 دریافت لیست املاک
exports.getAllEstates = async (req, res) => {
  try {
    const estates = await Estate.find();
    res.json(estates);
  } catch (error) {
    console.error("❌ خطا در دریافت املاک:", error);
    res.status(500).json({ success: false, message: "❌ دریافت اطلاعات انجام نشد" });
  }
};
