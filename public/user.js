

// File=user.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("input[name='username']").value.trim();
    const password = document.querySelector("input[name='password']").value.trim();

    if (!username || !password) {
      Swal.fire("⚠️ خطا", "لطفاً نام کاربری و رمز عبور را وارد کنید", "error");
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);

        Swal.fire("🎉 خوش‌آمدید", result.message, "success").then(() => {
          window.location.href = "dashboard.html";
        });
      } else {
        Swal.fire("❌ ورود ناموفق", result.message, "error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire("⚠️ خطا", "مشکلی در اتصال به سرور پیش آمده", "error");
    }
  });
});
