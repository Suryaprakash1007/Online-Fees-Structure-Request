// fetchWithAuth.js
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return Promise.reject("No token found");
    }

    if (!options.headers) {
        options.headers = {};
    }
    
    // Check if body is FormData. If it is, DO NOT set Content-Type, let the browser set it with boundary
    // But we still need to set Authorization
    options.headers["Authorization"] = "Bearer " + token;

    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("student");
        localStorage.removeItem("admin");
        window.location.href = "login.html";
        return Promise.reject("Unauthorized");
    }

    return response;
}
