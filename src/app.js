import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk6nl2GiC0h6lnYS4PKENsDd1bgwilYNU",
  authDomain: "fedmokesell.firebaseapp.com",
  projectId: "fedmokesell",
  storageBucket: "fedmokesell.firebasestorage.app",
  messagingSenderId: "492647970480",
  appId: "1:492647970480:web:c36eb99a0f26a32a35ad75"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Time formatting function
function getTimeAgo(timestamp) {
  const now = new Date();
  const postedDate = timestamp.toDate();
  const diff = now - postedDate;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const listingContainer = document.querySelector('.listing_container');
  
  try {
    const querySnapshot = await getDocs(collection(db, 'listings'));
    listingContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const listing = document.createElement('div');
      listing.className = 'listing';

      listing.innerHTML = ` 
        <span class="listing_photo" style="background-image: url('${data.imageUrl}')">
          <span class="rating">${data.rating}</span>
        </span>
        <div class="listing_details">
          <h3>${data.title}</h3>
          <h5>${data.brand}</h5>
          <div class="details_container">
            <h4>$${data.price}</h4>
            <h5>${getTimeAgo(data.timestamp)}</h5>
          </div>
        </div>
      `;

      listingContainer.appendChild(listing);
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
});