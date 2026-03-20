// js/nav-injector.js

function injectNav() {
    const navHTML = `
        <style>
            .cognis-global-nav {
                background: #ffffff;
                border-bottom: 1px solid #E5E3DD;
                padding: 14px 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: sticky;
                top: 0;
                z-index: 1000;
                font-family: 'DM Sans', sans-serif;
            }
            .global-nav-brand {
                font-family: 'Playfair Display', serif;
                font-size: 1.1rem;
                color: #1B3A5C;
                font-weight: 700;
                text-decoration: none;
                letter-spacing: -0.01em;
            }
            .global-nav-right {
                display: flex;
                align-items: center;
                gap: 24px;
            }
            .global-nav-link {
                text-decoration: none;
                color: #1B3A5C;
                font-size: 0.85rem;
                font-weight: 500;
                transition: color 0.15s;
            }
            .global-nav-link:hover {
                color: #2E6DA4;
            }
            .global-nav-logout {
                background: #1B3A5C;
                color: #ffffff;
                padding: 8px 18px;
                border-radius: 5px;
                text-decoration: none;
                font-size: 0.85rem;
                font-weight: 600;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
            }
            .global-nav-logout:hover {
                background: #2E6DA4;
            }
        </style>
        <nav class="cognis-global-nav">
            <a href="/index.html" class="global-nav-brand">Cognis 11+</a>
            <div class="global-nav-right">
                <a href="/members/dashboard.html" class="global-nav-link">Dashboard</a>
                <a href="/members/account.html" class="global-nav-link">Account</a>
                <button onclick="handleLogout()" class="global-nav-logout">Logout</button>
            </div>
        </nav>
    `;
    
    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.innerHTML = navHTML;
    }
}

async function handleLogout() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    window.location.href = "/login.html";
}

// Ensure it runs once the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
} else {
    injectNav();
}