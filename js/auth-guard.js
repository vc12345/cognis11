// js/auth-guard.js
(function() {
    const session = JSON.parse(localStorage.getItem('cognis_session'));
    const now = new Date();

    if (!session || new Date(session.expiryDate) < now) {
        alert("Session expired or unauthorized. Redirecting to home.");
        window.location.href = "/index.html"; // Adjust to your landing page
    } else {
        console.log(`Welcome back, ${session.userName}. Access granted.`);
    }
})();
