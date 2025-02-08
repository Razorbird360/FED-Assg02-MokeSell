import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = { /* ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get listing key from URL
const urlParams = new URLSearchParams(window.location.search);
const listingKey = urlParams.get('key');

async function loadListing() {
  if (!listingKey) {
    console.error('No listing key found');
    return;
  }

  try {
    const docRef = doc(db, "listings", listingKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const listingData = docSnap.data();
      // Convert Firebase Timestamp to Date
      if (listingData.createdAt) {
        listingData.createdAt = listingData.createdAt.toDate();
      }
      displayListing(listingData);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

function displayListing(listing) {
//   document.querySelector('.product-image').src = listing.image;
//   document.querySelector('.product-title').textContent = listing.name;
//   document.querySelector('.product-price').textContent = `$${listing.price}`;
}

document.addEventListener('DOMContentLoaded', loadListing);