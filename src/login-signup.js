// Hide / Show Password
document.getElementById('show-password').addEventListener('click', () => { 
    const password = document.getElementById('password');
    const showPasswordIcon = document.getElementById('show-password');
    const input = password.value;
    if (input.length > 0) { 
        if (password.type === 'password') {
            password.type = 'text';
            showPasswordIcon.src = 'images/Logos/eye-slash-solid.svg';
        } else {
            password.type = 'password';
            showPasswordIcon.src = 'images/Logos/eye-solid.svg';
        }
    }
});
// Password matcher
const passwordChecker = () => {
    const password = document.getElementById('password').value;
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
document.getElementById('password').addEventListener('input', passwordChecker);
document.getElementById('confirm-password').addEventListener('input', passwordChecker);
