// studentdashboard.js

document.addEventListener("DOMContentLoaded", async () => {
  const studentData = localStorage.getItem("student");
  if (!studentData) {
    window.location.href = "login.html";
    return;
  }
  
  const student = JSON.parse(studentData);
  const rollno = student.rollno;
  
  // Update welcome message if name exists
  if (student.name) {
    document.querySelector("h1").textContent = `🎓 Welcome, ${student.name}`;
  }

  try {
    const response = await fetchWithAuth(`/api/students/requests/${rollno}`);
    if (!response.ok) {
      console.error("Failed to fetch requests");
      return;
    }

    const requests = await response.json();
    if (requests && requests.length > 0) {
      document.getElementById("requestsSection").style.display = "block";
      const tableBody = document.getElementById("requestTable");
      tableBody.innerHTML = "";

      requests.forEach(req => {
        const row = document.createElement("tr");
        
        let statusBadge = "";
        if (req.status === "APPROVED") {
          statusBadge = `<span class="badge badge-success">Approved</span>`;
        } else if (req.status === "REJECTED") {
          statusBadge = `<span class="badge badge-danger">Rejected</span>`;
        } else {
          statusBadge = `<span class="badge badge-warning">Pending</span>`;
        }

        row.innerHTML = `
          <td>${req.id}</td>
          <td>${req.course}</td>
          <td>${req.department}</td>
          <td>${statusBadge}</td>
          <td>
            <a href="/api/students/${req.id}/file" target="_blank" class="btn btn-secondary">
               View File
            </a>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (err) {
    console.error("Error loading requests:", err);
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("student");
  window.location.href = "login.html";
}
