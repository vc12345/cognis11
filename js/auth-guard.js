// js/auth-guard.js
(async function() {
    // Check if a user session exists in Supabase
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        // No user? Boot them to login.
        console.warn("Unauthorized access attempt.");
        window.location.href = "/login.html";
        return;
    }

    // Optional: Check if their subscription is active (we'll add this later)
    console.log("Access granted for:", user.email);
})();
