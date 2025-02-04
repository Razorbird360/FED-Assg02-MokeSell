document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('change-password-form').style.display = 'none';

    function togglePasswordChangeWindow() {
        document.getElementById('edit-profile-form').style.display = 'none';
        document.getElementById('change-password-form').style.display = 'block';
    }

    function toggleProfileEditWindow() {
        document.getElementById('edit-profile-form').style.display = 'block';
        document.getElementById('change-password-form').style.display = 'none';
    }

    document.getElementById('change-password-link').addEventListener('click', togglePasswordChangeWindow);
    document.getElementById('edit-profile-link').addEventListener('click', toggleProfileEditWindow);

    function handleLinkClick(event) {
        document.querySelectorAll('.focusable').forEach(link => link.classList.remove('focused'));
        event.target.classList.add('focused');
    }

    document.getElementById('edit-profile-link').addEventListener('click', handleLinkClick);
    document.getElementById('change-password-link').addEventListener('click', handleLinkClick);

    window.onload = function() {
        document.getElementById('edit-profile-link').classList.add('focused');
    };

    const passwordChecker = () => {
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const matchMessage = document.getElementById('password-match');
        
        if (password.length === 0 || confirmPassword.length === 0) {
            matchMessage.style.display = 'none'; 
        } else {
            matchMessage.style.display = 'block'; 
            if (password !== confirmPassword) {
                matchMessage.innerHTML = 'Passwords do not match';
                matchMessage.style.color = 'red';
            } else {
                matchMessage.innerHTML = 'Passwords match';
                matchMessage.style.color = 'green';
            }
        }
    };

    document.getElementById('new-password').addEventListener('input', function() {
        const confirmPasswordField = document.getElementById('confirm-password');
        const confirmPasswordContainer = document.getElementById('confirm-password-container');

        if (this.value.length > 0) {
            confirmPasswordField.disabled = false;
            confirmPasswordContainer.style.display = 'block';
        } else {
            confirmPasswordField.disabled = true;
            confirmPasswordContainer.style.display = 'none';
        }
        passwordChecker();
    });

    document.getElementById('confirm-password').addEventListener('input', passwordChecker);
});
