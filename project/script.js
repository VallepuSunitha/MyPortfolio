// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollToTopBtn = document.getElementById('scrollToTop');
const loadingScreen = document.querySelector('.loading-screen');
const contactForm = document.getElementById('contactForm');
const notification = document.getElementById('notification');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    setupScrollAnimations();
    setupSkillsSection();
    setupExperienceTabs();
    setupStatsCounter();
    hideLoadingScreen();
});

// Initialize website
function initializeWebsite() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Scroll events
    window.addEventListener('scroll', throttle(handleScroll, 16));
    
    // Scroll to top button
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Contact form submission
    contactForm.addEventListener('submit', handleFormSubmission);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// Mobile menu functions
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll handling
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Parallax effect for floating icons
    updateParallaxEffect(scrollY);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Parallax effect for floating icons
function updateParallaxEffect(scrollY) {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        const speed = 0.5 + (index * 0.1);
        icon.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger skill progress bars animation
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
                
                // Trigger stats counter animation
                if (entry.target.classList.contains('stat-card')) {
                    animateStatCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .about-card, .stat-card, .skill-item, .project-card, 
        .timeline-item, .cert-card, .contact-card, .contact-form-container
    `);
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Skills section functionality
function setupSkillsSection() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillGroups = document.querySelectorAll('.skill-group');
    
    skillCategories.forEach(category => {
        category.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Remove active class from all categories and groups
            skillCategories.forEach(cat => cat.classList.remove('active'));
            skillGroups.forEach(group => group.classList.remove('active'));
            
            // Add active class to clicked category and corresponding group
            this.classList.add('active');
            const targetGroup = document.querySelector(`[data-group="${targetCategory}"]`);
            if (targetGroup) {
                targetGroup.classList.add('active');
                
                // Animate skill bars in the active group
                const skillItems = targetGroup.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        animateSkillBar(item);
                    }, index * 100);
                });
            }
        });
    });
    
    // Animate initial skill bars
    setTimeout(() => {
        const activeGroup = document.querySelector('.skill-group.active');
        if (activeGroup) {
            const skillItems = activeGroup.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    animateSkillBar(item);
                }, index * 100);
            });
        }
    }, 500);
}

// Animate skill progress bars
function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    if (progressBar && !progressBar.classList.contains('animated')) {
        const width = progressBar.getAttribute('data-width');
        progressBar.style.width = width + '%';
        progressBar.classList.add('animated');
    }
}

// Experience tabs functionality
function setupExperienceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Stats counter animation
function setupStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        stat.textContent = '0';
    });
}

function animateStatCounter(statCard) {
    const statNumber = statCard.querySelector('.stat-number');
    if (statNumber && !statNumber.classList.contains('animated')) {
        const target = parseInt(statNumber.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                statNumber.textContent = `${target}+`;
            } else {
                statNumber.textContent = Math.floor(current);
            }
        }, 16);
        
        statNumber.classList.add('animated');
    }
}

// Contact form handling
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (!validateForm(formObject)) {
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form and button state
        contactForm.reset();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success notification
        showNotification('Thank you for reaching out! I\'ll review your message shortly.', 'success');
    }, 2000);
}

// Form validation
function validateForm(formData) {
    const { firstName, lastName, email, subject, message } = formData;
    
    if (!firstName || !lastName || !email || !subject || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (message.length < 10) {
        showNotification('Message must be at least 10 characters long.', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationText = notification.querySelector('.notification-text');
    
    // Set icon based on type
    if (type === 'success') {
        notificationIcon.className = 'notification-icon fas fa-check-circle';
        notification.classList.remove('error');
    } else {
        notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
        notification.classList.add('error');
    }
    
    // Set message
    notificationText.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Hide loading screen
function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }, 1500);
}

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Typing animation for hero title
function initTypeWriter() {
    const heroName = document.querySelector('.hero-title .name');
    if (heroName) {
        const text = heroName.textContent;
        heroName.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Initialize typing animation after loading screen
setTimeout(initTypeWriter, 2000);

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .skill-progress {
            transform-origin: left;
        }
        
        .animated {
            animation-fill-mode: forwards;
        }
        
        @keyframes countUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .stat-number.animated {
            animation: countUp 0.5s ease-out;
        }
        
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .timeline-item.visible {
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .project-card.visible {
            animation: scaleIn 0.6s ease-out;
        }
        
        @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .contact-card.visible {
            animation: fadeInLeft 0.6s ease-out;
        }
        
        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .contact-form-container.visible {
            animation: fadeInRight 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Performance optimization: Preload images
function preloadImages() {
    const images = [
        'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=500',
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600',      
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Add smooth reveal animation for sections
function addSectionRevealAnimation() {
    const sections = document.querySelectorAll('section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });
}

// Initialize section reveal animation
setTimeout(addSectionRevealAnimation, 2000);

// Add interactive cursor effect (optional enhancement)
function addCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.5';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
} 

// Initialize cursor effect for desktop only
if (window.innerWidth > 768) {
    addCursorEffect();
}





document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Optionally, toggle loading indicators, disable button etc. here

    emailjs.sendForm(
        'service_1ruoz8o',        // Replace with your actual Service ID
        'template_d42jcpr',       // Replace with your actual Template ID
        this
    ).then(function() {
        // // Success notification
        // showNotification("Your message has been sent!", "success");
        // document.getElementById('contactForm').reset();
    }, function(error) {
        // Error notification
        // showNotification("Failed to send message. Please try again.", "error");
        // // Optionally, display error details: error.text
    });
});

function showNotification(msg, type) {
    // Assumes you already have a notification div in your HTML
    const notif = document.getElementById('notification');
    notif.className = 'notification show ' + (type === "success" ? "success" : "error");
    notif.querySelector('.notification-text').textContent = msg;
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 4000);
}
