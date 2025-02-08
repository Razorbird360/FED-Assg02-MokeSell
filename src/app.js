// Import the correct Firestore functions
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage, ref } from "firebase/storage";
import { getFirestore, collection, addDoc, getDoc, getDocs, Timestamp, setDoc, doc, initializeFirestore } from "firebase/firestore";
import { add } from "three/tsl";
import { v4 as uuidv4 } from 'uuid';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'fedmokesell');
const storage = getStorage(app)
const auth = getAuth(app);


const storageRef = ref(storage, 'photos');
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
  const iContainer = document.querySelector('.interested_container');

  listingContainer.innerHTML = '';
  newContainer.innerHTML = '';
  iContainer.innerHTML = '';

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
    
      // console.log('Listing clicked:', listingData);
      window.location.href = `./product.html?key=${id}`;
    });
    if (
      listingData.condition &&
      (listingData.condition.toUpperCase() === "BRAND NEW" ||
       listingData.condition.toUpperCase() === "LIKE NEW")
    ) {
      newContainer.appendChild(listing);
    } 
    else if (listingData.likes > 20) {
      listingContainer.appendChild(listing);
    }
    else {
      iContainer.appendChild(listing);
    }
  });
}

async function showlistings() {
  try {
    const listings = await fetchFirestoreListings();
    // const listings = await fetchLocalListings();
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


