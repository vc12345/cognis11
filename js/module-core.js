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
        <nav class="module-nav" style="background: #0f172a; padding: 1rem; display: flex; justify-content: space-between; align-items: center; color: white; border-bottom: 2px solid #334155; font-family: sans-serif;">
            <div style="display: flex; gap: 20px; align-items: center;">
                <a href="/members/dashboard.html" style="color: #38bdf8; text-decoration: none; font-weight: bold;">← Back to Dashboard</a>
                <span style="color: #334155;">|</span>
                <span style="font-size: 0.9rem; font-weight: 500; color: #94a3b8;">Cognis 11+ Learning System</span>
            </div>
            <div style="font-size: 0.8rem; color: #64748b;">Student: ${email}</div>
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