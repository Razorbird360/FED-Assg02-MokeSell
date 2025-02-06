// Import the correct Firestore functions
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore, collection, addDoc, getDoc, getDocs, Timestamp, setDoc, doc, initializeFirestore } from "firebase/firestore";
import { add } from "three/tsl";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApYaYidmqLjqP31OnVBdsgOFyQ6AhHGKc",
  authDomain: "fed-mokesell.firebaseapp.com",
  projectId: "fed-mokesell",
  storageBucket: "fed-mokesell.firebasestorage.app",
  messagingSenderId: "76042505374",
  appId: "1:76042505374:web:972de2704ed55475493f8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'fedmokesell');
const storage = getStorage(app)
const auth = getAuth(app);

const storageRef = ref(db, 'photos');
const listingsRef = collection(db, 'listings');

async function postListing(listing) {
  try {
    const sanitizedListing = {
      ...listing,
      createdAt: listing.createdAt instanceof Timestamp ? listing.createdAt : Timestamp.fromDate(new Date(listing.createdAt)),
      price: typeof listing.price === 'string' ? parseFloat(listing.price) : listing.price,
      likes: typeof listing.likes === 'string' ? parseInt(listing.likes, 10) : listing.likes
    };

    // Log the sanitized data for debugging
    console.log("Sanitized Listing:", sanitizedListing);

    // Post the listing to Firestore
    await addDoc(listingsRef, sanitizedListing);
    console.log("Listing posted successfully!");
    
  } catch (error) {
    console.error("Error posting listing:", error);
  }
}

async function fetchFirestoreListings() {
  const querySnapshot = await getDocs(listingsRef); 
  const listings = {};
  querySnapshot.forEach((doc) => {
    listings[doc.id] = doc.data();
  });
  return listings;
}




function getTimeAgo(timestamp) {
  let postedDate;

  if (timestamp && typeof timestamp.toDate === 'function') {
    postedDate = timestamp.toDate();
  }
  else if (typeof timestamp === 'string') {
    postedDate = new Date(timestamp);
  }
  else if (timestamp instanceof Date) {
    postedDate = timestamp;
  }
  else {
    console.error("Invalid or missing timestamp:", timestamp);
    return "Unknown";
  }

  const now = new Date();
  const diff = now - postedDate;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}



async function fetchLocalListings() {
  try {
    const response = await fetch('./listings.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const jsonData = await response.json();

    const listings = jsonData.listings;
    Object.values(listings).forEach((listing) => {
      if (typeof listing.createdAt === 'string') {
        listing.createdAt = new Date(listing.createdAt);
      }
      if (typeof listing.price === 'string') {
        listing.price = parseFloat(listing.price);
      }
      if (typeof listing.likes === 'string') {
        listing.likes = parseInt(listing.likes, 10);
      }
    });

    return listings;
  } catch (error) {
    console.error("Error fetching local listings:", error);
    return null;
  }
}



function displayListings(listings) {
  const listingContainer = document.querySelector('.trending_container');
  const newContainer = document.querySelector('.newItem_container');

  listingContainer.innerHTML = '';
  newContainer.innerHTML = '';

  if (!listings) {
    listingContainer.innerHTML = '<p>No listings found</p>';
    return;
  }

  Object.entries(listings).forEach(([id, listingData]) => {
    const listing = document.createElement('div');
    listing.className = 'listing';
    listing.innerHTML = `
      <span class="listing_photo" style="background-image: url('${listingData.image}')">
        <span class="rating">${listingData.likes || 0}</span>
      </span>
      <div class="listing_details">
        <h3>${listingData.name || 'No Title'}</h3>
        <h5>${listingData.brand || 'Unknown Brand'}</h5>
        <div class="details_container">
          <h4>$${listingData.price || '0.00'}</h4>
          <h5>${getTimeAgo(listingData.createdAt)}</h5>
        </div>
      </div>
    `;

    let isDragging = false;

    listing.addEventListener('dragstart', (event) => {
      isDragging = true;
    });
    
    listing.addEventListener('dragend', (event) => {
      setTimeout(() => {
        isDragging = false;
      }, 0);
    });
    
    listing.addEventListener('click', (event) => {
      if (isDragging) {
        event.preventDefault();
        event.stopPropagation(); 
        return;
      }
    
      console.log('Listing clicked:', listingData);
    });    
    if (listingData.likes > 20) {
      listingContainer.appendChild(listing);
    }
    else if (
      listingData.condition &&
      (listingData.condition.toUpperCase() === "BRAND NEW" ||
       listingData.condition.toUpperCase() === "NEW")
    ) {
      newContainer.appendChild(listing);
    } 
  });
}

async function showlistings() {
  try {
    const listings = await fetchFirestoreListings();
    displayListings(listings);
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

showlistings();

async function postAllListings() {
  try {
    const listings = await fetchLocalListings();
    if (!listings) {
      console.log("No listings found to post.");
      return;
    }

    for (const [id, listingData] of Object.entries(listings)) {
      const firebaseListing = {
        ...listingData,
        createdAt: Timestamp.fromDate(listingData.createdAt),
        price: parseFloat(listingData.price),
        likes: parseInt(listingData.likes, 10)
      };

      try {
        await postListing(firebaseListing);
        console.log(`Posted listing ${id}:`, firebaseListing);
      } catch (error) {
        console.error(`Error posting listing ${id}:`, error);
      }
    }

    console.log("All listings posted successfully!");
  } catch (error) {
    console.error("Error fetching or posting listings:", error);
  }
}

// postAllListings();


const minimalTestListing = {
  category: "Musical Instruments",
  condition: "Brand new",
  createdAt: Timestamp.fromDate(new Date("2025-01-24T11:00:00Z")), // Convert to Firestore Timestamp
  description: "A portable keyboard with built-in speakers.",
  image: "https://firebasestorage.googleapis.com/v0/b/fed-mokesell.firebasestorage.app/o/listings%2Fc80_118246_2400.jpg?alt=media&token=03a5cf5b-f7b2-4a95-b89a-1e8563be31ae",
  likes: 18,
  name: "Portable Keyboard",
  price: parseFloat("199"),
  seller: "seller404",
  brand: "Roland"
};

// postListing(minimalTestListing);

// Test Firestore connection
async function testConnection() {
  try {
    console.log("Initializing connection test...");
    
    // Test Firestore write operation
    const testRef = doc(db, 'test/connection');
    await setDoc(testRef, { test: Date.now() });
    console.log("Firestore write operation successful!");

    // Test Firestore read operation
    const docSnapshot = await getDoc(testRef);
    if (docSnapshot.exists()) {
      console.log("Firestore read operation successful:", docSnapshot.data());
    } else {
      console.error("Firestore read failed - document not found");
    }

    console.log("Firestore connection fully operational!");
  } catch (error) {
    console.error("Firestore connection failed:", error);
    console.error("Full error details:", error);
    
    // Check Firebase project configuration
    console.group("Firebase Configuration Verification");
    console.log("Project ID:", firebaseConfig.projectId);
    console.log("API Key:", firebaseConfig.apiKey);
    console.log("Auth Domain:", firebaseConfig.authDomain);
    console.groupEnd();

    // Additional troubleshooting checks
    if (error.code === 'permission-denied') {
      console.error("Firestore Security Rules Issue - Check your Firestore rules in Firebase Console");
    } else if (error.code === 'invalid-argument') {
      console.error("Invalid project configuration - Verify Firebase config values");
    } else if (error.code === 'unavailable') {
      console.error("Network connection issue - Check internet connection and CORS settings");
    }
  }
}
// testConnection();