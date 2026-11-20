// ========================================
// DOM ELEMENTS
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const particlesContainer = document.getElementById('particles');

// ========================================
// NAVIGATION SCROLL EFFECT
// ========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for all anchor links (fallback for browsers without CSS support)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.stopPropagation();
            
            // Trigger click animation for nav-logo
            if (this.classList.contains('nav-logo')) {
                const logo = this;
                logo.classList.remove('clicked');
                void logo.offsetWidth; // Force reflow
                logo.classList.add('clicked');
                
                // Remove class after animation completes
                setTimeout(() => {
                    logo.classList.remove('clicked');
                }, 400);
            }
            
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ========================================
// PARTICLE SYSTEM
// ========================================
class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.size = Math.random() * 2 + 1;
        this.x = Math.random() * Math.max(0, window.innerWidth - this.size);
        this.y = Math.random() * Math.max(0, window.innerHeight - this.size);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = [
            'rgba(99, 102, 241, ',   // Primary purple
            'rgba(6, 182, 212, ',   // Secondary cyan
            'rgba(244, 114, 182, ', // Accent pink
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return color;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around screen (keeping particles fully inside the viewport)
        const maxX = Math.max(0, window.innerWidth - this.size);
        const maxY = Math.max(0, window.innerHeight - this.size);
        if (this.x < 0) this.x = maxX;
        if (this.x > maxX) this.x = 0;
        if (this.y < 0) this.y = maxY;
        if (this.y > maxY) this.y = 0;
    }
    
    draw() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = `${this.x}px`;
        particle.style.top = `${this.y}px`;
        particle.style.width = `${this.size}px`;
        particle.style.height = `${this.size}px`;
        particle.style.borderRadius = '50%';
        particle.style.background = `${this.color}${this.opacity})`;
        particle.style.pointerEvents = 'none';
        particle.style.transition = 'none';
        
        return particle;
    }
}

class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.numParticles = 50;
        this.init();
        this.animate();
    }
    
    init() {
        for (let i = 0; i < this.numParticles; i++) {
            const particle = new Particle();
            this.particles.push(particle);
            this.container.appendChild(particle.draw());
        }
    }
    
    animate() {
        this.particles.forEach((particle, index) => {
            particle.update();
            const element = this.container.children[index];
            if (element) {
                element.style.left = `${particle.x}px`;
                element.style.top = `${particle.y}px`;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles when DOM is loaded
if (particlesContainer) {
    new ParticleSystem(particlesContainer);
}

// ========================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.section-title, .game-card, .testimonial-card, .talk-card, .contact-card, ' +
        '.code-highlight, .album-card, .reel-card, .image-frame, .stat-item, .skill-category, ' +
        '.about-text, .about-cta, .hero-stats, .hero-flow, .contact-text, .contact-methods'
    );

    animatedElements.forEach(el => {
        el.classList.add('animated-element');
        observer.observe(el);
    });
});

// ========================================
// NUMBER COUNTER ANIMATION
// ========================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                animateCounter(statNumber);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(item => {
    counterObserver.observe(item);
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// GLITCH EFFECT ON HOVER
// ========================================
const logoText = document.querySelector('.logo-text');
const logoGlitch = document.querySelector('.logo-glitch');

if (logoText && logoGlitch) {
    logoText.addEventListener('mouseenter', () => {
        logoGlitch.style.opacity = '1';
        logoGlitch.style.animation = 'glitch 0.3s infinite';
    });
    
    logoText.addEventListener('mouseleave', () => {
        logoGlitch.style.animation = 'glitch 3s infinite';
    });
}

// ========================================
// PARALLAX EFFECT ON MOUSE MOVE
// ========================================
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function parallaxEffect() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    
    const bgGrid = document.querySelector('.bg-grid');
    if (bgGrid) {
        const moveX = currentX * 20;
        const moveY = currentY * 20;
        // Move the pattern instead of transforming the element: a transform on a
        // fixed, negative-z-index element can extend the scrollable area and makes
        // the grid disappear on iOS Safari.
        bgGrid.style.backgroundPosition = `${moveX}px ${moveY}px`;
    }
    
    requestAnimationFrame(parallaxEffect);
}

parallaxEffect();

// ========================================
// TYPING EFFECT FOR HERO SUBTITLE
// ========================================
function typingEffect(element, text, speed = 150) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========================================
// CARD HOVER EFFECTS
// ========================================
const cards = document.querySelectorAll('.game-card, .testimonial-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// PRELOADER
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// CONSOLE EASTER EGG
// ========================================
console.log('%c🎮 Welcome to Matheus Vilano\'s Portfolio! 🎮', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cLooking for code? Check out the Code section or visit my GitHub!', 'color: #06b6d4; font-size: 14px;');

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Debounce function for resize events
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

// Handle resize
window.addEventListener('resize', debounce(() => {
    // Reinitialize any responsive features here
}, 250));

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================
// Keyboard navigation for mobile menu
navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navToggle.click();
    }
});

// Focus trap for mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.focus();
    }
});

// ========================================
// LAZY LOADING FOR IMAGES
// ========================================
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// GAME GALLERY INITIALIZER (Reusable)
// ========================================
function initGallery(galleryEl) {
    const slides = galleryEl.querySelectorAll('.gallery-slide');
    const prevBtn = galleryEl.querySelector('.gallery-btn.prev');
    const nextBtn = galleryEl.querySelector('.gallery-btn.next');
    const dotsContainer = galleryEl.querySelector('.gallery-dots');

    if (slides.length === 0) return;

    let currentIndex = 0;

    // Build dots only if there is more than one image
    if (dotsContainer && slides.length > 1) {
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (idx === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to image ${idx + 1}`);
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    function updateGallery() {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateGallery();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateGallery();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateGallery();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Hide controls if there's only one image
    if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
    }

    updateGallery();
}

// ========================================
// PUBLISHED MUSIC: CUSTOM ALBUM PLAYERS
// YouTube IFrame API (full playback, playlists),
// video hidden behind a compact custom UI with
// the complete tracklist.
// ========================================
const ALBUMS = {
    sidequest: {
        playlist: 'OLAK5uy_npveUwyNfL2tvz4ApiDCdBRwpi8iHRItk',
        tracks: ['Melanchoholic', 'Lonyvibes', 'Reminiscence', 'Introspection']
    },
    solstice: {
        playlist: 'OLAK5uy_k-HnrfiT4kF6necKf_2nE0WbgHdwQcq5I',
        tracks: ['Nimbus', 'Horizon', 'Equinox', 'Zenith']
    },
    voicemail: {
        playlist: 'OLAK5uy_lMERzHt8WBHWRCCdkUJh-pDY73mWUNMsg',
        tracks: ['Reverie', 'Dawn', 'Echo', 'Assent']
    },
    primavera: {
        playlist: 'OLAK5uy_nBAz2JvTyf9wpmFD_zSmwC-Ff3fLvJxM4',
        tracks: ['Falling', 'Innerspring', 'Karma', 'Vazio', 'Girassol', 'Violeta']
    }
};

const albumPlayers = [];
let albumPollId = null;

function initAlbumPlayers() {
    const containers = document.querySelectorAll('.album-player');
    if (containers.length === 0) return;

    function fmtTime(s) {
        if (!isFinite(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, '0')}`;
    }

    function pauseAll(except) {
        albumPlayers.forEach(d => {
            if (d !== except && d.player && d.player.getPlayerState &&
                d.player.getPlayerState() === YT.PlayerState.PLAYING) {
                d.player.pauseVideo();
            }
        });
    }

    function startPolling() {
        if (albumPollId !== null) return;
        albumPollId = setInterval(() => {
            let anyPlaying = false;
            albumPlayers.forEach(d => {
                if (!d.ready) return;
                const state = d.player.getPlayerState();
                const playing = state === YT.PlayerState.PLAYING;
                if (playing) anyPlaying = true;
                const current = d.player.getCurrentTime() || 0;
                const duration = d.player.getDuration() || 0;
                d.bar.style.width = duration > 0 ? `${(current / duration) * 100}%` : '0';
                d.time.textContent = `${fmtTime(current)} / ${fmtTime(duration)}`;
            });
            if (!anyPlaying && albumPollId !== null) {
                clearInterval(albumPollId);
                albumPollId = null;
            }
        }, 400);
    }

    // Load the official IFrame Player API once
    function buildPlayers() {
        albumPlayers.forEach(d => {
            new YT.Player(d.mount, {
                videoId: d.firstVideoId,
                playerVars: {
                    listType: 'playlist',
                    list: d.playlist,
                    rel: 0,
                    playsinline: 1
                },
                events: {
                    onReady: (e) => {
                        d.ready = true;
                        d.player = e.target;
                    },
                    onStateChange: (e) => {
                        const state = e.data;
                        const playing = state === YT.PlayerState.PLAYING;
                        d.el.classList.toggle('playing', playing);
                        d.playBtn.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
                        d.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
                        // Tracklist highlighting + index badge
                        const index = d.player.getPlaylistIndex ? d.player.getPlaylistIndex() : -1;
                        d.items.forEach((li, i) => li.classList.toggle('active', i === index));
                        if (playing) startPolling();
                    }
                }
            });
        });
    }

    containers.forEach(el => {
        const key = el.dataset.album;
        const data = ALBUMS[key];
        if (!data) return;

        // Hidden player mount (YouTube replaces this div with an iframe)
        const mountWrap = document.createElement('div');
        mountWrap.className = 'album-player-mount';
        const mount = document.createElement('div');
        mountWrap.appendChild(mount);
        el.appendChild(mountWrap);

        // Tracklist items (YouTube videoId needed for the first load only)
        const tracklist = el.querySelector('.album-tracklist');
        const items = data.tracks.map((name, i) => {
            const li = document.createElement('li');
            li.textContent = name;
            li.addEventListener('click', () => {
                if (!d.ready) return;
                pauseAll(d);
                d.player.playVideoAt(i);
            });
            tracklist.appendChild(li);
            return li;
        });

        const d = {
            el,
            mount,
            playlist: data.playlist,
            // First videoId kicks off the playlist; the playlist param takes over after
            firstVideoId: el.querySelector('.album-art').src.match(/vi\/([^/]+)\//)[1],
            playBtn: el.querySelector('.album-play'),
            prevBtn: el.querySelector('.album-prev'),
            nextBtn: el.querySelector('.album-next'),
            progress: el.querySelector('.album-progress'),
            bar: el.querySelector('.album-progress-bar'),
            time: el.querySelector('.album-time'),
            items,
            ready: false,
            player: null
        };
        albumPlayers.push(d);

        d.playBtn.addEventListener('click', () => {
            if (!d.ready) return;
            const state = d.player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                d.player.pauseVideo();
            } else {
                pauseAll(d);
                d.player.playVideo();
            }
        });

        d.prevBtn.addEventListener('click', () => d.ready && d.player.previousVideo());
        d.nextBtn.addEventListener('click', () => d.ready && d.player.nextVideo());

        d.progress.addEventListener('click', (e) => {
            if (!d.ready) return;
            const rect = d.progress.getBoundingClientRect();
            const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            d.player.seekTo(d.player.getDuration() * fraction, true);
        });
    });

    if (window.YT && window.YT.Player) {
        buildPlayers();
    } else {
        window.onYouTubeIframeAPIReady = buildPlayers;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/player_api';
        document.head.appendChild(tag);
    }
}

// Pause music when the music carousel changes slides
function pauseAllAlbumPlayers() {
    albumPlayers.forEach(d => {
        if (d.ready && d.player.getPlayerState && d.player.getPlayerState() === YT.PlayerState.PLAYING) {
            d.player.pauseVideo();
        }
    });
}

// ========================================
// CAROUSEL INITIALIZER (Reusable)
// ========================================
function initCarousel(containerSelector) {
    const containers = document.querySelectorAll(containerSelector);
    
    containers.forEach(carouselContainer => {
        const track = carouselContainer.querySelector('.carousel-track');
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const prevBtn = carouselContainer.querySelector('.carousel-btn.prev');
        const nextBtn = carouselContainer.querySelector('.carousel-btn.next');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');

        if (slides.length === 0 || !prevBtn || !nextBtn || !dotsContainer) return;

        let currentIndex = 0;

        // Find the tallest slide and set all slides to that height
        function syncSlideHeights() {
            // Reset all slides to auto height first
            slides.forEach(slide => {
                slide.style.height = 'auto';
            });
            
            // Find the maximum height
            let maxHeight = 0;
            slides.forEach(slide => {
                const height = slide.offsetHeight;
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
            
            // Set all slides to the max height
            slides.forEach(slide => {
                slide.style.height = `${maxHeight}px`;
            });
        }

        // Create dot indicators
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });

        const dots = carouselContainer.querySelectorAll('.carousel-dot');

        function updateCarousel() {
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentIndex);
            });
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
            // Stop music playback when switching album pages
            if (carouselContainer.classList.contains('music-carousel')) {
                pauseAllAlbumPlayers();
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Touch swipe navigation (horizontal only, so vertical scrolling still works)
        if (track) {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchDeltaX = 0;
            let isSwiping = false;

            track.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchDeltaX = 0;
                isSwiping = false;
            }, { passive: true });

            track.addEventListener('touchmove', (e) => {
                if (e.touches.length !== 1) return;
                const deltaX = e.touches[0].clientX - touchStartX;
                const deltaY = e.touches[0].clientY - touchStartY;

                if (!isSwiping) {
                    if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX)) {
                        return;
                    }
                    if (Math.abs(deltaX) > 10) {
                        isSwiping = true;
                    }
                }

                if (isSwiping) {
                    touchDeltaX = deltaX;
                    e.preventDefault();
                }
            }, { passive: false });

            track.addEventListener('touchend', () => {
                if (isSwiping && Math.abs(touchDeltaX) > 40) {
                    if (touchDeltaX < 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                isSwiping = false;
                touchDeltaX = 0;
            });
        }

        // Initialize heights and carousel
        syncSlideHeights();
        updateCarousel();
        
        // Recalculate heights on window resize
        window.addEventListener('resize', syncSlideHeights);
    });
}

// ========================================
// HERO STATS: CURSOR-PROXIMITY BORDER GLOW
// The closer the cursor is to a card, the more its border glows.
// ========================================
function initStatProximityGlow() {
    const stats = document.querySelectorAll('.stat-item');
    const hero = document.querySelector('.hero');
    if (stats.length === 0 || !hero) return;

    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;

    function updateGlows() {
        rafId = null;
        stats.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
            const influenceRadius = Math.max(rect.width, rect.height) * 1.25;
            const intensity = Math.max(0, 1 - distance / influenceRadius);
            card.style.setProperty('--stat-glow', intensity.toFixed(3));
        });
    }

    hero.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (rafId === null) {
            rafId = requestAnimationFrame(updateGlows);
        }
    });

    hero.addEventListener('mouseleave', () => {
        stats.forEach(card => card.style.setProperty('--stat-glow', '0'));
    });
}

// Initialize all carousels and galleries
document.addEventListener('DOMContentLoaded', () => {
    initStatProximityGlow();
    initAlbumPlayers();
    initCarousel('.skills-carousel');
    initCarousel('.testimonials-carousel');
    initCarousel('.games-carousel');
    initCarousel('.talks-carousel');
    initCarousel('.reels-carousel');
    initCarousel('.music-carousel');
    
    // Initialize game galleries
    document.querySelectorAll('[data-gallery]').forEach(initGallery);
});

