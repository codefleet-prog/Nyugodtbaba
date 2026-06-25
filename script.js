document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations is now initialized globally
    // so it can be called after the loader disappears.

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // Add to Cart buttons (on index.html)
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const productId = btn.getAttribute('data-product-id');
            if (!productId) return;

            NyugodtbabaCart.addItem(productId);

            // Show a small "Added!" confirmation
            const originalText = btn.textContent;
            btn.textContent = '✓ Hozzáadva!';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.pointerEvents = '';
            }, 1500);
        });
    });
});

// Function to initialize scroll animations
function initScrollAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const elementsToAnimate = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .fade-in');
    
    elementsToAnimate.forEach(el => {
        animationObserver.observe(el);
    });
}

// Page Loader
const loader = document.getElementById('page-loader');
if (loader) {
    // Hide loader exactly 1.5 seconds after DOM parses, 
    // avoiding issues where window.onload gets stuck waiting for slow images.
    setTimeout(() => {
        loader.classList.add('loaded');
        // Trigger animations right as the loader starts fading out
        initScrollAnimations();
        
        setTimeout(() => {
            loader.remove();
        }, 600);
    }, 1500);
} else {
    // If there's no loader on the page, start animations when DOM is ready
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
}
