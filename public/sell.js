window.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ فایل sell.js بارگذاری شد");

  const estateList = document.getElementById("estateList");

  try {
    const response = await fetch("/api/estates");
    const estates = await response.json();

    if (!estates.length) {
      estateList.innerHTML = "<p>هیچ ملکی ثبت نشده است.</p>";
      return;
    }

    estateList.innerHTML = estates.map(estate => `
      <div class="estate-card">
        <h3>🏠 ${estate.title}</h3>
        <p><strong>📍 موقعیت:</strong> ${estate.location}</p>
        <p><strong>💰 قیمت:</strong> ${estate.price}</p>
        <p><strong>📝 توضیحات:</strong> ${estate.description}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error("❌ خطا در دریافت اطلاعات:", error);
    estateList.innerHTML = "<p>خطا در بارگذاری اطلاعات.</p>";
  }
});