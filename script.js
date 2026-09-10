// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.children[0].value;
        const email = this.children[1].value;
        const message = this.children[2].value;
        
        // Simple validation
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Please fill in all fields');
            return;
        }
        
        // Show success message
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`);
        
        // Reset form
        this.reset();
    });
}

// Add scroll event listener for header animation
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// CTA button functionality
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach((button, index) => {
    if (index === 0) {
        // First button (in hero section) scrolls to features
        button.addEventListener('click', function () {
            document.querySelector('#features').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Log page load
console.log('Debra website loaded successfully!');