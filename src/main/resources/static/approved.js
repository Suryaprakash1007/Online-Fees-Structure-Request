document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("approvedTable");
  
    async function loadApproved() {
      tableBody.innerHTML = "";
      try {
        const response = await fetchWithAuth("/api/students/approved");
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
            <td>${stu.reason}</td>
            <td>
              <a class="file-link" href="/api/students/${stu.id}/file" target="_blank">View Document</a>
            </td>
          `;
  
          tableBody.appendChild(row);
        });
      } catch (err) {
        console.error("Error loading approved:", err);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Error loading data</td></tr>`;
      }
    }
  
    loadApproved();
  });
  
  function logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "login.html";
  }
