document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('errorMsg');
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    const handleLogin = async () => {
        const password = passwordInput.value;
        if (!password) return;

        loginBtn.disabled = true;
        loginBtn.innerText = 'Verifying...';
        errorMsg.style.display = 'none';

        try {
            // Verify password by attempting to fetch students
            const response = await fetch('/api/students', {
                headers: {
                    'x-admin-password': password
                }
            });

            if (response.ok) {
                // Save password and redirect
                sessionStorage.setItem('adminPassword', password);
                window.location.href = 'data.html';
            } else if (response.status === 401) {
                errorMsg.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
            } else {
                alert('An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to server.');
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerText = 'Unlock Records';
        }
    };

    loginBtn.addEventListener('click', handleLogin);

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
});
