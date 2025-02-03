document.addEventListener('DOMContentLoaded', function() {
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
});
