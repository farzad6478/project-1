// 📁 File = dashboard.js

window.addEventListener("DOMContentLoaded", () => {
  // 🔐 بررسی اعتبار دسترسی
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("⛔ دسترسی غیرمجاز", "لطفاً ابتدا وارد شوید", "warning").then(() => {
      window.location.href = "user.html";
    });
    return;
  }

  console.log("✅ فایل dashboard.js بارگذاری شد");

  const form = document.getElementById("estateForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      title: document.getElementById("title").value.trim(),
      location: document.getElementById("location").value.trim(),
      price: parseInt(document.getElementById("price").value.trim(), 10),
      description: document.getElementById("description").value.trim()
    };

    console.log("🔄 ارسال فرم با داده‌ها:", formData);

    try {
      const response = await fetch("/api/estate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log("📦 وضعیت پاسخ:", response.status);
      console.log("🧾 پاسخ سرور کامل:", result);

      if (response.ok) {
        Swal.fire("✅ موفقیت", result.message || "ملک با موفقیت ثبت شد", "success");
        form.reset();
      } else {
        Swal.fire("❌ خطا", result.message || "ثبت انجام نشد", "error");
      }
    } catch (error) {
      console.error("❌ خطا در ارسال:", error);
      Swal.fire("⚠️ خطای شبکه", "در اتصال به سرور مشکلی پیش آمده", "error");
    }
  });
});
