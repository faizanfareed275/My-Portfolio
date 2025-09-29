// Main JavaScript functionality for the portfolio website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    initializeTheme();
    initializeNavigation();
    initializeScrollProgress();
    initializeTypewriter();
    initializeAnimations();
    initializeCounters();
    initializeBackToTop();
    showToast('Welcome to my portfolio!', 'success');
}

// Theme Management
function initializeTheme() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle event listeners (header and mobile)
    toggles.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add transition class to prevent flash
            document.body.classList.add('theme-switching');
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-switching');
            }, 300);
        });
    });
}

function updateThemeIcon(theme) {
    const toggles = document.querySelectorAll('[data-theme-toggle] i');
    toggles.forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}


// Navigation Management
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');
    const navLinks = document.querySelectorAll('.nav-link');
    const navMobileControls = document.querySelector('.nav-mobile-controls');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        // Set ARIA defaults
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        if (navBackdrop) navBackdrop.setAttribute('aria-hidden', 'true');

        function openMenu() {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            if (navBackdrop) {
                navBackdrop.classList.add('show');
                navBackdrop.setAttribute('aria-hidden', 'false');
            }
            if (navMobileControls) navMobileControls.setAttribute('aria-hidden', 'false');
            navToggle.setAttribute('aria-expanded', 'true');
            navMenu.setAttribute('aria-hidden', 'false');
            // Prevent background scroll when menu open
            document.body.classList.add('no-scroll');
        }

        function closeMenu() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navBackdrop) {
                navBackdrop.classList.remove('show');
                navBackdrop.setAttribute('aria-hidden', 'true');
            }
            if (navMobileControls) navMobileControls.setAttribute('aria-hidden', 'true');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        }

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) closeMenu(); else openMenu();
        });

        // Keyboard support for the hamburger (Enter/Space)
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isOpen = navMenu.classList.contains('active');
                if (isOpen) closeMenu(); else openMenu();
            }
        });

        // Close menu on nav link click for small/tablet screens
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    closeMenu();
                }
            });
        });

        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMenu);
        }

        // Close on Esc
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Smooth scroll behavior
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }

            // Close mobile menu if open
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navBackdrop) navBackdrop.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                if (navBackdrop) navBackdrop.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // Active section highlighting (scrollspy)
    window.addEventListener('scroll', updateActiveNavLink);

    // Navbar shrink-on-scroll effect
    const navbar = document.getElementById('navbar');
    function updateNavbarScrolled() {
        if (!navbar) return;
        if (window.scrollY > 10) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
    updateNavbarScrolled();
    window.addEventListener('scroll', updateNavbarScrolled);

    // Auto-hide on scroll down, show on scroll up (when menu is closed)
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        const menuOpen = navMenu.classList.contains('active');
        const currentY = window.scrollY;
        const scrollingDown = currentY > lastScrollY;
        const beyondThreshold = currentY > 100;

        if (!menuOpen) {
            if (scrollingDown && beyondThreshold) {
                navbar.classList.add('nav-hide');
            } else {
                navbar.classList.remove('nav-hide');
            }
        }
        lastScrollY = currentY;
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');
        }
    });
}

// Scroll Progress Bar
function initializeScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriter = document.getElementById('typewriter');
    const texts = [
        'I create amazing web experiences',
        'I build responsive applications',
        'I solve complex problems',
        'I love clean, efficient code'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typewriter effect
    setTimeout(type, 1000);
}

// Animations with AOS
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.fact-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Back to Top Button
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Set message and type
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Set appropriate icon
    switch (type) {
        case 'success':
            toastIcon.className = 'toast-icon fas fa-check-circle';
            break;
        case 'error':
            toastIcon.className = 'toast-icon fas fa-exclamation-circle';
            break;
        case 'warning':
            toastIcon.className = 'toast-icon fas fa-exclamation-triangle';
            break;
        default:
            toastIcon.className = 'toast-icon fas fa-info-circle';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// Optimize scroll events
window.addEventListener('scroll', throttle(function() {
    updateActiveNavLink();
}, 100));

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Refresh AOS on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    // If moving to desktop, ensure menu state is reset
    const isDesktop = window.innerWidth > 992;
    if (isDesktop) {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        const navBackdrop = document.getElementById('navBackdrop');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navMenu.setAttribute('aria-hidden', 'false');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        if (navBackdrop) navBackdrop.classList.remove('show');
        document.body.classList.remove('no-scroll');
    }
}, 250));

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Toggle theme with Ctrl/Cmd + Shift + T
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
});


// Service Worker Registration (for PWA support)
// Only register on HTTP(S) or localhost to avoid file:// restrictions
if ('serviceWorker' in navigator) {
    const isSecureOrigin = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (isSecureOrigin) {
        window.addEventListener('load', function() {
            // Use relative path for GitHub Pages or subpath deployments
            navigator.serviceWorker.register('./sw.js')
                .then(function() {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed', err);
                });
        });
    } else {
        console.warn('ServiceWorker skipped: not on a secure origin (http(s)/localhost).');
    }
}

// Export functions for use in other modules
window.portfolioApp = {
    showToast,
    debounce,
    throttle
};
