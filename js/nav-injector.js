// js/nav-injector.js
document.addEventListener("DOMContentLoaded", async function() {
    const navHTML = `
        <nav style="background: #1e293b; padding: 1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; font-family: sans-serif;">
            <div style="display: flex; align-items: center; gap: 20px;">
                <a href="/members/dashboard.html" style="color: white; text-decoration: none; font-weight: bold; font-size: 1.2rem;">Cognis11</a>
                <a href="/members/dashboard.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Dashboard</a>
                <a href="/diagnostic" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Diagnostic</a>
            </div>
            <div style="display: flex; gap: 15px; align-items: center;">
                <span id="nav-user" style="color: #64748b; font-size: 0.8rem;"></span>
                <button onclick="logout()" style="background: #dc2626; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Logout</button>
            </div>
        </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Fetch user from Supabase instead of localStorage
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // We'll use the email as the display name for now, 
        // or pull from the 'profiles' table later
        document.getElementById('nav-user').innerText = user.email;
    }
});

// Logic to save progress to Supabase
async function markModuleComplete(moduleId) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("Please log in to save progress.");
        return;
    }

    // 1. Check if already marked complete to prevent duplicates
    const { data: existing } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();

    if (existing) {
        alert("You have already completed this module!");
        window.location.href = "/members/dashboard.html";
        return;
    }

    // 2. Insert new completion record
    const { error } = await supabase
        .from('module_progress')
        .insert([{ user_id: user.id, module_id: moduleId }]);

    if (error) {
        console.error("Error saving progress:", error);
        alert("System error: Could not sync progress.");
    } else {
        window.location.href = "/members/dashboard.html";
    }
}

// Supabase-powered Logout
async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('cognis_session'); // Clean up old MVP data
    window.location.href = "/login.html";
}
