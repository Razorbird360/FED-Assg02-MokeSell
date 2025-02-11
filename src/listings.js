import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage, ref } from "firebase/storage";
import { getFirestore, collection, addDoc, getDoc, getDocs, Timestamp, setDoc, doc, initializeFirestore, query, where } from "firebase/firestore";
import { app, db, storage, auth } from "./app.js";

// Initialize Firestore references
const storageRef = ref(storage, 'photos');
const listingsRef = collection(db, 'listings');

// ----------------------------------------------------------------
// Fetch Firestore Listings with optional category and searchTerm filter
// ----------------------------------------------------------------
async function fetchFirestoreListings(category, searchTerm) {
  let q = listingsRef;
  if (category) {
    q = query(listingsRef, where("category", "==", category));
  }
  const querySnapshot = await getDocs(q);
  const listings = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    let matches = true;

    // If a search term is provided, check if the listing name contains it
    if (searchTerm) {
      const name = data.name ? data.name.toLowerCase() : '';
      matches = name.includes(searchTerm.toLowerCase());
    }

    if (matches) {
      listings[doc.id] = data;
    }
  });

  return listings;
}

// ----------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------
function getTimeAgo(timestamp) {
  let postedDate;

  if (timestamp && typeof timestamp.toDate === 'function') {
    postedDate = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    postedDate = new Date(timestamp);
  } else if (timestamp instanceof Date) {
    postedDate = timestamp;
  } else {
    console.error("Invalid or missing timestamp:", timestamp);
    return "Unknown";
  }
  if (isNaN(postedDate.getTime())) {
    console.error("Invalid date:", postedDate);
    return "Unknown";
  }
  const now = new Date();
  const diff = now - postedDate;
  if (diff < 0) {
    return "Just now";
  }
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else {
    return `${days}d`;
  }
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

// ----------------------------------------------------------------
// Display Listings Function
// ----------------------------------------------------------------
function displayListings(listings) {
  const listingContainer = document.querySelector('.listing_container');
  listingContainer.innerHTML = '';

  if (!listings || Object.keys(listings).length === 0) {
    listingContainer.innerHTML = '<p>No listings found</p>';
    return;
  }

  Object.entries(listings).forEach(([id, listingData]) => {
    const listing = document.createElement('div');
    listing.className = 'listing';
    listing.innerHTML = `
      <img src="images/Logos/heart.svg" class="heartrating" alt="heart rating">
      <span class="rating">${listingData.likes || 0}</span>
      <span class="listing_photo" style="background-image: url('${listingData.image}')"></span>
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
    listing.addEventListener('dragstart', () => { isDragging = true; });
    listing.addEventListener('dragend', () => { setTimeout(() => { isDragging = false; }, 0); });
    listing.addEventListener('click', (event) => {
      if (isDragging) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      window.location.href = `./product.html?key=${id}`;
    });
    listingContainer.appendChild(listing);
  });
}

// ----------------------------------------------------------------
// Show Listings: Reads URL for category and/or searchTerm, then displays listings.
// ----------------------------------------------------------------
async function showlistings() {
  try {
    const listingContainer = document.querySelector('.listing_container');
    if (!listingContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const searchTerm = urlParams.get('searchTerm');

    const listings = await fetchFirestoreListings(category, searchTerm);
    displayListings(listings);

    const titleElement = document.querySelector('.container_title h1');
    if (titleElement) {
      if (searchTerm) {
        titleElement.textContent = `"${decodeURIComponent(searchTerm)}" Listings`;
      } else if (category) {
        titleElement.textContent = `${decodeURIComponent(category)} Listings`;
      } else {
        titleElement.textContent = "All Listings";
      }
    }
  } catch (error) {
    console.error("Error loading listings:", error);
  }
}

showlistings();

// ----------------------------------------------------------------
// Resize Listing Title Based on Container Width
// ----------------------------------------------------------------
function initFitText() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const newTitles = document.querySelectorAll('.listing_details h3');
        newTitles.forEach(title => fitTextToContainer(title));
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  const titles = document.querySelectorAll('.listing_details h3');
  titles.forEach(title => fitTextToContainer(title));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFitText);
} else {
  initFitText();
}

function fitTextToContainer(element) {
  const container = element.parentElement;
  const containerWidth = container.offsetWidth;
  const padding =
    parseFloat(window.getComputedStyle(container).paddingLeft) +
    parseFloat(window.getComputedStyle(container).paddingRight);
  const availableWidth = containerWidth - padding;

  let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
  const minFontSize = 12;

  void container.offsetHeight;

  while (element.scrollWidth > availableWidth && fontSize > minFontSize) {
    fontSize -= 1;
    element.style.fontSize = `${fontSize}px`;
    void element.offsetHeight;
  }
}

// ----------------------------------------------------------------
// Navbar Scroll Logic
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const scrollMap = {
    'navcategories': () => document.querySelector('.categoriesd'),
    'navaboutus': () => document.querySelector('.reviews2'),
    'contact_us': () => document.querySelector('footer'),
    'navlistings': () => {
      const listings = document.querySelectorAll('.container');
      return listings.length > 1 ? listings[1] : listings[0];
    }
  };

  function smoothScroll(targetElement) {
    if (targetElement) {
      const offset = 70;
      const topPos = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
    }
  }

  function handleNavClick(targetId) {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'index.html' && currentPage !== '') {
      sessionStorage.setItem('scrollTarget', targetId);
      window.location.href = 'index.html';
    } else {
      const targetElement = scrollMap[targetId]();
      smoothScroll(targetElement);
    }
  }

  document.querySelectorAll('.navbar_button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      handleNavClick(button.id);
    });
  });

  const storedTarget = sessionStorage.getItem('scrollTarget');
  if (storedTarget) {
    const targetElement = scrollMap[storedTarget]();
    setTimeout(() => smoothScroll(targetElement), 100);
    sessionStorage.removeItem('scrollTarget');
  }
});
