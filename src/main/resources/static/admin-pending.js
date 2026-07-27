async function fetchPendingStudents() {
    try {
      const response = await fetchWithAuth("/api/students/pending");
      const students = await response.json();
  
      const tbody = document.getElementById("pendingTable");
      if (!tbody) return;
      
      tbody.innerHTML = "";
  
      students.forEach(student => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${student.id}</td>
          <td>${student.rollno}</td>
          <td>${student.name}</td>
          <td>${student.course}</td>
          <td>${student.department}</td>
          <td>${student.reason}</td>
          <td><a class="file-link" href="/api/students/${student.id}/file" target="_blank">View Document</a></td>
          <td class="text-center">
            <button class="btn-action btn-approve" onclick="updateStatus(${student.id}, 'APPROVED')">Approve</button>
            <button class="btn-action btn-reject" onclick="updateStatus(${student.id}, 'REJECTED')">Reject</button>
          </td>
        `;
  
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching pending students:", error);
    }
  }
  
  async function updateStatus(id, status) {
    if(!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;

    try {
      const response = await fetchWithAuth(`/api/students/${id}/status/email?status=${status}`, {
        method: "PUT"
      });
  
      if (response.ok) {
        document.getElementById("message").textContent = `✅ Student ${status.toLowerCase()} successfully!`;
        fetchPendingStudents(); // refresh table
      } else {
        document.getElementById("message").textContent = "❌ Failed to update status.";
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  // Load pending students on page load
  document.addEventListener("DOMContentLoaded", fetchPendingStudents);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "login.html";
  }
