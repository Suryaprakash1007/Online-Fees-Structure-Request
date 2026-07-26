document.getElementById("createUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const user = {
      rollno: document.getElementById("rollno").value,
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      department: document.getElementById("department").value,
      year: document.getElementById("year").value,
      course: document.getElementById("course").value,
      role: document.getElementById("role").value
    };
  
    try {
      const response = await fetchWithAuth("/api/ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
  
      if (response.ok) {
        alert("User created successfully!");
        document.getElementById("createUserForm").reset();
      } else {
        alert("Failed to create user.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
    }
  });
  
