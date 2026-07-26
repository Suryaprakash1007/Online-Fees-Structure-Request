async function fetchPendingStudents() {
    try {
      const response = await fetchWithAuth("/api/students/pending");
      const students = await response.json();
  
      const tbody = document.querySelector("#studentTable tbody");
      tbody.innerHTML = "";
  
      students.forEach(student => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${student.rollno}</td>
          <td>${student.name}</td>
          <td>${student.department}</td>
          <td>${student.year}</td>
          <td>${student.course}</td>
          <td>${student.email}</td>
          <td>${student.reason}</td>
          <td><a href="/api/students/${student.id}/file" target="_blank">View</a></td>
          <td>
            <button class="approve" onclick="updateStatus(${student.id}, 'APPROVED')">Approve</button>
            <button class="reject" onclick="updateStatus(${student.id}, 'REJECTED')">Reject</button>
          </td>
        `;
  
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching pending students:", error);
    }
  }
  
  async function updateStatus(id, status) {
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
  async function rejectStudent(id) {
    if (confirm("Reject this student?")) {
      try {
        const res = await fetchWithAuth(`/api/students/rejected/`, {
          method: "PUT"
        });
        if (res.ok) {
          alert("Rejected! Email sent to student.");
          loadPending();
        } else {
          alert("Failed to reject.");
        }
      } catch (err) {
        console.error("Error rejecting student:", err);
      }
    }
  }
  async function approveStudent(id) {
    if (confirm("Approve this student?")) {
      try {
        const res = await fetchWithAuth(`/api/students/approved`, {
          method: "PUT"
        });
        if (res.ok) {
          alert("Approved! PDF sent to student.");
          loadPending();
        } else {
          alert("Failed to approve.");
        }
      } catch (err) {
        console.error("Error approving student:", err);
      }
    }
  }  
  // Load pending students on page load
  fetchPendingStudents();
