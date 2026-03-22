// js/module-core.js

async function initModule(moduleId) {
    // 1. GATEKEEPER: Check Auth & Subscription
    if (!window.supabaseClient) {
        // Wait up to 2 seconds for the config to initialize
        let attempts = 0;
        while (!window.supabaseClient && attempts < 20) {
            await new Promise(res => setTimeout(res, 100));
            attempts++;
        }
    }

    if (!window.supabaseClient) {
        console.error("Module Core: supabaseClient failed to load.");
        return;
    }

    const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
    
    // Redirect if not logged in
    if (authError || !user) {
        console.warn("Gatekeeper: No user found. Redirecting...");
        window.location.href = "/login.html"; // Corrected Path
        return;
    }

    // Check Profile
    const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .maybeSingle();

    // Redirect if not active
    if (!profile || profile.subscription_status !== 'active') {
        alert("This module requires an active subscription.");
        window.location.href = "/members/dashboard.html"; // Corrected Path
        return;
    }

    // 2. HEADER: Inject the Module Nav
    injectModuleNav(user.email);

    console.log(`Module ${moduleId} authorized for ${user.email}`);
}

function injectModuleNav(email) {
    const navHTML = `
        <style>
            /* 1. MASTER BRANDING OVERRIDES */
            body { 
                background-color: #FAFAF6 !important; 
                color: #1B3A5C !important;
                font-family: 'DM Sans', sans-serif !important;
            }
            .module-card { 
                max-width: 920px !important; 
                border: 1px solid #E5E3DD !important; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.03) !important;
                background: white !important;
            }

            /* 2. NAVIGATION BAR */
            .cognis-m-nav {
                background: #ffffff !important;
                border-bottom: 1px solid #E5E3DD;
                padding: 12px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            .cognis-m-nav a {
                color: #1B3A5C !important;
                text-decoration: none;
                font-size: 0.85rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .cognis-m-nav .user-tag { font-size: 0.75rem; color: #888; }

            /* 3. THE ENGINE (Dark Logic Center) */
            .simulation-area, .engine-container { 
                background: #1B3A5C !important; 
                color: white !important;
                border-radius: 12px !important;
                border: none !important;
            }
            .trace-log, [id*="trace"], [id*="logic"] { 
                background: rgba(0,0,0,0.25) !important; 
                border-left: 4px solid #c5a059 !important;
                color: #48bb78 !important; /* Terminal Green */
                font-family: 'Consolas', monospace !important;
                font-size: 0.85rem !important;
                line-height: 1.6 !important;
            }

            /* 4. THE SABOTEUR (Phase 4 Face-Off) */
            .saboteur-grid { 
                display: grid !important; 
                grid-template-columns: 1fr 1fr !important; 
                gap: 20px !important; 
                margin-top: 20px !important; 
            }
            
            /* The Trap Panel (Red) */
            .saboteur-panel.trap, .phase:last-of-type div[style*="background: #fff5f5"] { 
                background: #FFF5F5 !important; 
                border: 2px solid #d9534f !important; 
                border-radius: 12px !important;
                padding: 25px !important;
                color: #1B3A5C !important;
            }
            
            /* The Fix Panel (Green) */
            .saboteur-panel.fix, .phase:last-of-type div[style*="background: #f0fff4"] { 
                background: #F0FFF4 !important; 
                border: 2px solid #48bb78 !important; 
                border-radius: 12px !important;
                padding: 25px !important;
                color: #1B3A5C !important;
            }

            .saboteur-panel h3 {
                margin: 0 0 10px 0 !important;
                font-size: 0.75rem !important;
                text-transform: uppercase !important;
                letter-spacing: 0.1em !important;
                font-weight: 800 !important;
            }

            /* 5. THE COMPLETE BUTTON */
            button[onclick*="markComplete"] {
                background: #1B3A5C !important;
                border: none !important;
                border-radius: 6px !important;
                color: white !important;
                padding: 18px 40px !important;
                font-weight: 700 !important;
                font-family: 'DM Sans', sans-serif !important;
                cursor: pointer;
                transition: all 0.2s;
            }
            button[onclick*="markComplete"]:hover {
                background: #2E6DA4 !important;
                transform: translateY(-2px);
            }

            @media (max-width: 600px) {
                .saboteur-grid { grid-template-columns: 1fr !important; }
            }
        </style>
        <nav class="cognis-m-nav">
            <a href="/members/dashboard.html">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Dashboard
            </a>
            <div class="user-tag">${email}</div> 
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

// 3. TRACKER: The "Complete" Function
async function markComplete(moduleId) {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    
    if (!user) return;

    const { error } = await window.supabaseClient
        .from('module_progress')
        .upsert([
            { user_id: user.id, module_id: moduleId }
        ], { onConflict: 'user_id, module_id' }); // Prevents duplicate error if they click twice

    if (error) {
        console.error("Error saving progress:", error);
        alert("There was an error saving your progress. Please try again.");
    } else {
        alert("Progress Saved! ✅");
        window.location.href = "/members/dashboard.html"; // Corrected Path
    }
}