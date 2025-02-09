// listingcreation.js

// Import necessary functions and instances from your app.js and Firebase
import { auth, db, storage } from './app.js';
import { doc, addDoc, collection, Timestamp, getDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// -------------------------------
// Popup Notification Functionality
// -------------------------------
function showNotification(message, type = 'success') {
  // Check if a notification container exists; if not, create one.
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Create a notification element.
  const notification = document.createElement('div');
  notification.className = `notification ${type === 'error' ? 'notification-error' : 'notification-success'}`;
  notification.textContent = message;
  container.appendChild(notification);
  
  // Trigger the CSS transition.
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Remove the notification after 3 seconds (with a fade-out transition).
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      container.removeChild(notification);
    }, 300);
  }, 3000);
}

// Redirect to login if there is no signed-in user.
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'login.html';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // ******************************
  // File Upload and Preview Section
  // ******************************
  const fileUploadArea = document.getElementById('file-upload-area');
  const fileInput = document.getElementById('image');
  const filePreviewContainer = document.getElementById('file-preview-container');
  
  if (fileUploadArea && fileInput && filePreviewContainer) {
    // Open file dialog when clicking on the drag-and-drop area.
    fileUploadArea.addEventListener('click', () => {
      fileInput.click();
    });
    
    // Handle drag events.
    fileUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUploadArea.style.borderColor = '#008cfe';
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
      fileUploadArea.style.borderColor = '#ccc';
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUploadArea.style.borderColor = '#ccc';
      const files = e.dataTransfer.files;
      handleFiles(files);
    });
    
    // Handle file selection via input.
    fileInput.addEventListener('change', () => {
      const files = fileInput.files;
      handleFiles(files);
    });
    
    // Function to handle file uploads and previews.
    function handleFiles(files) {
      filePreviewContainer.innerHTML = ''; // Clear previous previews.
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewDiv = document.createElement('div');
          previewDiv.classList.add('file-preview');
          const img = document.createElement('img');
          img.src = e.target.result;
          const fileName = document.createElement('span');
          fileName.textContent = file.name;
          previewDiv.appendChild(img);
          previewDiv.appendChild(fileName);
          filePreviewContainer.appendChild(previewDiv);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  // ***********************************************
  // Listing Creation: Post Listing to Firestore
  // ***********************************************
  // Use querySelector on the form using its class (".product-form")
  const listingForm = document.querySelector('.product-form');
  if (listingForm) {
    listingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get the current user (ensured by auth.onAuthStateChanged).
      const user = auth.currentUser;
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      
      // Gather listing details using the actual IDs from your HTML.
      const title = document.getElementById('title')?.value;
      const brand = document.getElementById('brand')?.value;
      const priceStr = document.getElementById('price')?.value;
      const condition = document.getElementById('condition')?.value;
      // Use the textarea by selecting it via its name attribute "bio"
      const description = document.querySelector('textarea[name="bio"]')?.value || '';
      
      // Basic validation of required fields.
      if (!title || !brand || !priceStr || !condition) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }
      const price = parseFloat(priceStr);
      if (isNaN(price)) {
        showNotification('Please enter a valid price.', 'error');
        return;
      }
      
      // Upload image file if provided.
      let imageUrl = '';
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 2 * 1024 * 1024) { // 2MB in bytes
            showNotification('Image size must be less than 2MB.', 'error');
            return;
          }
        const imageRef = storageRef(storage, `listings/${user.uid}/${Date.now()}_${file.name}`);
        try {
          const snapshot = await uploadBytes(imageRef, file);
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Error uploading image:", error);
          showNotification("Failed to upload image.", "error");
          return;
        }
      } else {
        showNotification('Please select an image for your listing.', 'error');
        return;
      }
      
      // Retrieve seller's username from the "users" collection.
      let sellerUsername = user.displayName || 'Unknown Seller';
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          sellerUsername = userData.username || sellerUsername;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
      // Construct the listing object.
      const listing = {
        name: title,
        brand: brand,
        price: price,
        condition: condition,
        description: description,
        image: imageUrl,
        seller: sellerUsername,
        createdAt: Timestamp.fromDate(new Date()),
        likes: 0
      };
      
      // Post the listing to the Firestore 'listings' collection.
      try {
        const listingsRef = collection(db, 'listings');
        await addDoc(listingsRef, listing);
        showNotification('Listing posted successfully!', 'success');
        listingForm.reset();
        if (filePreviewContainer) filePreviewContainer.innerHTML = '';
      } catch (error) {
        console.error("Error posting listing:", error);
        showNotification("Failed to post listing.", "error");
      }
    });
  }
});
