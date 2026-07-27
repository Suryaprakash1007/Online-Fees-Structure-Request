document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("uploadForm");
    if (!studentForm) return;

    // Load student data from local storage
    const studentDataStr = localStorage.getItem("student");
    if (!studentDataStr) {
        window.location.href = "login.html";
        return;
    }

    const studentData = JSON.parse(studentDataStr);
    
    // Auto-fill form fields
    const nameInput = document.getElementById("name");
    const rollnoInput = document.getElementById("rollno");
    const emailInput = document.getElementById("email");
    const departmentInput = document.getElementById("department");
    const yearInput = document.getElementById("year");
    const courseInput = document.getElementById("course");

    if(nameInput) nameInput.value = studentData.name || "";
    if(rollnoInput) rollnoInput.value = studentData.rollno || "";
    if(emailInput) emailInput.value = studentData.email || "";
    if(departmentInput && studentData.department) departmentInput.value = studentData.department;
    if(yearInput && studentData.year) yearInput.value = studentData.year;
    if(courseInput && studentData.course) courseInput.value = studentData.course;

    // Handle form submission (file upload)
    studentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = studentForm.querySelector('button[type="submit"]');
      if(submitBtn) {
          submitBtn.innerHTML = `<span class="relative z-10">Uploading...</span>`;
          submitBtn.disabled = true;
      }
  
      const formData = new FormData(studentForm);
  
      try {
        const res = await fetchWithAuth("/api/students/upload", {
          method: "POST",
          body: formData
        });
  
        if (res.ok) {
          document.getElementById("message").textContent = "✅ Request submitted successfully!";
          document.getElementById("message").className = "text-center font-bold mt-4 min-h-[24px] text-sm text-green-600";
          
          setTimeout(() => {
              window.location.href = "studentdashboard.html";
          }, 1500);
        } else {
          document.getElementById("message").textContent = "❌ Upload failed. Please try again.";
          document.getElementById("message").className = "text-center font-bold mt-4 min-h-[24px] text-sm text-red-500";
          if(submitBtn) {
              submitBtn.innerHTML = `<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><span class="relative z-10">Submit Request</span>`;
              submitBtn.disabled = false;
          }
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        document.getElementById("message").textContent = "❌ Server error occurred.";
        document.getElementById("message").className = "text-center font-bold mt-4 min-h-[24px] text-sm text-red-500";
        if(submitBtn) {
            submitBtn.innerHTML = `<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><span class="relative z-10">Submit Request</span>`;
            submitBtn.disabled = false;
        }
      }
    });
  });
