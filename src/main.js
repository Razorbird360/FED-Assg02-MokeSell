import { auth } from './app.js';
import VanillaTilt from 'vanilla-tilt';

document.addEventListener('DOMContentLoaded', () => {
  // *********************
  // Mobile Menu Toggle
  // *********************
  const mobileMenuTrigger = document.querySelector('.mobile_menu_trigger');
  if (mobileMenuTrigger) {
    mobileMenuTrigger.addEventListener('click', function () {
      const mobileMenu = document.querySelector('.mobile_menu');
      if (mobileMenu) {
        if (mobileMenu.classList.contains('active')) {
          mobileMenu.classList.add('closing');
          setTimeout(() => {
            mobileMenu.classList.remove('active', 'closing');
          }, 300);
        } else {
          mobileMenu.classList.add('active');
        }
      }
    });
  }

  // *********************************************
  // Allow listing container to scroll horizontally
  // *********************************************
  const scrollContainers = document.querySelectorAll('.listing_container');
  if (scrollContainers.length) {
    scrollContainers.forEach((scrollContainer) => {
      let isDragging = false;
      let startX;
      let scrollLeft;

      // Prevent default on links and buttons within the container
      scrollContainer.querySelectorAll('a, button').forEach((element) => {
        element.addEventListener('mousedown', (event) => event.preventDefault());
      });

      scrollContainer.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
      });

      scrollContainer.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        event.preventDefault();
        scrollContainer.querySelectorAll('a, button').forEach((element) => {
          element.classList.add('inactiveLink');
        });

        const x = event.pageX - scrollContainer.offsetLeft;
        const moved = (x - startX) * 0.8;
        scrollContainer.scrollLeft = scrollLeft - moved;
      });

      scrollContainer.addEventListener('mouseup', () => {
        isDragging = false;
        scrollContainer.querySelectorAll('a, button').forEach((element) => {
          element.classList.remove('inactiveLink');
        });
      });

      scrollContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        scrollContainer.querySelectorAll('a, button').forEach((element) => {
          element.classList.remove('inactiveLink');
        });
      });

      scrollContainer.addEventListener('wheel', (event) => {
        if (event.deltaX !== 0) {
          event.preventDefault();
          scrollContainer.scrollLeft += event.deltaX;
        }
      });
    });
  }

  // *********************************************
  // Resize Listing Title Based on Container Width
  // *********************************************
  function fitTextToContainer(element) {
    const container = element.parentElement;
    if (!container) return;
    const containerWidth = container.offsetWidth;
    const computedStyle = window.getComputedStyle(container);
    const padding =
      parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    const availableWidth = containerWidth - padding;

    let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    const minFontSize = 12; // minimum font size for readability

    // Force a reflow
    void container.offsetHeight;

    // Reduce font size until text fits or minimum is reached
    while (element.scrollWidth > availableWidth && fontSize > minFontSize) {
      fontSize -= 1;
      element.style.fontSize = `${fontSize}px`;
      void element.offsetHeight;
    }
  }

  function initFitText() {
    // Observe DOM changes to adjust new titles dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const newTitles = document.querySelectorAll('.listing_details h3');
          newTitles.forEach(title => fitTextToContainer(title));
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run for existing titles
    const titles = document.querySelectorAll('.listing_details h3');
    titles.forEach(title => fitTextToContainer(title));
  }
  // Call fitText immediately since we are inside DOMContentLoaded
  initFitText();

  // *********************
  // Carousel Functionality
  // *********************
  const carouselEl = document.querySelector('.carousel');
  const carouselContainer = document.querySelector('.carousel_container');
  const prevBtn = document.querySelector('.prev_container');
  const nextBtn = document.querySelector('.next_container');
  const indicators = document.querySelectorAll('.indicator');
  if (carouselEl && carouselContainer && prevBtn && nextBtn && indicators.length) {
    const totalSlides = 4;
    let currentIndex = 0;
    let isAnimating = false;
    let autoScrollInterval;

    function getSlideWidth() {
      const item = document.querySelector('.carousel_item');
      return item ? item.offsetWidth : 0;
    }

    function getMargin() {
      const containerStyle = window.getComputedStyle(carouselContainer);
      return parseFloat(containerStyle.gap) || 0;
    }

    function updateCarousel() {
      if (isAnimating) return;
      isAnimating = true;

      const slideWidth = getSlideWidth();
      const margin = getMargin();
      const containerWidth = (slideWidth * totalSlides) + (margin * (totalSlides - 1));
      const translateX = -currentIndex * (slideWidth + margin);

      carouselContainer.style.width = `${containerWidth}px`;
      carouselContainer.style.transform = `translateX(${translateX}px)`;

      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }

    function updateIndicators() {
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }

    window.goToSlide = function (index) {
      if (isAnimating || index < 0 || index >= totalSlides) return;
      currentIndex = index;
      updateCarousel();
      updateIndicators();
    };

    function handlePrev() {
      const prevIndex = currentIndex - 1;
      window.goToSlide(prevIndex < 0 ? totalSlides - 1 : prevIndex);
    }

    function handleNext() {
      const nextIndex = currentIndex + 1;
      window.goToSlide(nextIndex >= totalSlides ? 0 : nextIndex);
    }

    function startAutoScroll() {
      autoScrollInterval = setInterval(handleNext, 4000);
    }

    function resetAutoScroll() {
      clearInterval(autoScrollInterval);
      startAutoScroll();
    }

    prevBtn.addEventListener('click', () => {
      handlePrev();
      resetAutoScroll();
    });

    nextBtn.addEventListener('click', () => {
      handleNext();
      resetAutoScroll();
    });

    indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        const index = Array.from(indicators).indexOf(indicator);
        window.goToSlide(index);
        resetAutoScroll();
      });
    });

    updateCarousel();
    updateIndicators();
    startAutoScroll();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCarousel, 250);
    });
  }

  // ***********************************************
  // Redirect on Carousel Wrapper Click (if exists)
  // ***********************************************
  const carouselWrapper = document.querySelector('.container_wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('click', () => {
      window.location.href = './rewards.html';
    });
  }

  // ******************************
  // Changing Mokesell Review Cycle
  // ******************************
  const reviewContainer = document.querySelector('.rcj');
  const reviews = document.querySelectorAll('.reviewsj .review');
  if (reviewContainer && reviews.length) {
    let currentReviewIndex = 0;
    let timeoutID = null;
    let intervalID = null;

    reviews[currentReviewIndex].classList.add('active');

    function hideCurrentReview() {
      reviews[currentReviewIndex].classList.remove('active');
    }

    function showNextReview() {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
      reviews[currentReviewIndex].classList.add('active');
    }

    function startTransitionCycle() {
      timeoutID = setTimeout(() => {
        hideCurrentReview();
        setTimeout(() => {
          showNextReview();
          intervalID = setInterval(() => {
            hideCurrentReview();
            setTimeout(() => {
              showNextReview();
            }, 800);
          }, 5000);
        }, 800);
      }, 2000);
    }

    function stopTransitions() {
      clearTimeout(timeoutID);
      clearInterval(intervalID);
    }

    startTransitionCycle();

    reviewContainer.addEventListener('mouseenter', stopTransitions);
    reviewContainer.addEventListener('mouseleave', () => {
      stopTransitions();
      startTransitionCycle();
    });
  }

  // ******************************
  // Navbar Scroll Logic
  // ******************************
  const navbarButtons = document.querySelectorAll('.navbar_button');
  if (navbarButtons.length) {
    // Map button IDs to scroll targets or actions
    const scrollMap = {
      'navcategories': () => document.querySelector('.categoriesd'),
      'navaboutus': () => document.querySelector('.reviews2'),
      'contact_us': () => document.querySelector('footer'),
      'navlistings': () => {
        window.location.href = 'allListings.html';
      }
    };

    function smoothScroll(targetElement) {
      if (targetElement) {
        const offset = 70; // adjust for navbar height
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

    navbarButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavClick(button.id);
      });
    });

    // Handle a potential redirect scroll
    const storedTarget = sessionStorage.getItem('scrollTarget');
    if (storedTarget) {
      const targetElement = scrollMap[storedTarget]();
      setTimeout(() => smoothScroll(targetElement), 100);
      sessionStorage.removeItem('scrollTarget');
    }
  }

  // ***********************************************
  // Update Navigation Bar Based on Authentication State
  // ***********************************************
  function updateNavbar(user) {
    const profileName = document.getElementById('profilename');
    const profilePic = document.getElementById('profilepic');
    const profileLink = document.getElementById('profilelink');

    if (profileName && profilePic && profileLink) {
      if (user) {
        profileName.textContent = user.displayName || 'Profile';
        profilePic.src = user.photoURL || '/images/Logos/user-regular.svg';
        profileLink.href = './profile.html';
      } else {
        profileName.textContent = 'Login';
        profilePic.src = '/images/Logos/user-regular.svg';
        profileLink.href = './login.html';
      }
    }
  }

  // Initialize navbar on page load using localStorage
  const userData = localStorage.getItem('currentUser');
  updateNavbar(userData ? JSON.parse(userData) : null);

  // Listen for auth state changes (if auth is available)
  if (auth && typeof auth.onAuthStateChanged === 'function') {
    auth.onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        }));
      } else {
        localStorage.removeItem('currentUser');
      }
      updateNavbar(user);
    });
  }
});
