// ✅ Load all users
async function loadUsers() {
  try {
    const response = await fetchWithAuth("/api/details");
    const users = await response.json();

    const tableBody = document.querySelector("#usersTable tbody");
    tableBody.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.rollno}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.department}</td>
        <td>${user.year}</td>
        <td>${user.course}</td>
        <td>${user.role}</td>
        <td>
          <button onclick="deleteUser(${user.id})" class="delete-btn">Delete</button>
          <button onclick="editUser(this, ${user.id})" class="edit-btn">Edit</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading users:", err);
  }
}

// ✅ Edit user inline
function editUser(button, id) {
  const row = button.closest("tr");
  const cells = row.querySelectorAll("td");

  // Save original HTML for cancel
  row.dataset.original = row.innerHTML;

  const rollno = cells[1].innerText;
  const name = cells[2].innerText;
  const email = cells[3].innerText;
  const dept = cells[4].innerText;
  const year = cells[5].innerText;
  const course = cells[6].innerText;
  const role = cells[7].innerText;

  // Add highlight
  row.style.backgroundColor = "lightyellow";

  // Replace text with inputs
  cells[1].innerHTML = `<input value="${rollno}" />`;
  cells[2].innerHTML = `<input value="${name}" />`;
  cells[3].innerHTML = `<input value="${email}" />`;
  cells[4].innerHTML = `<input value="${dept}" />`;
  cells[5].innerHTML = `<input value="${year}" />`;
  cells[6].innerHTML = `<input value="${course}" />`;
  cells[7].innerHTML = `
    <select>
      <option value="student" ${role === "student" ? "selected" : ""}>Student</option>
      <option value="admin" ${role === "admin" ? "selected" : ""}>Admin</option>
    </select>
  `;

  // Action buttons → Save + Cancel
  cells[8].innerHTML = `
    <button onclick="saveUser(this.closest('tr'), ${id})" class="save-btn">Save</button>
    <button onclick="cancelRowEdit(this.closest('tr'))" class="cancel-btn">Cancel</button>
  `;
}

// ✅ Save updated user
async function saveUser(row, id) {
  const inputs = row.querySelectorAll("input, select");

  const updatedUser = {
    rollno: inputs[0].value,
    name: inputs[1].value,
    email: inputs[2].value,
    department: inputs[3].value,
    year: inputs[4].value,
    course: inputs[5].value,
    role: inputs[6].value, // default or handle properly
  };

  try {
    await fetchWithAuth(`/api/updatedstudent/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    });
    await loadUsers();
  } catch (err) {
    console.error("Error saving user:", err);
  }
}

// ✅ Cancel editing (restore old row)
function cancelRowEdit(row) {
  row.innerHTML = row.dataset.original;
  row.style.backgroundColor = ""; // remove highlight
}

// ✅ Delete user
async function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await fetchWithAuth(`/api/${id}/del`, { method: "DELETE" });
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }
}

// ✅ Search filter
function filterUsers() {
  const input = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#usersTable tbody tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

// Load users on page start
loadUsers();
