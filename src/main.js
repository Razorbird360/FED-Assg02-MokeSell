import VanillaTilt from 'vanilla-tilt';
document.querySelector('.mobile_menu_trigger').addEventListener('click', function() {
    const mobileMenu = document.querySelector('.mobile_menu');
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.add('closing');
        
        setTimeout(() => {
            mobileMenu.classList.remove('active', 'closing');
        }, 300);
    } else {
        mobileMenu.classList.add('active');
    }
});


//allow listing container to scroll horizontally
const scrollContainers = document.querySelectorAll('.listing_container');

scrollContainers.forEach((scrollContainer) => {
  let isDragging = false;
  let startX;
  let scrollLeft;

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


//resize listing title based on length
// Replace the DOMContentLoaded listener in main.js with:
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


//carousel 
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const container = document.querySelector('.carousel_container');
  const prevBtn = document.querySelector('.prev_container');
  const nextBtn = document.querySelector('.next_container');
  const indicators = document.querySelectorAll('.indicator');
  const totalSlides = 4;
  let currentIndex = 0;
  let isAnimating = false;
  let autoScrollInterval;

  function getSlideWidth() {
      const item = document.querySelector('.carousel_item');
      return item ? item.offsetWidth : 0;
  }

  function getMargin() {
      const containerStyle = window.getComputedStyle(container);
      return parseFloat(containerStyle.gap) || 0;
  }

  function updateCarousel() {
      if (isAnimating) return;
      isAnimating = true;

      const slideWidth = getSlideWidth();
      const margin = getMargin();
      const containerWidth = (slideWidth * totalSlides) + (margin * (totalSlides - 1));
      const translateX = -currentIndex * (slideWidth + margin);

      container.style.width = `${containerWidth}px`;
      container.style.transform = `translateX(${translateX}px)`;

      setTimeout(() => {
          isAnimating = false;
      }, 500);
  }

  function updateIndicators() {
      indicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
      });
  }

  window.goToSlide = function(index) {
      if (isAnimating || index < 0 || index >= totalSlides) return;
      currentIndex = index;
      updateCarousel();
      updateIndicators();
  };

  function handlePrev() {
      const prevIndex = currentIndex - 1;
      goToSlide(prevIndex < 0 ? totalSlides - 1 : prevIndex);
  }

  function handleNext() {
      const nextIndex = currentIndex + 1;
      goToSlide(nextIndex >= totalSlides ? 0 : nextIndex);
  }

  function startAutoScroll() {
      autoScrollInterval = setInterval(handleNext, 4000);
  }

  function resetAutoScroll() {
      clearInterval(autoScrollInterval);
      startAutoScroll();
  }

  // Event listeners
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
          goToSlide(index);
          resetAutoScroll();
      });
  });

  // Initialize
  updateCarousel();
  updateIndicators();
  startAutoScroll();

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCarousel, 250);
  });
});

const carousel = document.querySelector('.container_wrapper');
carousel.addEventListener('click', () => {
  window.location.href = './rewards.html';
});


//changing mokesell review
document.addEventListener('DOMContentLoaded', () => {
  const reviews = document.querySelectorAll('.reviewsj .review');
  const numberElement = document.querySelector('.snumber h1');
  let currentIndex = 0;
  let timeoutID = null;
  let intervalID = null;

  reviews[currentIndex].classList.add('active');
  numberElement.textContent = String(currentIndex + 1).padStart(2, '0');

  function hideCurrentReview() {
      reviews[currentIndex].classList.remove('active');
  }

  function showNextReview() {
      currentIndex = (currentIndex + 1) % reviews.length;
      numberElement.textContent = String(currentIndex + 1).padStart(2, '0');
      reviews[currentIndex].classList.add('active');
  }

  function startTransitionCycle() {
      // First transition after 2 seconds (reduced from 5s)
      timeoutID = setTimeout(() => {
          hideCurrentReview();
          
          // Wait for fade-out animation
          setTimeout(() => {
              showNextReview();
              
              // Start regular interval every 5 seconds
              intervalID = setInterval(() => {
                  hideCurrentReview();
                  setTimeout(() => {
                      showNextReview();
                  }, 800); // Match CSS transition time
              }, 5000); // Interval between transitions
          }, 800);
      }, 2000); // Initial delay reduced to 2000ms (2 seconds)
  }

  function stopTransitions() {
      clearTimeout(timeoutID);
      clearInterval(intervalID);
  }

  startTransitionCycle();

  const container = document.querySelector('.rcj');
  container.addEventListener('mouseenter', stopTransitions);
  container.addEventListener('mouseleave', () => {
      stopTransitions();
      startTransitionCycle();
  });
});