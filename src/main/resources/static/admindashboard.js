async function loadDashboardCounts() {
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        fetchWithAuth("/api/students/pending"),
        fetchWithAuth("/api/students/approved"),
        fetchWithAuth("/api/students/rejected")
      ]);
  
      const pending = await pendingRes.json();
      const approved = await approvedRes.json();
      const rejected = await rejectedRes.json();
      
      const totalStudents = pending.length + approved.length + rejected.length;
  
      // Animate numbers counting up for premium feel
      animateValue("pendingRequestsCount", 0, pending.length, 1000);
      animateValue("approvedRequestsCount", 0, approved.length, 1000);
      animateValue("rejectedRequestsCount", 0, rejected.length, 1000);
      animateValue("totalStudentsCount", 0, totalStudents, 1000);
      
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
}

// Function to animate numbers counting up
function animateValue(id, start, end, duration) {
    if (start === end) {
        document.getElementById(id).innerText = end;
        return;
    }
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let obj = document.getElementById(id);
    let timer = setInterval(function() {
        current += increment;
        obj.innerText = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

loadDashboardCounts();

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "login.html";
}
