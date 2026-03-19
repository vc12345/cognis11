// js/auth-system.js

const VALID_KEYS = {
    "COG-7721-XJ9": { name: "Scholar 001", expiry: "2027-01-01" },
    "COG-1102-BK4": { name: "Scholar 002", expiry: "2027-01-01" },
    "COG-5590-LQ2": { name: "Scholar 003", expiry: "2027-01-01" },
    "COG-3312-PW8": { name: "Scholar 004", expiry: "2027-01-01" },
    "COG-8821-ZM3": { name: "Scholar 005", expiry: "2027-01-01" },
    "COG-4409-RT7": { name: "Scholar 006", expiry: "2027-01-01" },
    "COG-1298-VB1": { name: "Scholar 007", expiry: "2027-01-01" },
    "COG-6673-ND5": { name: "Scholar 008", expiry: "2027-01-01" },
    "COG-9021-HY6": { name: "Scholar 009", expiry: "2027-01-01" },
    "COG-3345-KS2": { name: "Scholar 010", expiry: "2027-01-01" },
    "ADMIN": { name: "Admin", expiry: "2027-01-01" }
    // More keys can be added here
};

function handleLogin() {
    const keyInput = document.getElementById('access-key').value.trim().toUpperCase();
    const errorMsg = document.getElementById('error-msg');
    
    if (VALID_KEYS[keyInput]) {
        const userData = VALID_KEYS[keyInput];
        
        const sessionData = {
            userName: userData.name,
            expiryDate: new Date(userData.expiry).toISOString(),
            keyUsed: keyInput
        };
        
        localStorage.setItem('cognis_session', JSON.stringify(sessionData));
        
        // Success! Go to the dashboard
        window.location.href = "members/dashboard.html";
    } else {
        // Show the error message
        errorMsg.style.display = 'block';
    }
}
