document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.textContent = "";

  try {
    let response;

    if (role === "admin") {
      response = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    } else if (role === "student") {
      response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollno: username, password }),
      });
    }

    if (!response.ok) {
      error.textContent = "Invalid credentials. Try again.";
      return;
    }

    const data = await response.json();
    console.log("Login API response:", data);

    if (role === "student") {
      // ✅ Save the full student object
      localStorage.setItem("student", JSON.stringify(data));
      window.location.href = "studentdashboard.html";
    } else if (role === "admin") {
      localStorage.setItem("admin", JSON.stringify(data));
      window.location.href = "admindashboard.html";
    }
  } catch (err) {
    error.textContent = "Server error. Please try later.";
    console.error(err);
  }
});
document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});
