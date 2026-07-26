document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#approvedTable tbody");
  
    async function loadApproved() {
      tableBody.innerHTML = "";
      try {
        const response = await fetch("/api/students/approved");
        if (!response.ok) throw new Error("Failed to fetch approved students");
  
        const students = await response.json();
  
        students.forEach(stu => {
          const row = document.createElement("tr");
  
          row.innerHTML = `
            <td>${stu.id}</td>
            <td>${stu.rollno}</td>
            <td>${stu.name}</td>
            <td>${stu.course}</td>
            <td>${stu.department}</td>
            <td>${stu.year}</td>
            <td>${stu.status}</td>
            <td>
              <a class="file-link" href="/api/students/${stu.id}/file" target="_blank">View</a>
            </td>
          `;
  
          tableBody.appendChild(row);
        });
      } catch (err) {
        console.error("Error loading approved:", err);
        tableBody.innerHTML = `<tr><td colspan="8">Error loading data</td></tr>`;
      }
    }
  
    loadApproved();
  });
  
  document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  
