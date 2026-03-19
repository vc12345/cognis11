// js/auth-system.js

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
