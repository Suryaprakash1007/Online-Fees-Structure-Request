document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const rollnoInput = document.getElementById("rollno");

  // Fetch student info when rollno loses focus
  rollnoInput.addEventListener("blur", async () => {
    const rollno = rollnoInput.value.trim();
    if (!rollno) return;

    try {
      const res = await fetchWithAuth(`/api/rollno/${rollno}`);
      if (!res.ok) {
        alert("Student not found!");
        studentForm.reset();
        return;
      }

      const student = await res.json();
      document.getElementById("name").value = student.name || "";
      document.getElementById("email").value = student.email || "";
      document.getElementById("department").value = student.department || "";
      document.getElementById("year").value = student.year || "";
      document.getElementById("course").value = student.course || "";
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  });

  // Handle form submission (file upload)
  studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(studentForm);

    try {
      const res = await fetchWithAuth("/api/students/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        alert("Request submitted successfully!");
        studentForm.reset();
      } else {
        alert("Upload failed!");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  });
});
