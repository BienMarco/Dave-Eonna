document.addEventListener('DOMContentLoaded', function() {
    // Splash Screen
    const splashScreen = document.querySelector('.splash-screen');
    const enterButton = document.getElementById('enterSite');
    const mainContent = document.getElementById('main-content');
    
    // Music controls
    const audio = document.getElementById('weddingAudio');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    let musicStarted = false;
    
    // Set initial volume
    if (audio) audio.volume = 0.5;
    // Hide music button initially
    if (musicToggle) musicToggle.style.display = 'none';
    
    // Only initialize splash screen if elements exist
    if (splashScreen && enterButton && mainContent) {
        // Show splash screen initially
        document.body.style.overflow = 'hidden';
        
        // Enter button click handler
        enterButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            this.appendChild(ripple);
            
            // Position ripple at click location
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Hide splash screen and show main content
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                
                // Enable scrolling and ensure proper layout
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                
                // Show the music control button
                if (musicToggle) musicToggle.style.display = 'flex';
                // Try to play audio
                if (audio) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            musicIcon.textContent = '⏸';
                            musicStarted = true;
                        }).catch(error => {
                            musicIcon.textContent = '▶';
                            musicStarted = false;
                            console.log("Audio playback was blocked:", error);
                        });
                    }
                }
                
                // Special handling for gallery page
                if (window.location.pathname.includes('gallery.html')) {
                    const gallerySection = document.querySelector('.gallery-section');
                    if (gallerySection) {
                        // Force layout recalculation
                        void gallerySection.offsetHeight;
                        // Ensure scrolling container is properly sized
                        gallerySection.style.minHeight = 'calc(100vh - 200px)';
                    }
                }
            }, 1000);
        });
    } else {
        // If no splash screen (direct page access), ensure scrolling is enabled
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        // Show music button if not on splash
        if (musicToggle) musicToggle.style.display = 'flex';
        // Try to auto-play audio
        if (audio) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicIcon.textContent = '⏸';
                    musicStarted = true;
                }).catch(error => {
                    musicIcon.textContent = '▶';
                    musicStarted = false;
                    console.log("Audio playback was blocked:", error);
                });
            }
        }
        // Special handling for direct gallery access
        if (window.location.pathname.includes('gallery.html')) {
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                gallerySection.style.minHeight = 'calc(100vh - 200px)';
            }
        }
    }
    
    // Music play/pause toggle
    if (musicToggle && audio && musicIcon) {
        musicToggle.addEventListener('click', function() {
            if (!musicStarted) return; // Only allow toggle if music has started
            if (audio.paused) {
                audio.play().then(() => {
                    musicIcon.textContent = '⏸';
                });
            } else {
                audio.pause();
                musicIcon.textContent = '▶';
            }
        });
    }
    
    // Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Countdown Timer
    const weddingDate = new Date('December 14, 2025 16:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // SPA navigation for sections
    function showSection(sectionId) {
        document.querySelectorAll('.spa-section').forEach(sec => {
            if (sec.id === sectionId) {
                sec.style.display = '';
                // Force reflow for transition
                void sec.offsetWidth;
                sec.classList.remove('hide');
                
                // Initialize slideshow when gallery section is shown
                if (sectionId === 'gallery') {
                    // Ensure slideshow is properly initialized with a small delay
                    setTimeout(() => {
                        showSlides(slideIndex);
                    }, 50);
                }
            } else {
                sec.classList.add('hide');
                setTimeout(() => {
                    sec.style.display = 'none';
                }, 500); // Match CSS transition duration
            }
        });
        // Update nav active class
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    function showSectionWithScale(sectionId) {
        const sections = document.querySelectorAll('.spa-section');
        let currentSection = null;
        sections.forEach(sec => {
            if (!sec.classList.contains('hide')) {
                currentSection = sec;
            }
        });
        const nextSection = document.getElementById(sectionId);
        if (currentSection && currentSection !== nextSection) {
            currentSection.classList.remove('scale-in');
            currentSection.classList.add('scale-out');
            setTimeout(() => {
                currentSection.classList.add('hide');
                currentSection.classList.remove('scale-out');
                if (nextSection) {
                    nextSection.classList.remove('hide');
                    nextSection.classList.add('scale-in');
                    
                    // Initialize slideshow when gallery section is shown
                    if (sectionId === 'gallery') {
                        setTimeout(() => {
                            showSlides(slideIndex);
                        }, 50);
                    }
                    
                    setTimeout(() => {
                        nextSection.classList.remove('scale-in');
                        window.scrollTo(0, 0);
                    }, 400);
                }
            }, 400);
        } else if (nextSection) {
            nextSection.classList.remove('hide');
            nextSection.classList.add('scale-in');
            
            // Initialize slideshow when gallery section is shown
            if (sectionId === 'gallery') {
                setTimeout(() => {
                    showSlides(slideIndex);
                }, 50);
            }
            
            setTimeout(() => {
                nextSection.classList.remove('scale-in');
                window.scrollTo(0, 0);
            }, 400);
        }
        // Update nav active class
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
        document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            if (hash.startsWith('#')) {
                e.preventDefault();
                showSection(hash.substring(1));
                // Update URL hash for navigation
                window.location.hash = hash;
            }
        });
    });
    // On load, always show home section first
    showSection('home');
    
    // Clear any hash from URL to ensure clean start
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
    }
    
    // Hero slideshow background with fade effect
    (function() {
        const images = [
            'assets/images/JUN00079.jpg',
            'assets/images/YRB03263.jpg',
            'assets/images/JUN09685-1.jpg',
            'assets/images/JUN00657-1.jpg',
            'assets/images/JUN00807.jpg',
            'assets/images/JUN09340.jpg',
            'assets/images/JUN09501.jpg',
            'assets/images/JUN00414.jpg',
            'assets/images/JUN09366-1.jpg',
            'assets/images/JUN00588.jpg'
        ];
        let current = 0;
        const slideshow = document.querySelector('.hero-slideshow');
        if (!slideshow) return;
        
        // Create slide elements
        images.forEach((src, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-bg';
            slideDiv.style.backgroundImage = `url('${src}')`;
            if (index === 0) slideDiv.classList.add('active');
            slideshow.appendChild(slideDiv);
        });
        
        // Preload images
        images.forEach(src => { const img = new Image(); img.src = src; });
        
        function showNext() {
            const slides = slideshow.querySelectorAll('.slide-bg');
            slides[current].classList.remove('active');
            current = (current + 1) % images.length;
            slides[current].classList.add('active');
        }
        
        setInterval(showNext, 3000);
    })();
    
    // Gallery Slideshow
    let slideIndex = 1;
    
    // Initialize slideshow - show first slide immediately with a small delay to ensure DOM is ready
    setTimeout(() => {
        showSlides(slideIndex);
    }, 100);
    
    // Auto-advance slideshow every 4 seconds
    setInterval(() => {
        changeSlide(1);
    }, 4000);
    
    // Gallery Background Slideshow with fade effect
    (function() {
        const galleryImages = [
            'assets/images/JUN00079.jpg',
            'assets/images/JUN00094.jpg',
            'assets/images/JUN00414.jpg',
            'assets/images/JUN00513.jpg',
            'assets/images/JUN00580.jpg',
            'assets/images/JUN00588.jpg',
            'assets/images/JUN00620.jpg',
            'assets/images/JUN00657.jpg',
            'assets/images/JUN00745.jpg',
            'assets/images/JUN00761-1.jpg',
            'assets/images/JUN00804.jpg',
            'assets/images/JUN00807.jpg',
            'assets/images/JUN00827.jpg',
            'assets/images/JUN09126.jpg',
            'assets/images/JUN09150.jpg',
            'assets/images/JUN09179.jpg',
            'assets/images/JUN09191.jpg',
            'assets/images/JUN09265-1.jpg',
            'assets/images/JUN09272.jpg',
            'assets/images/JUN09340.jpg',
            'assets/images/JUN09366.jpg',
            'assets/images/JUN09378.jpg',
            'assets/images/JUN09397.jpg',
            'assets/images/JUN09411.jpg',
            'assets/images/JUN09501.jpg',
            'assets/images/JUN09596.jpg',
            'assets/images/JUN09631.jpg',
            'assets/images/JUN09685.jpg',
            'assets/images/JUN09826.jpg',
            'assets/images/JUN09829.jpg',
            'assets/images/JUN09861.jpg',
            'assets/images/JUN09922.jpg',
            'assets/images/JUN09939.jpg',
            'assets/images/YRB03197.jpg',
            'assets/images/YRB03256.jpg',
            'assets/images/YRB03263.jpg'
        ];
        let currentGallery = 0;
        const gallerySlideshow = document.querySelector('.gallery-slideshow-bg');
        if (!gallerySlideshow) return;
        
        // Create slide elements
        galleryImages.forEach((src, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-bg';
            slideDiv.style.backgroundImage = `url('${src}')`;
            if (index === 0) slideDiv.classList.add('active');
            gallerySlideshow.appendChild(slideDiv);
        });
        
        // Preload images
        galleryImages.forEach(src => { const img = new Image(); img.src = src; });
        
        function showNextGallery() {
            const slides = gallerySlideshow.querySelectorAll('.slide-bg');
            slides[currentGallery].classList.remove('active');
            currentGallery = (currentGallery + 1) % galleryImages.length;
            slides[currentGallery].classList.add('active');
        }
        
        setInterval(showNextGallery, 3000);
    })();

    // Make pastel circles clickable on iOS
    document.querySelectorAll('.pastel-circle').forEach(function(circle) {
        circle.addEventListener('touchstart', function(e) {
            // This empty handler enables tap on iOS
        });
    });
});

// Slideshow functions
function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('active');
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}