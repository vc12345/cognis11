// js/nav-injector.js

function injectNav() {
    const navHTML = `
        <style>
            .cognis-global-nav {
                background: #ffffff !important; 
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
                color: #1B3A5C !important; 
                font-weight: 700;
                text-decoration: none;
                transition: opacity 0.2s;
            }
            .global-nav-brand:hover {
                opacity: 0.8;
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
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .global-nav-logout {
                background: #1B3A5C;
                color: #ffffff;
                padding: 8px 18px;
                border-radius: 5px;
                font-size: 0.85rem;
                font-weight: 600;
                border: none;
                cursor: pointer;
                transition: background 0.2s;
            }
            .global-nav-logout:hover {
                background: #c5a059; /* Cognis Gold on hover */
            }
        </style>
        <nav class="cognis-global-nav">
            <a href="/members/dashboard.html" class="global-nav-brand">Cognis 11+</a>
            
            <div class="global-nav-right">
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
    // Redirect to public index or login
    window.location.href = "/login.html";
}

document.addEventListener('DOMContentLoaded', injectNav);