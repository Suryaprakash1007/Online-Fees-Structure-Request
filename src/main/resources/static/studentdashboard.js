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
    const welcomeEl = document.getElementById("studentWelcome");
    if(welcomeEl) welcomeEl.textContent = `🎓 Welcome, ${student.name}`;
  }

  try {
    const response = await fetchWithAuth(`/api/students/requests/${rollno}`);
    if (!response.ok) {
      console.error("Failed to fetch requests");
      return;
    }

    const requests = await response.json();
    if (requests && requests.length > 0) {
      const tableBody = document.getElementById("studentRequests");
      if(!tableBody) return;
      tableBody.innerHTML = "";

      requests.forEach(req => {
        const row = document.createElement("tr");
        
        let statusBadge = "";
        if (req.status === "APPROVED") {
          statusBadge = `<span class="status-badge status-approved">Approved</span>`;
        } else if (req.status === "REJECTED") {
          statusBadge = `<span class="status-badge status-rejected">Rejected</span>`;
        } else {
          statusBadge = `<span class="status-badge status-pending">Pending</span>`;
        }

        // Format Date (Assuming req.id or createdDate exists. Just using placeholder if no date field)
        const dateStr = req.createdDate ? new Date(req.createdDate).toLocaleDateString() : "Just Now";

        row.innerHTML = `
          <td>${dateStr}</td>
          <td>${req.reason || "-"}</td>
          <td>${req.course} / ${req.department}</td>
          <td>
            <a href="/api/students/${req.id}/file" target="_blank" class="file-link">
               View File
            </a>
          </td>
          <td class="text-right">${statusBadge}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      const tableBody = document.getElementById("studentRequests");
      if(tableBody) tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-gray-500">No requests found. Create a new request to get started.</td></tr>`;
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
