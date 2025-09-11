/*
| =================================================================
|  TABLE OF CONTENTS
| =================================================================
|
| 1.  APP INITIALIZATION
| 2.  UI & ANIMATIONS
|     - Particle Background
|     - 3D Project Card Effects
|     - Interactive Mouse Trail
|     - Typing Animation
|     - Scroll-Reveal Animations
| 3.  NAVIGATION & SCROLLING
|     - Main Navigation Handler
|     - Smooth Scrolling
| 4.  CONTACT FORM
|     - AJAX Form Submission
| 5.  UTILITIES
|     - Mobile Menu Toggle
|     - External Link Fixer
|
| =================================================================
*/

// =================================================================
// 1. APP INITIALIZATION
// =================================================================

/**
 * @description Waits for the HTML document to be fully loaded before running the main app function.
 */
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

/**
 * @description Main function to initialize all scripts and functionalities for the portfolio.
 */
function initializeApp() {
    // UI & Animations
    initParticleBackground();
    initProjectCardEffects();
    initMouseTrail();
    initTypingAnimation();
    initScrollAnimations();

    // Navigation & Scrolling
    initNavigation();
    initSmoothScrolling();

    // Contact Form
    initFormValidation();

    // Utilities
    initMobileMenu();
    fixExternalLinks();
}


// =================================================================
// 2. UI & ANIMATIONS
// =================================================================

/**
 * @description Creates and animates an interactive particle network on a canvas element.
 * Particles react to mouse movement by pushing away and connecting to nearby particles.
 */
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    const mouse = { x: null, y: null };

    // --- Event Listeners ---
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent the browser's right-click menu
        if (mouse.x && mouse.y) {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(mouse.x, mouse.y));
            }
        }
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // --- Canvas & Particle Logic ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            // Repel particles from mouse cursor
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.x += (dx / distance) * force * 1.5;
                    this.y += (dy / distance) * force * 1.5;
                }
            }

            // Move particle and wrap around screen edges
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#00BFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // --- Animation Loop ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw lines connecting nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.strokeStyle = '#00BFFF';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Initial setup
    resizeCanvas();
    createParticles();
    animate();
}

/**
 * @description Applies a 3D perspective tilt effect to project cards on mouse hover.
 */
function initProjectCardEffects() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation values based on mouse position inside the card
            const rotateX = (y - centerY) / 20; // Divisor controls sensitivity
            const rotateY = (centerX - x) / 20;

            card.style.transition = 'transform 0.1s ease-out';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/**
 * @description Creates a custom glowing dot element that follows the mouse cursor.
 */
function initMouseTrail() {
    const trailDot = document.createElement('div');
    trailDot.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, rgba(0, 191, 255, 0.5), transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease-out, opacity 0.3s ease-out;
        opacity: 0;
    `;
    document.body.appendChild(trailDot);

    let lastX = 0, lastY = 0;

    window.addEventListener('mousemove', (e) => {
        trailDot.style.opacity = '1';
        lastX = e.clientX;
        lastY = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        trailDot.style.opacity = '0';
    });

    function animateTrail() {
        trailDot.style.transform = `translate(${lastX - 5}px, ${lastY - 5}px)`;
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}

/**
 * @description Creates a typewriter effect for the hero section roles, cycling through a list of titles.
 */
function initTypingAnimation() {
    const roleElement = document.getElementById('role-text');
    if (!roleElement) return;

    const roles = ['AI/ML Engineer', 'Data Scientist', 'Python Developer', 'YouTube Educator'];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function typeRole() {
        const currentRole = roles[currentRoleIndex];
        let typeSpeed = isDeleting ? 50 : 100;

        if (isDeleting) {
            // Deleting text
            roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            // Typing text
            roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }

        // Switch state after completing a word
        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000; // Pause after typing
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        }

        setTimeout(typeRole, typeSpeed);
    }

    // Delay the start of the animation
    setTimeout(typeRole, 1500);
}

/**
 * @description Fades in elements as they become visible in the viewport using the Intersection Observer API.
 */
function initScrollAnimations() {
    // Select only the cards that should have this animation.
    const animatedElements = document.querySelectorAll('.about-card, .skill-card');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        // Set initial state for animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(element);
    });
}


// =================================================================
// 3. NAVIGATION & SCROLLING
// =================================================================

/**
 * @description Manages navigation bar behavior, including style changes on scroll and
 * highlighting the active link corresponding to the section in view.
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    if (!navbar) return;

    // Change navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.style.background = 'rgba(0, 5, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 5, 15, 0.9)';
        }
    });

    // Highlight active nav link using Intersection Observer
    const observerOptions = { rootMargin: '-20% 0px -80% 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * @description Handles smooth scrolling to page sections when navigation or CTA links are clicked.
 */
function initSmoothScrolling() {
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a.nav-link, a.cta-btn');
        if (link) {
            e.preventDefault();
            const targetId = link.getAttribute('data-section') || link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = 70; // Approximate height of the fixed navbar
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                document.getElementById('nav-menu').classList.remove('active');
                document.getElementById('hamburger').classList.remove('active');
            }
        }
    });
}


// =================================================================
// 4. CONTACT FORM
// =================================================================

/**
 * @description Handles the contact form submission using AJAX (Fetch API) to prevent
 * page reloads. Shows a success modal and scrolls to the top on completion.
 */
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    if (!contactForm || !modal) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default page reload

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Provide user feedback during submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>`;

        // Send form data to the endpoint
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (response.ok) {
                    // On success, show modal, reset form, and scroll to top
                    modal.classList.remove('hidden');
                    modal.classList.add('show');
                    contactForm.reset();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // On server error
                    alert('Oops! There was a problem submitting your form. Please try again later.');
                }
            })
            .catch(error => {
                // On network error
                console.error('Submission Error:', error);
                alert('Oops! There was a network problem. Please check your connection and try again.');
            })
            .finally(() => {
                // Restore the button to its original state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });

    // --- Modal Closing Logic ---
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        });
    }
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Close if clicking on the background overlay
            modal.classList.remove('show');
            modal.classList.add('hidden');
        }
    });
}


// =================================================================
// 5. UTILITIES
// =================================================================

/**
 * @description Toggles the mobile navigation menu when the hamburger icon is clicked.
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu if clicking outside of it
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Ensure menu is closed on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/**
 * @description Ensures all external links open in a new tab for better UX and security.
 */
function fixExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        // Check if the link's hostname is different from the current site's hostname
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}
