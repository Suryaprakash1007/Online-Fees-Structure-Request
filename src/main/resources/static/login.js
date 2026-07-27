let isOtpStep = false;
let currentAdminUsername = "";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const otpInput = document.getElementById("otp");
  const loginBtn = document.getElementById("loginBtn");
  const error = document.getElementById("error");

  error.textContent = "";

  try {
    // Handling OTP Verification Step (Admin only)
    if (isOtpStep && role === "admin") {
      const response = await fetch("/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentAdminUsername, otp: otpInput.value }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        error.textContent = errorData.error || "Invalid OTP or OTP Expired. Try again.";
        return;
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data));
        window.location.href = "admindashboard.html";
      }
      return;
    }

    // Initial Login Step
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

    // If OTP is required (Admin 2FA)
    if (data.requireOtp === "true") {
      isOtpStep = true;
      currentAdminUsername = username;
      
      // Hide username/password/role labels too if they are wrapped, but since we didn't wrap them with IDs, we'll just hide the selects
      document.getElementById("username").style.display = "none";
      document.getElementById("password").style.display = "none";
      document.getElementById("role").style.display = "none";
      
      const otpContainer = document.getElementById("otpContainer");
      if(otpContainer) otpContainer.classList.remove("hidden");
      
      otpInput.setAttribute("required", "true");
      
      loginBtn.innerHTML = `<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><span class="relative z-10">Verify OTP</span>`;
      
      error.style.color = "#3b82f6"; // brand color instead of cyan
      error.textContent = "OTP has been sent to your email!";
      return;
    }

    // Standard Login (Student)
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (role === "student") {
      localStorage.setItem("student", JSON.stringify(data.student));
      window.location.href = "studentdashboard.html";
    }
    
  } catch (err) {
    error.textContent = "Server error. Please try later.";
    console.error(err);
  }
});

document.getElementById("role").addEventListener("change", (e) => {
  // Reset UI if they change role mid-way
  isOtpStep = false;
  document.getElementById("username").style.display = "block";
  document.getElementById("password").style.display = "block";
  const otpContainer = document.getElementById("otpContainer");
  if(otpContainer) otpContainer.classList.add("hidden");
  document.getElementById("otp").removeAttribute("required");
  document.getElementById("loginBtn").innerHTML = `<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><span class="relative z-10">Sign In</span>`;
  document.getElementById("error").textContent = "";
});

document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});
