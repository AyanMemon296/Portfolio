// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    initParticleBackground();
    initNavigation();
    initTypingAnimation();
    initSmoothScrolling();
    initFormValidation();
    initScrollAnimations();
    initMobileMenu();
    initProjectCardEffects();
    initMouseTrail(); // ADDED: Interactive mouse trail
    fixExternalLinks();
}

// Fix external links to open in new tabs
function fixExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="https://"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// Particle Background Animation with Mouse Interaction
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    const mouse = { x: null, y: null };

    // Add mouse listeners
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    // Add right-click listener to add particles
    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent the browser's right-click menu
        if(mouse.x && mouse.y) {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(mouse.x, mouse.y));
            }
        }
    });
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        // Re-initialize particles on resize to fit the new screen
        createParticles();
    });
    
    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.baseVx = this.vx;
            this.baseVy = this.vy;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            // Mouse interaction logic
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.x += dx / distance * force * 1.5;
                    this.y += dy / distance * force * 1.5;
                }
            }

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
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
}

// 3D Project Card Hover Effects
function initProjectCardEffects() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            // INCREASED DIVISOR FROM 10 to 20 to reduce sensitivity
            const rotateX = (y - centerY) / 20; 
            const rotateY = (centerX - x) / 20; 
            
            card.style.transition = 'transform 0.1s ease-out';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });
}

// Interactive Mouse Trail
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
        transition: all 0.1s ease-out;
        opacity: 0;
    `;
    document.body.appendChild(trailDot);

    let lastX = 0, lastY = 0;

    window.addEventListener('mousemove', (e) => {
        trailDot.style.opacity = '1';
        lastX = e.clientX;
        lastY = e.clientY;
    });

    function animateTrail() {
        const currentX = parseFloat(trailDot.style.left || lastX);
        const currentY = parseFloat(trailDot.style.top || lastY);

        trailDot.style.left = `${lastX}px`;
        trailDot.style.top = `${lastY}px`;
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}


// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (!navbar) return;
    
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(0, 5, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 5, 15, 0.9)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    const observerOptions = {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
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
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Typing animation for hero roles
function initTypingAnimation() {
    const roleElement = document.getElementById('role-text');
    if (!roleElement) return;
    
    const roles = [
        'AI/ML Engineer',
        'Data Scientist', 
        'Python Developer',
        'YouTube Educator'
    ];
    
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeRole() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 50;
        } else {
            roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        }
        
        setTimeout(typeRole, typeSpeed);
    }
    
    setTimeout(() => {
        typeRole();
    }, 1500);
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    function smoothScrollTo(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const navbarHeight = 80;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && (link.matches('.nav-link') || link.matches('.cta-btn'))) {
            e.preventDefault();
            let targetSection = link.getAttribute('data-section') || link.getAttribute('href').substring(1);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
                const navMenu = document.getElementById('nav-menu');
                const hamburger = document.getElementById('hamburger');
                if (navMenu && hamburger) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        }
    });
}

// Form validation and submission
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (!contactForm || !modal) return;

    contactForm.addEventListener('submit', function(e) {
        // 1. Prevent the default page reload
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Disable button and show sending status
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>`;

        // 2. Send the form data to FormSubmit in the background
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // 3. If submission is successful:
                // Show the success modal
                modal.classList.remove('hidden');
                modal.classList.add('show');
                // Reset the form fields
                contactForm.reset();
                // Scroll the page smoothly to the top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // If there's an error
                alert('Oops! There was a problem submitting your form. Please try again later.');
            }
        })
        .catch(error => {
            // If there's a network error
            console.error('Submission Error:', error);
            alert('Oops! There was a network problem. Please check your connection and try again.');
        })
        .finally(() => {
            // Re-enable the submit button and restore its text
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    });

    // Logic to close the success modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        }
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.about-card, .project-card, .skill-card');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        if(element.matches('.project-card')) return; // Skip project cards so this doesn't conflict with 3D effect
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(element);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}
