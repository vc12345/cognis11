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
            .cognis-m-nav {
                background: #ffffff !important; /* Changed from black to white */
                border-bottom: 1px solid #E5E3DD;
                padding: 12px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'DM Sans', sans-serif;
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
            .cognis-m-nav .user-tag {
                font-size: 0.75rem;
                color: #888;
                font-weight: 400;
            }
            /* Clean up module background */
            body { background-color: #FAFAF6 !important; margin: 0; }
        </style>
        <nav class="cognis-m-nav">
            <a href="/members/dashboard.html">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Dashboard
            </a>
            <div class="user-tag">${email}</div> 
        </nav>
    `;
    // Note: "Scholar" text has been removed above
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