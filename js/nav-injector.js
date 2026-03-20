// js/nav-injector.js
document.addEventListener("DOMContentLoaded", async function() {
    const navHTML = `
        <nav style="background: #1e293b; padding: 1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; font-family: sans-serif;">
            <div style="display: flex; align-items: center; gap: 20px;">
                <a href="/members/dashboard.html" style="color: white; text-decoration: none; font-weight: bold; font-size: 1.2rem;">Cognis11</a>
                <a href="/members/dashboard.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Dashboard</a>
            </div>
            <div style="display: flex; gap: 15px; align-items: center;">
                <span id="nav-user" style="color: #64748b; font-size: 0.8rem;"></span>
                <button onclick="logout()" style="background: #dc2626; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Logout</button>
            </div>
        </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    if (window.supabaseClient) {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        if (user) {
            document.getElementById('nav-user').innerText = user.email;
        }
    }
});

async function logout() {
    await window.supabaseClient.auth.signOut();
    window.location.href = "/login.html";
}