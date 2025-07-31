
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("estateForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const estateData = {
      title: form.title.value,
      location: form.location.value,
      price: form.price.value,
      description: form.description.value
    };

    try {
      const response = await fetch("http://localhost:3000/api/add-estate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estateData)
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "✅ ثبت شد!",
          text: "اطلاعات ملک با موفقیت ذخیره شد",
        });
        form.reset();
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "❌ خطا!",
          text: errorData.message || "ثبت اطلاعات انجام نشد",
        });
      }
    } catch (error) {
      console.error("❌ خطای ارتباط:", error);
      Swal.fire({
        icon: "warning",
        title: "خطای سرور",
        text: "اتصال به سرور برقرار نشد",
      });
    }
  });
});
