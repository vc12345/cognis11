// js/auth-system.js

/**
 * 1. LOGIN LOGIC
 * Used on login.html
 */
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('error-msg');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        errorDiv.innerText = error.message;
        errorDiv.style.display = 'block';
    } else {
        window.location.href = "members/dashboard.html";
    }
}

/**
 * 2. STANDARD SIGNUP (Manual/Free)
 * Used on signup.html
 */
async function handleSignUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorDiv = document.getElementById('error-msg');

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        errorDiv.innerText = error.message;
        errorDiv.style.display = 'block';
    } else {
        alert("Success! Please check your email for a verification link.");
        window.location.href = "login.html";
    }
}

/**
 * 3. SUBSCRIPTION SIGNUP (Paid Flow)
 * Used on the Landing Page Modal
 */
async function handleSubscriptionSignup() {
    const email = document.getElementById('sub-email').value;
    const password = document.getElementById('sub-password').value;
    const btn = document.getElementById('sub-btn');
    const errorDiv = document.getElementById('error-msg');

    // UI Feedback: Disable button to prevent double-clicks
    btn.innerText = "Creating Account...";
    btn.disabled = true;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        errorDiv.innerText = error.message;
        errorDiv.style.display = 'block';
        btn.innerText = "Proceed to Payment";
        btn.disabled = false;
    } else {
        // SUCCESS: Redirect to Stripe
        // Note: Make sure YOUR_LINK_ID is replaced with your actual Stripe Payment Link ID
        const stripeLink = "https://buy.stripe.com/test_3cIfZj0ybgFcejO20agUM00"; 
        const userId = data.user.id;
        
        // Pass the user ID to Stripe so the Webhook can find them later
        window.location.href = `${stripeLink}?client_reference_id=${userId}&prefilled_email=${encodeURIComponent(email)}`;
    }
}
