document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
    }

    if (mobileMenuBtn && closeMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        closeMenuBtn.addEventListener('click', toggleMobileMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMobileMenu);
        });
    }

    // 3. Floating Labels for Modern Form
    const inputs = document.querySelectorAll('.modern-form input, .modern-form select, .modern-form textarea');
    
    inputs.forEach(input => {
        // Init active state if pre-filled
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('active');
        }

        input.addEventListener('focus', () => {
            input.parentElement.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.parentElement.classList.remove('active');
            }
        });
        
        // Handle select change
        if(input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                 if (input.value.trim() !== '') {
                     input.parentElement.classList.add('active');
                 }
            });
        }
    });

    // 4. Parallax Effect on Hero Cards & Background Orbs
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        // Hero Parallax Cards
        const floatingCards = document.querySelectorAll('.floating-ui-card');
        floatingCards.forEach(card => {
            const speed = parseFloat(card.getAttribute('data-speed')) || 1;
            const x = mouseX * 50 * speed;
            const y = mouseY * 50 * speed;
            
            // Maintain any initial transforms we set in CSS by doing a slight hack or assuming default 0.
            // Since we use CSS transforms for positioning, doing this overrides them unless we compute dynamically.
            // For simplicity, we apply a translate on top of their current state via a wrapper or assume transform logic.
            // A safer approach: parse style or just allow translate to take over.
            
            // Note: We use rotation in CSS for .card-1 and .card-3. We'll reconstruct safe transforms here:
            if(card.classList.contains('card-1')) {
                card.style.transform = `rotateY(-10deg) rotateX(5deg) translate(${x}px, ${y}px)`;
            } else if (card.classList.contains('card-3')) {
                card.style.transform = `rotateY(15deg) translateZ(50px) translate(${x}px, ${y}px)`;
            } else {
                card.style.transform = `translate(${x}px, ${y}px)`;
            }
        });

        // Background Orbs Parallax
        const orbs = document.querySelectorAll('.glow-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.5;
            const x = mouseX * 30 * speed;
            const y = mouseY * 30 * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // 5. Scroll Parallax for Industry Bubbles
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const bubbles = document.querySelectorAll('.industry-bubble');
        
        bubbles.forEach(bubble => {
            // Only parallax if in viewport (simple check)
            const rect = bubble.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = parseFloat(bubble.getAttribute('data-speed')) || 1;
                const yPos = -(scrolled * speed * 0.1);
                bubble.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // 6. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe fade-in elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        scrollObserver.observe(el);
    });

    // Observe staggered grid elements (Services, Portfolio, Features)
    const staggerContainers = [
        document.querySelector('.services-asymmetric-grid'),
        document.querySelector('.portfolio-grid'),
        document.querySelector('.features-grid')
    ];

    staggerContainers.forEach(container => {
        if (container) {
            const children = container.querySelectorAll('.slide-up-stagger');
            
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Apply staggered delay based on index
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            staggerObserver.observe(container);
        }
    });

    // 7. Form Handling and EmailJS Integration
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate required fields
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                alert("Please fill in all required fields.");
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.style.pointerEvents = 'none';

            // Send form via EmailJS
            emailjs.sendForm(
                'service_tpez1is',
                'template_ow099us',
                '#contactForm',
                'QVxefcMToKWEhGYzm'
            ).then(() => {
                // Success
                submitBtn.innerText = "Message sent successfully. We'll get back to you soon.";
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; 
                submitBtn.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.2)';
                
                contactForm.reset();
                // Reset floating labels
                inputs.forEach(input => input.parentElement.classList.remove('active'));

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                }, 3000);
            }, (error) => {
                // Failure
                console.error('EmailJS Error:', error);
                submitBtn.innerText = "Something went wrong. Please try again.";
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'; 
                submitBtn.style.boxShadow = '0 10px 20px rgba(239, 68, 68, 0.2)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                }, 3000);
            });
        });
    }
});
