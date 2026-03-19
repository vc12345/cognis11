// js/auth-system.js (Supabase Version)

async function handleLogin() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value; // This could be their "Key"
    const errorMsg = document.getElementById('error-msg');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        errorMsg.innerText = error.message;
        errorMsg.style.display = 'block';
    } else {
        // Success! Supabase handles the session automatically.
        window.location.href = "members/dashboard.html";
    }
}
