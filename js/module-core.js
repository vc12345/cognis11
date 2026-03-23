// js/module-core.js

async function initModule(moduleId) {
    // 1. GATEKEEPER: Check Auth & Subscription
    if (!window.supabaseClient) {
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
        window.location.href = "/login.html";
        return;
    }

    // 2. FETCH PROFILE
    const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', user.id)
        .maybeSingle();

    // Block if not active
    if (!profile || profile.subscription_status !== 'active') {
        alert("This module requires an active subscription.");
        window.location.href = "/members/dashboard.html";
        return;
    }

    // 3. SEQUENTIAL LOCKDOWN (For Foundational Path)
    const currentModuleId = Number(moduleId);
    const userPlan = profile.subscription_plan || 'none';

    if (userPlan === 'foundational' && currentModuleId > 1) {
        const { data: completedData } = await window.supabaseClient
            .from('module_progress')
            .select('module_id')
            .eq('user_id', user.id);

        const completedIds = completedData ? completedData.map(item => Number(item.module_id)) : [];
        const maxCompleted = completedIds.length > 0 ? Math.max(...completedIds) : 0;
        const nextAllowed = maxCompleted + 1;

        if (currentModuleId > nextAllowed) {
            alert("This module is currently locked. Please complete the previous modules in order.");
            window.location.href = "/members/dashboard.html";
            return;
        }
    }

    // 4. UI INJECTION: Header & Footer Navigation
    injectModuleUI(user.email, currentModuleId);
    console.log(`Module ${moduleId} authorized for ${user.email} (${userPlan})`);
}

function injectModuleUI(email, currentId) {
    // A. FIND ADJACENT MODULES FROM REGISTRY
    let prevMod = null;
    let nextMod = null;

    if (typeof COGNIS_MODULES !== 'undefined') {
        const currentIndex = COGNIS_MODULES.findIndex(m => Number(m.id) === Number(currentId));
        if (currentIndex !== -1) {
            prevMod = COGNIS_MODULES[currentIndex - 1];
            nextMod = COGNIS_MODULES[currentIndex + 1];
        }
    }

    // B. GENERATE CSS & HTML
    const uiHTML = `
        <style>
            /* 1. MASTER BRANDING OVERRIDES */
            body { 
                background-color: #FAFAF6 !important; 
                color: #1B3A5C !important;
                font-family: 'DM Sans', sans-serif !important;
                margin: 0;
                padding-bottom: 80px; /* Space for footer nav */
            }
            .module-card { 
                max-width: 920px !important; 
                border: 1px solid #E5E3DD !important; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.03) !important;
                background: white !important;
                margin-bottom: 40px !important;
            }

            /* 2. TOP NAVIGATION BAR */
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
            .cognis-m-nav .user-tag { font-size: 0.75rem; color: #888; font-weight: 500; }

            /* 3. ENGINE & TRACE STYLES */
            .simulation-area, .engine-container { 
                background: #1B3A5C !important; 
                color: white !important;
                border-radius: 12px !important;
            }
            .trace-log, [id*="trace"], [id*="logic"] { 
                background: rgba(0,0,0,0.25) !important; 
                border-left: 4px solid #c5a059 !important;
                color: #48bb78 !important;
                font-family: 'Consolas', monospace !important;
            }

            /* 4. BOTTOM CTA NAVIGATION */
            .module-footer-nav {
                max-width: 920px;
                margin: 60px auto;
                display: flex;
                justify-content: space-between;
                gap: 20px;
                padding: 0 20px;
            }
            .nav-cta {
                flex: 1;
                text-decoration: none;
                padding: 20px 25px;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .nav-cta .cta-label {
                font-size: 0.65rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 800;
                margin-bottom: 6px;
                opacity: 0.7;
            }
            .nav-cta .cta-title {
                font-size: 1rem;
                font-weight: 700;
            }
            .nav-prev {
                background: white;
                color: #1B3A5C;
                border: 2px solid #E5E3DD;
                text-align: left;
            }
            .nav-prev:hover { border-color: #1B3A5C; transform: translateX(-5px); }
            
            .nav-next {
                background: #1B3A5C;
                color: white;
                border: 2px solid #1B3A5C;
                text-align: right;
            }
            .nav-next:hover { background: #c5a059; border-color: #c5a059; transform: translateX(5px); }
            
            .nav-placeholder { flex: 1; visibility: hidden; }

            /* 5. COMPLETE BUTTON */
            button[onclick*="markComplete"] {
                background: #1B3A5C !important;
                border-radius: 6px !important;
                color: white !important;
                padding: 18px 40px !important;
                font-weight: 700 !important;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }
            button[onclick*="markComplete"]:hover { background: #2E6DA4 !important; transform: translateY(-2px); }

            @media (max-width: 600px) {
                .module-footer-nav { flex-direction: column; }
            }
        </style>

        <nav class="cognis-m-nav">
            <a href="/members/dashboard.html">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Lattice Dashboard
            </a>
            <div class="user-tag">${email}</div> 
        </nav>

        <div id="bottom-nav-anchor"></div>
    `;

    document.body.insertAdjacentHTML('afterbegin', uiHTML);

    // INJECT BOTTOM BUTTONS
    const footerHTML = `
        <div class="module-footer-nav">
            ${prevMod ? `
                <a href="${prevMod.path}" class="nav-cta nav-prev">
                    <span class="cta-label">← Previous Module</span>
                    <span class="cta-title">${prevMod.title}</span>
                </a>
            ` : '<div class="nav-placeholder"></div>'}

            ${nextMod ? `
                <a href="${nextMod.path}" class="nav-cta nav-next">
                    <span class="cta-label">Next Module →</span>
                    <span class="cta-title">${nextMod.title}</span>
                </a>
            ` : '<div class="nav-placeholder"></div>'}
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// 3. TRACKER: The "Complete" Function
async function markComplete(moduleId) {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return;

    const { error } = await window.supabaseClient
        .from('module_progress')
        .upsert([
            { user_id: user.id, module_id: moduleId }
        ], { onConflict: 'user_id, module_id' });

    if (error) {
        console.error("Error saving progress:", error);
        alert("There was an error saving your progress.");
    } else {
        alert("Module Completed! ✅");
        window.location.href = "/members/dashboard.html";
    }
}