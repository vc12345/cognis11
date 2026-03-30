// js/module-core-a.js

/**
 * GOOGLE ANALYTICS 4 INTEGRATION
 */
(function initializeAnalytics() {
    const GA_ID = 'G-YK13FYQ1CJ';
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_ID);
    window.gtag = gtag; 
})();

const SAMPLE_IDS = ["11_sample", "47_sample", "53_sample"];

/**
 * SMART LOADER: Fetches the consolidated registry
 */
async function ensureRegistry() {
    if (typeof COGNIS_MODULES !== 'undefined') return true;

    return new Promise((resolve) => {
        const script = document.createElement('script');
        const isInMembers = window.location.pathname.includes('/members/');
        // MANDATORY: Sandbox Registry
        script.src = isInMembers ? '../js/registry-a.js' : 'js/registry-a.js'; 
        
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error("Core-A: registry-a.js not found at " + script.src);
            resolve(false);
        };
        document.head.appendChild(script);
    });
}

/**
 * PLAN HELPER: Used by module-X-a.html to determine layout
 */
async function getUserPlan() {
    if (!window.supabaseClient) return 'foundational';
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return 'foundational';

    const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .maybeSingle();

    return profile ? profile.subscription_plan : 'foundational';
}

/**
 * MAIN INITIALIZATION
 */
async function initModule(moduleId) {
    const isSample = SAMPLE_IDS.includes(String(moduleId));
    
    if (window.gtag) {
        window.gtag('event', 'module_view', {
            'module_id': moduleId,
            'view_mode': isSample ? 'sample' : 'member'
        });
    }

    await ensureRegistry();

    if (isSample) {
        injectModuleUI("Guest Explorer", moduleId, true);
        return; 
    }

    if (!window.supabaseClient) {
        let attempts = 0;
        while (!window.supabaseClient && attempts < 20) {
            await new Promise(res => setTimeout(res, 100));
            attempts++;
        }
    }

    const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
    if (authError || !user) {
        window.location.href = "/login.html";
        return;
    }

    const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', user.id)
        .maybeSingle();

    if (!profile || profile.subscription_status !== 'active') {
        alert("This module requires an active subscription.");
        window.location.href = "/members/dashboard-a.html";
        return;
    }

    const userPlan = profile.subscription_plan || 'foundational';

    // Sequential lock is disabled for Foundational users in the Sandbox
    /*if (userPlan === 'supplemental') {
        const masterId = parseInt(moduleId);
        if (masterId > 1) {
            const { data: completedData } = await window.supabaseClient
                .from('module_progress')
                .select('module_id')
                .eq('user_id', user.id);

            const completedSIDs = completedData ? completedData.map(item => String(item.module_id)) : [];
            const prevModuleSID = String(masterId - 1);

            if (!completedSIDs.includes(prevModuleSID)) {
                alert("Please complete the previous module mastery first.");
                window.location.href = "/members/dashboard-a.html";
                return;
            }
        }
    }
    */

    injectModuleUI(user.email, moduleId, false);
}

/**
 * UI INJECTION
 */
function injectModuleUI(email, currentId, isSample) {
    let prevMod = null;
    let nextMod = null;

    if (typeof COGNIS_MODULES !== 'undefined') {
        const currentIndex = COGNIS_MODULES.findIndex(m => String(m.id) === String(currentId));
        if (currentIndex !== -1) {
            prevMod = COGNIS_MODULES[currentIndex - 1];
            nextMod = COGNIS_MODULES[currentIndex + 1];
        }
    }

    const uiHTML = `
        <style>
            body { background-color: #FAFAF6 !important; padding-bottom: 80px; }
            .module-card { max-width: 920px !important; margin: 20px auto !important; }
            .cognis-m-nav {
                background: #ffffff; border-bottom: 1px solid #E5E3DD;
                padding: 12px 30px; display: flex; justify-content: space-between;
                align-items: center; position: sticky; top: 0; z-index: 1000;
            }
            .cognis-m-nav a { color: #1B3A5C !important; text-decoration: none; font-weight: 600; font-size: 0.85rem; }
            .module-footer-nav {
                max-width: 920px; margin: 40px auto;
                display: ${isSample ? 'none' : 'flex'}; justify-content: space-between; gap: 20px;
            }
            .nav-cta { flex: 1; text-decoration: none; padding: 20px; border-radius: 12px; display: flex; flex-direction: column; transition: 0.3s; }
            .nav-prev { background: white; color: #1B3A5C; border: 2px solid #E5E3DD; }
            .nav-next { background: #1B3A5C; color: white; }
            .cta-label { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; opacity: 0.7; }
        </style>

        <nav class="cognis-m-nav">
            <a href="/members/dashboard-a.html">← Dashboard</a>
            <div style="font-size: 0.75rem; font-weight: 700; color: #888;">${email}</div>
        </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', uiHTML);

    if (!isSample) {
        const footerHTML = `
            <div class="module-footer-nav">
                ${prevMod ? `<a href="${prevMod.path}" class="nav-cta nav-prev"><span class="cta-label">Previous</span><span>${prevMod.title}</span></a>` : '<div></div>'}
                ${nextMod ? `<a href="${nextMod.path}" class="nav-cta nav-next" style="text-align:right;"><span class="cta-label">Next</span><span>${nextMod.title}</span></a>` : '<div></div>'}
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

/**
 * COMPLETION LOGIC
 */
async function markComplete(moduleId) {
    if (!window.supabaseClient) return;
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return;

    if (window.gtag) {
        window.gtag('event', 'module_complete', { 'module_id': moduleId });
    }

    const { error } = await window.supabaseClient
        .from('module_progress')
        .upsert([{ 
            user_id: user.id, 
            module_id: String(moduleId) 
        }], { onConflict: 'user_id, module_id' });

    if (error) {
        console.error(error);
        alert("Error saving progress.");
    } else {
        alert("Progress Saved! ✅");
        window.location.href = "/members/dashboard-a.html";
    }
}