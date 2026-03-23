// js/module-core.js

/**
 * SMART LOADER: Automatically fetches the registry if missing from the HTML
 */
async function ensureRegistry() {
    if (typeof COGNIS_MODULES !== 'undefined') return true;

    return new Promise((resolve) => {
        console.log("Core: Registry missing. Injecting dynamically...");
        const script = document.createElement('script');
        // This path assumes your modules are in /members/modules/ and registry is in /js/
        script.src = '../js/registry.js'; 
        script.onload = () => {
            console.log("Core: Registry loaded successfully.");
            resolve(true);
        };
        script.onerror = () => {
            console.error("Core: Critical Error - Could not find registry.js at " + script.src);
            resolve(false);
        };
        document.head.appendChild(script);
    });
}

async function initModule(moduleId) {
    // 1. Ensure Registry is available before proceeding
    await ensureRegistry();

    // 2. GATEKEEPER: Check Supabase Initialization
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

    // 3. AUTH CHECK
    const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
    if (authError || !user) {
        window.location.href = "/login.html";
        return;
    }

    // 4. SUBSCRIPTION & SEQUENTIAL LOGIC
    const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', user.id)
        .maybeSingle();

    if (!profile || profile.subscription_status !== 'active') {
        alert("This module requires an active subscription.");
        window.location.href = "/members/dashboard.html";
        return;
    }

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

    // 5. UI INJECTION (Header & Footer Nav)
    injectModuleUI(user.email, currentModuleId);
}

function injectModuleUI(email, currentId) {
    let prevMod = null;
    let nextMod = null;

    // Resolve Adjacent Modules
    if (typeof COGNIS_MODULES !== 'undefined') {
        const currentIndex = COGNIS_MODULES.findIndex(m => Number(m.id) === Number(currentId));
        if (currentIndex !== -1) {
            prevMod = COGNIS_MODULES[currentIndex - 1];
            nextMod = COGNIS_MODULES[currentIndex + 1];
        }
    }

    const uiHTML = `
        <style>
            /* MASTER BRANDING & LAYOUT OVERRIDES */
            body { 
                background-color: #FAFAF6 !important; 
                color: #1B3A5C !important;
                font-family: 'DM Sans', sans-serif !important;
                margin: 0;
                padding-bottom: 60px; 
            }
            .module-card { 
                max-width: 920px !important; 
                border: 1px solid #E5E3DD !important; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.03) !important;
                background: white !important;
                margin-bottom: 20px !important;
            }

            /* TOP NAVIGATION */
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

            /* ENGINE TRACE LOGS */
            .trace-log, [id*="trace"], [id*="logic"] { 
                background: rgba(0,0,0,0.25) !important; 
                border-left: 4px solid #c5a059 !important;
                color: #48bb78 !important;
                font-family: 'Consolas', monospace !important;
            }

            /* FOOTER NAVIGATION BUTTONS */
            .module-footer-nav {
                max-width: 920px;
                margin: 40px auto 80px;
                display: ${(!prevMod && !nextMod) ? 'none' : 'flex'};
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
            .nav-cta .cta-title { font-size: 0.95rem; font-weight: 700; }
            
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

            /* COMPLETE BUTTON STYLING */
            button[onclick*="markComplete"] {
                background: #1B3A5C !important;
                border: none !important;
                border-radius: 6px !important;
                color: white !important;
                padding: 18px 40px !important;
                font-weight: 700 !important;
                cursor: pointer;
                transition: all 0.2s;
            }
            button[onclick*="markComplete"]:hover { background: #2E6DA4 !important; transform: translateY(-2px); }

            @media (max-width: 600px) {
                .module-footer-nav { flex-direction: column; }
            }
        </style>

        <nav class="cognis-m-nav">
            <a href="/members/dashboard.html">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Dashboard
            </a>
            <div class="user-tag">${email}</div> 
        </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', uiHTML);

    // Render Bottom Nav only if modules are found in registry
    if (prevMod || nextMod) {
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
}

async function markComplete(moduleId) {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return;

    const { error } = await window.supabaseClient
        .from('module_progress')
        .upsert([{ user_id: user.id, module_id: moduleId }], { onConflict: 'user_id, module_id' });

    if (error) {
        alert("Error saving progress.");
    } else {
        alert("Module Completed! ✅");
        window.location.href = "/members/dashboard.html";
    }
}