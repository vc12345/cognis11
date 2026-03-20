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
                background: #fff;
                border-bottom: 1px solid #E5E3DD;
                padding: 15px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'DM Sans', sans-serif;
                position: sticky;
                top: 0;
                z-index: 100;
            }
            .cognis-m-nav a {
                color: #1B3A5C;
                text-decoration: none;
                font-size: 0.85rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .cognis-m-nav .student-tag {
                font-size: 0.7rem;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            /* Global Module Style Override to match Subscribe page */
            body { background-color: #FAFAF6 !important; }
            .module-card { border: 1px solid #E5E3DD !important; box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important; }
            .header { background: #1B3A5C !important; border-bottom: 4px solid #2E6DA4 !important; }
        </style>
        <nav class="cognis-m-nav">
            <a href="/members/dashboard.html">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Dashboard
            </a>
            <div class="student-tag">Scholar: ${email}</div>
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