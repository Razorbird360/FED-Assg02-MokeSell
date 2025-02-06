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
document.addEventListener('DOMContentLoaded', () => {
    const titles = document.querySelectorAll('.listing_details h3');
  
    titles.forEach((title) => {
      fitTextToContainer(title);
    });
  
    window.addEventListener('resize', () => {
      titles.forEach((title) => {
        fitTextToContainer(title);
      });
    });
  });
  
  function fitTextToContainer(element) {
    const containerWidth = element.parentElement.offsetWidth;
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize); 
  
    const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    fontSize = fontSize / baseFontSize;
  
    while (element.scrollWidth > containerWidth && fontSize > 0.5) {
      fontSize -= 0.1;
      element.style.fontSize = `${fontSize}rem`;
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