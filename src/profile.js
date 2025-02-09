import { auth, db, storage } from './app.js';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } from "firebase/auth";

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

document.addEventListener('DOMContentLoaded', () => {
    // Use Firebase auth state observer
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize UI
        document.getElementById('change-password-form').style.display = 'none';

        // Toggle between profile edit and password change
        document.getElementById('change-password-link').addEventListener('click', togglePasswordChangeWindow);
        document.getElementById('edit-profile-link').addEventListener('click', toggleProfileEditWindow);

        // Handle active link styling
        document.querySelectorAll('.focusable').forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        // Populate profile data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('username').value = userData.username || '';
            document.getElementById('email-address').value = userData.email || '';
            document.getElementById('bio').value = userData.bio || '';
            document.getElementById('phone-number').value = userData.phone || '';
            document.getElementById('home-address').value = userData.address || '';
            
            const profileImg = document.getElementById('pictureprofile-page');
            if (profileImg) {
                profileImg.src = userData.photoURL || '/images/Logos/user-regular.svg';
            }
        }

        // Profile image upload handler
        document.getElementById('image-upload').addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    const fileRef = storageRef(storage, `profile-pictures/${user.uid}/${file.name}`);
                    await uploadBytes(fileRef, file);
                    const downloadURL = await getDownloadURL(fileRef);

                    // Update Firestore and auth profile
                    await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });
                    await updateProfile(user, { photoURL: downloadURL });

                    // Update UI
                    document.getElementById('pictureprofile-page').src = downloadURL;
                    showToast('Profile picture updated!');
                } catch (error) {
                    showToast('Error updating image: ' + error.message, true);
                }
            }
        });

        // Profile form submission
        document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const bio = document.getElementById('bio').value;
            const phone = document.getElementById('phone-number').value;
            const address = document.getElementById('home-address').value;

            try {
                await updateDoc(doc(db, 'users', user.uid), {
                    username,
                    bio,
                    phone,
                    address
                });
                await updateProfile(user, { displayName: username });
                showToast('Profile updated successfully!');
            } catch (error) {
                showToast('Error updating profile: ' + error.message, true);
            }
        });

        // Password change submission
        document.getElementById('change-password-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                showToast('Passwords do not match!', true);
                return;
            }

            try {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                showToast('Password updated successfully!');
            } catch (error) {
                showToast('Error changing password: ' + error.message, true);
            }
        });
    });
});

// Rest of the functions remain the same
function togglePasswordChangeWindow() {
    document.getElementById('edit-profile-form').style.display = 'none';
    document.getElementById('change-password-form').style.display = 'block';
}

function toggleProfileEditWindow() {
    document.getElementById('edit-profile-form').style.display = 'block';
    document.getElementById('change-password-form').style.display = 'none';
}

function handleLinkClick(event) {
    document.querySelectorAll('.focusable').forEach(link => link.classList.remove('focused'));
    event.target.classList.add('focused');
}