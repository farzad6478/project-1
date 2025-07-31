
const images = [
  "img-des/1.jpg",
  "img-des/2.jpg",
  "img-des/3.jpg",
  "img-des/4.jpg",
  "img-des/5.jpg",
  
  // تا 30 عکس ادامه بده
];

let currentIndex = 0;
const sliderImage = document.getElementById("sliderImage");

setInterval(() => {
  currentIndex = (currentIndex + 1) % images.length;
  sliderImage.src = images[currentIndex];
}, 2000); // هر 3 ثانیه تصویر بعدی


// -----------------------------------------------------------------------------------------------------------
// قسمت مربط به سرچ است برای جستجوی منطقه مهرشهر و یا ارم
document.getElementById("searchBtn").addEventListener("click", function () {
  const area = document.getElementById("areaSelect").value;
  const keyword = document.getElementById("customSearch").value;

  let resultText = "🔎 جستجو برای ";
  if (area) resultText += `"${area}"`;
  if (keyword) resultText += ` + "${keyword}"`;

  alert(resultText); // می‌تونیم به صفحه نتایج وصلش کنیم
});
// ---------------------------------------------------------------------------------------------------
document.getElementById("estateForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this).entries());

  fetch("http://localhost:3000/add-estate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.ok ? alert("✅ ثبت موفق!") : alert("❌ خطا!"))
  .catch(err => alert("❌ ارتباط با سرور برقرار نشد."));
});

// ------------------------------------------------------------------------------------
function loadEstates() {
  fetch("http://localhost:3000/estates")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("estateList");
      list.innerHTML = "<h3>📋 لیست املاک ثبت‌شده:</h3>";

      if (data.length === 0) {
        list.innerHTML += "<p>هیچ ملکی ثبت نشده است.</p>";
        return;
      }

      data.forEach(item => {
        list.innerHTML += `
          <div style="border:1px solid #ccc; padding:10px; margin:10px; border-radius:8px;">
            <strong>🏠 ${item.title}</strong><br>
            📍 موقعیت: ${item.location} <br>
            💰 قیمت: ${item.price} تومان <br>
            ✏️ توضیحات: ${item.description || "ندارد"}
          </div>
        `;
      });
    })
    .catch(err => console.error("❌ خطا در دریافت املاک:", err));
}
// -----------------------------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", loadEstates);
// ---------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {
  const estateList = document.getElementById("estateList");
  const searchInput = document.getElementById("customSearch");
  const areaSelect = document.getElementById("areaSelect");
  const searchBtn = document.getElementById("searchBtn");

  let estates = [];

  try {
    const res = await fetch("http://localhost:3000/api/estates");
    estates = await res.json();
    renderEstates(estates);
  } catch (error) {
    console.error("❌ خطا در دریافت املاک:", error);
    estateList.innerHTML = "<p>خطا در دریافت اطلاعات.</p>";
  }

  function renderEstates(list) {
    estateList.innerHTML = list.map(estate => `
      <div class="estate-card">
        <h3>🏠 ${estate.title}</h3>
        <p><strong>📍 موقعیت:</strong> ${estate.location}</p>
        <p><strong>💰 قیمت:</strong> ${estate.price}</p>
        <p><strong>📝 توضیحات:</strong> ${estate.description}</p>
      </div>
    `).join('');
  }

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedArea = areaSelect.value;

    const filtered = estates.filter(estate =>
      (selectedArea === "" || estate.location.includes(selectedArea)) &&
      (keyword === "" || estate.price.toString().includes(keyword))
    );

    renderEstates(filtered);
  });
});

