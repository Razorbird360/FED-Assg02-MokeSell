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

    function getSlideWidth() {
        return carousel.offsetWidth * 0.8; // 80vw
    }

    function getMargin() {
        return carousel.offsetWidth * 0.1; // 10vw
    }

    function updateCarousel() {
        if (isAnimating) return;
        isAnimating = true;

        const slideWidth = getSlideWidth();
        const margin = getMargin();
        const containerWidth = (slideWidth + margin * 2) * totalSlides;
        const translateX = -((slideWidth + margin * 2) * currentIndex) + margin;

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
        goToSlide(currentIndex - 1);
    }

    function handleNext() {
        goToSlide(currentIndex + 1);
    }

    prevBtn.addEventListener('click', handlePrev);
    nextBtn.addEventListener('click', handleNext);

    // Initialize
    updateCarousel();
    updateIndicators();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });
});