function setMembership(name, monthsActive) {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + monthsActive);
    
    const sessionData = {
        userName: name,
        expiryDate: expiry.toISOString()
    };
    
    localStorage.setItem('cognis_session', JSON.stringify(sessionData));
    window.location.href = "/members/dashboard.html"; 
}
