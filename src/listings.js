import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage, ref } from "firebase/storage";
import { getFirestore, collection, addDoc, getDoc, getDocs, Timestamp, setDoc, doc, initializeFirestore, query, where } from "firebase/firestore";
import { app, db, storage , auth} from "./app.js";

// Initialize Firestore references
const storageRef = ref(storage, 'photos');
const listingsRef = collection(db, 'listings');


async function fetchFirestoreListings(category) {
    let q;
    if (category) {
      q = query(listingsRef, where("category", "==", category));
    } else {
      q = listingsRef;
    }
    const querySnapshot = await getDocs(q);
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
  
  
  
  function displayListings(listings) {
    const listingContainer = document.querySelector('.listing_container');
  
    listingContainer.innerHTML = '';
  
    if (!listings) {
      listingContainer.innerHTML = '<p>No listings found</p>';
      return;
    }
  
    Object.entries(listings).forEach(([id, listingData]) => {
      const listing = document.createElement('div');
      listing.className = 'listing';
      listing.innerHTML = `
      <img src="/images/Logos/heart.svg" class="heartrating" alt="heart rating">
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
        listingContainer.appendChild(listing);

    });
  }
  
  async function showlistings() {
    try {
      if (!document.querySelector('.listing_container')) return;
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      const listings = await fetchFirestoreListings(category);
      displayListings(listings);
  
      // Update the heading based on category
      const titleElement = document.querySelector('.container_title h1');
      if (category && titleElement) {
        titleElement.textContent = `${decodeURIComponent(category)} Listings`;
      }
    } catch (error) {
      console.error("Error loading listings:", error);
    }
  }
  
  showlistings();

//resize listing title based on length
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
  
  // Start after initial DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFitText);
} else {
    initFitText();
}
    
function fitTextToContainer(element) {
    const container = element.parentElement;
    const containerWidth = container.offsetWidth; // Get container width
    const padding = parseFloat(window.getComputedStyle(container).paddingLeft) + parseFloat(window.getComputedStyle(container).paddingRight); // Account for padding
    const availableWidth = containerWidth - padding; // Subtract padding from container width
  
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize); // Get current font size in pixels
    const minFontSize = 12; // Set a minimum font size for readability
  
    // Force initial reflow to ensure accurate measurements
    void container.offsetHeight;
  
    // Reduce font size until the text fits or minimum size is reached
    while (element.scrollWidth > availableWidth && fontSize > minFontSize) {
        fontSize -= 1; // Decrease by 1px each step
        element.style.fontSize = `${fontSize}px`;
        void element.offsetHeight; // Force reflow after each adjustment
    }
}
  










// Navbar Scroll Logic
document.addEventListener('DOMContentLoaded', () => {
    // Define scroll targets
    const scrollMap = {
        'navcategories': () => document.querySelector('.categoriesd'),
        'navaboutus': () => document.querySelector('.reviews2'),
        'contact_us': () => document.querySelector('footer'),
        'navlistings': () => {
            const listings = document.querySelectorAll('.container');
            return listings.length > 1 ? listings[1] : listings[0];
        }
    };
  
    // Generic scroll function
    function smoothScroll(targetElement) {
        if (targetElement) {
            const offset = 70; // Adjust for navbar height
            const topPos = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        }
    }
  
    // Handle navigation
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
  
    // Add event listeners
    document.querySelectorAll('.navbar_button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavClick(button.id);
        });
    });
  
    // Handle redirect scroll
    const storedTarget = sessionStorage.getItem('scrollTarget');
    if (storedTarget) {
        const targetElement = scrollMap[storedTarget]();
        setTimeout(() => smoothScroll(targetElement), 100);
        sessionStorage.removeItem('scrollTarget');
    }
  });