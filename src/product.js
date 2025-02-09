// Import the Firestore database from app.js and necessary Firestore functions
import { db } from "./app.js";
import { doc, getDoc } from "firebase/firestore";

// Utility function to calculate time elapsed since the listing was created
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

// Get the listing key from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const listingKey = urlParams.get('key');

async function loadListing() {
  if (!listingKey) {
    console.error('No listing key found in the URL.');
    return;
  }

  try {
    const docRef = doc(db, "listings", listingKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const listingData = docSnap.data();

      // If the createdAt field is a Firebase Timestamp, convert it to a JavaScript Date.
      if (listingData.createdAt && typeof listingData.createdAt.toDate === "function") {
        listingData.createdAt = listingData.createdAt.toDate();
      }

      displayListing(listingData);
    } else {
      console.log("No such listing found!");
    }
  } catch (error) {
    console.error("Error fetching the listing document:", error);
  }
}

function displayListing(listing) {
  // Update the product image
  const productImageElement = document.querySelector('.product_image img');
  if (productImageElement && listing.image) {
    productImageElement.src = listing.image;
    productImageElement.alt = listing.name || "Product Image";
  }

  // Update the product title
  const productTitleElement = document.querySelector('.product_info h1');
  if (productTitleElement && listing.name) {
    productTitleElement.textContent = listing.name;
  }

  // Update the sub-title with the listing time and seller information
  const productSubTitleElement = document.querySelector('.product_info h5');
  if (productSubTitleElement) {
    const timeAgo = getTimeAgo(listing.createdAt);
    // If you have a seller username, replace listing.seller with that username.
    productSubTitleElement.textContent = `Listed ${timeAgo} ago by ${listing.seller || "Unknown Seller"}`;
  }

  // Update the product details (Condition, Type, Category)
  // Assuming the right-hand column is where we want to show the actual data.
  const detailsElements = document.querySelectorAll('.detailsc.detailsr p');
  if (detailsElements.length >= 3) {
    // Use listing.condition, listing.brand (as Type), and listing.category.
    detailsElements[0].textContent = listing.condition || 'N/A';
    detailsElements[1].textContent = listing.brand || 'N/A';
    detailsElements[2].textContent = listing.category || 'N/A';
  }

  // Update the product price
  const productCostElement = document.getElementById('productcost');
  if (productCostElement && listing.price) {
    const price = parseFloat(listing.price).toFixed(2);
    productCostElement.textContent = `$${price}`;
  }

  // Update seller details (for now, we simply display the seller’s ID)
  const sellerNameElement = document.querySelector('.seller_info h4');
  if (sellerNameElement && listing.seller) {
    sellerNameElement.textContent = listing.seller;
  }

  // Update the product description
  const productDescriptionElement = document.querySelector('.pd_container p');
  if (productDescriptionElement && listing.description) {
    productDescriptionElement.textContent = listing.description;
  }
}

// Load the listing data once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadListing);
