// Password Visibility Toggle (Works for all pages)
document.getElementById('show-password')?.addEventListener('click', () => { 
    const password = document.getElementById('password');
    const showPasswordIcon = document.getElementById('show-password');
    if (password.type === 'password') {
        password.type = 'text';
        showPasswordIcon.src = 'images/Logos/eye-slash-solid.svg';
    } else {
        password.type = 'password';
        showPasswordIcon.src = 'images/Logos/eye-solid.svg';
    }
});

// Password Match Checker (Works for signup and reset pages)
const passwordChecker = () => {
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const matchMessage = document.getElementById('password-match');
    
    if (!password || !confirmPassword || !matchMessage) return;
    
    if (password.length === 0 || confirmPassword.length === 0) {
        matchMessage.style.display = 'none';
    } else {
        matchMessage.style.display = 'block';
        if (password !== confirmPassword) {
            matchMessage.textContent = 'Passwords do not match';
            matchMessage.style.color = 'red';
        } else {
            matchMessage.textContent = 'Passwords match';
            matchMessage.style.color = 'green';
        }
    }
};

document.getElementById('password')?.addEventListener('input', passwordChecker);
document.getElementById('confirm-password')?.addEventListener('input', passwordChecker);

// Firebase Imports
import { auth, db } from './app.js';
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Toast Notification System
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Form Submission Handler
document.querySelector('form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const path = window.location.pathname;

    // Login Page
    if (path.includes('login.html')) {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = `${username}@mokesell.com`;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            showToast('Login successful! Redirecting...');
            redirectToIndex(userCredential.user);
        } catch (error) {
            handleAuthError(error);
        }
    }

    // Signup Page
    else if (path.includes('signup.html')) {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const matchMessage = document.getElementById('password-match');

        if (password !== confirmPassword) {
            matchMessage.textContent = 'Passwords do not match';
            matchMessage.style.color = 'red';
            return;
        }

        const email = `${username}@mokesell.com`;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                uid: userCredential.user.uid,
                username: username,
                email: email,
                bio: '',
                phone: '',
                address: '',
                provider: 'password',
                photoURL: '',
                createdAt: Timestamp.fromDate(new Date())
            });

            showToast('Account created! Redirecting...');
            redirectToIndex(userCredential.user);
        } catch (error) {
            handleAuthError(error);
        }
    }

    // Password Reset Page
    else if (path.includes('reset-pwd.html')) {
        const username = document.getElementById('username').value;
        const email = `${username}@mokesell.com`;
        
        try {
            await sendPasswordResetEmail(auth, email);
            showToast('Password reset email sent. Check your inbox.');
            setTimeout(() => window.location.href = 'login.html', 1500);
        } catch (error) {
            handleAuthError(error);
        }
    }
});

// Google Sign-In
document.getElementById('google-signin')?.querySelector('button').addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    
    try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                username: user.displayName,
                email: user.email,
                bio: '',
                phone: '',
                address: '',
                provider: 'google.com',
                photoURL: user.photoURL || '',
                createdAt: Timestamp.fromDate(new Date())
            });
        }

        showToast('Google login successful! Redirecting...');
        redirectToIndex(user);
    } catch (error) {
        handleAuthError(error);
    }
});

// Shared Functions
function redirectToIndex(user) {
    localStorage.setItem('currentUser', JSON.stringify({
        displayName: user.displayName || user.email,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
    }));
    
    // Update profile picture in navbar immediately
    const profilePic = document.getElementById('profilepic');
    if (profilePic && user.photoURL) {
        profilePic.src = user.photoURL;
        profilePic.style.borderRadius = '50%';
        profilePic.style.objectFit = 'cover';
    }
    
    // Update username in navbar
    const profileName = document.getElementById('profilename');
    if (profileName) {
        profileName.textContent = user.displayName || user.email;
    }

    window.location.href = 'index.html';
}

function handleAuthError(error) {
    const errorMessage = error.code
        .replace('auth/', '')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    showToast(`${errorMessage}`, true);
}

