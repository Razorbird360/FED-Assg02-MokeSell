document.querySelector('.mobile_menu_trigger').addEventListener('click', function() {
    const mobileMenu = document.querySelector('.mobile_menu');
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.add('closing');
        
        // Wait for animations to finish before removing active class
        setTimeout(() => {
            mobileMenu.classList.remove('active', 'closing');
        }, 300);
    } else {
        mobileMenu.classList.add('active');
    }
});

