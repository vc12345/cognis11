// js/module-core.js

async function initModule(moduleId) {
    // 1. GATEKEEPER: Check Auth & Subscription
    if (!window.supabaseClient) {
        await new Promise(res => setTimeout(res, 500)); // Wait for config
    }

    const { data: { user } } = await window.supabaseClient.auth.getUser();
    
    if (!user) {
        window.location.href = "/cognis11/login.html";
        return;
    }

    const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

    if (!profile || profile.subscription_status !== 'active') {
        alert("This module requires an active subscription.");
        window.location.href = "/cognis11/members/dashboard.html";
        return;
    }

    // 2. HEADER: Inject the Module Nav
    injectModuleNav(user.email);

    console.log(`Module ${moduleId} initialized for ${user.email}`);
}

function injectModuleNav(email) {
    const navHTML = `
        <nav class="module-nav" style="background: #0f172a; padding: 1rem; display: flex; justify-content: space-between; align-items: center; color: white; border-bottom: 2px solid #334155;">
            <div style="display: flex; gap: 20px; align-items: center;">
                <a href="/cognis11/members/dashboard.html" style="color: #38bdf8; text-decoration: none; font-weight: bold;">← Back to Dashboard</a>
                <span style="color: #64748b;">|</span>
                <span style="font-size: 0.9rem; font-weight: 500;">Cognis 11+ Learning System</span>
            </div>
            <div style="font-size: 0.8rem; color: #94a3b8;">Student: ${email}</div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

// 3. TRACKER: The "Complete" Function
async function markComplete(moduleId) {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    
    const { error } = await window.supabaseClient
        .from('module_progress')
        .insert([{ user_id: user.id, module_id: moduleId }]);

    if (error) {
        console.error("Error saving progress:", error);
    } else {
        alert("Progress Saved! ✅");
        window.location.href = "/cognis11/members/dashboard.html";
    }
}