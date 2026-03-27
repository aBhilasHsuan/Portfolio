// 2. Animate Hero Title Letters
document.addEventListener('DOMContentLoaded', () => {
    // 10. Modern Splash Sequence (Choreograph with GSAP)
    const splashBg = document.getElementById('splash-bg');
    const mainLogo = document.getElementById('main-logo');
    const header = document.querySelector('.header');

    if (splashBg && mainLogo && header) {
        // Initial state before timeline starts
        mainLogo.style.opacity = '0';
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        
        const tl = gsap.timeline({
            defaults: { ease: "power4.inOut" }
        });

        // 1. Reveal Loading Logo (Centers and fades in)
        tl.fromTo(mainLogo, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 1 }
        );

        // 2. Hold momentarily
        tl.to({}, { duration: 0.4 });

        // 3. Kick off Splash Reveal & Move Logo to Header Position
        tl.add('split');
        
        tl.to(splashBg, {
            yPercent: -100,
            duration: 1.4,
            ease: "expo.inOut"
        }, 'split');

        // Transition logo from center to header position (smoothly)
        const isMobile = window.innerWidth <= 768;
        tl.to(mainLogo, {
            top: isMobile ? '1.2rem' : '18px',
            left: isMobile ? '1.5rem' : '48px',
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            duration: 1.2,
            ease: "expo.inOut",
            onStart: () => {
                mainLogo.classList.remove('is-loading');
                document.body.classList.add('loaded'); // Trigger cursor-glow visibility
            }
        }, 'split+=0.3');

        // Reveal the fixed header and other page elements
        tl.to(header, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, 'split+=0.8');

        // Remove splash from DOM after animation completes to clean up the tree
        tl.to(splashBg, {
            display: 'none',
            duration: 0
        });
    }

    // 0. Initialize Lenis for Smooth Scrolling (AFTER splash setup)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        }
    });

    // 3. Sophisticated Scroll Reveals
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 60 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 3b. Portfolio Navigation Logic (Nakula style)
    const workSection = document.getElementById('work');
    const portfolioNav = document.querySelector('.portfolio-nav');
    if (workSection && portfolioNav) {
        ScrollTrigger.create({
            trigger: workSection,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => portfolioNav.classList.add('visible'),
            onLeave: () => portfolioNav.classList.remove('visible'),
            onEnterBack: () => portfolioNav.classList.add('visible'),
            onLeaveBack: () => portfolioNav.classList.remove('visible'),
        });
    }

    const portfolioSlides = document.querySelectorAll('.portfolio-slide');
    const navItems = document.querySelectorAll('.nav-item');
    portfolioSlides.forEach((slide, i) => {
        ScrollTrigger.create({
            trigger: slide,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: self => {
                if (self.isActive) {
                    navItems.forEach(item => item.classList.remove('active'));
                    const navItem = document.querySelector(`.nav-item[data-project="${i}"]`);
                    if (navItem) navItem.classList.add('active');
                }
            }
        });
    });

    // Manual click scrolling for sidebar
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectIndex = item.getAttribute('data-project');
            const target = document.getElementById(`project-${projectIndex}`);
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });

    // 4. Parallax Image Effects
    const projectImages = document.querySelectorAll('.visual-mask img');
    projectImages.forEach(img => {
        gsap.fromTo(img, 
            { yPercent: -15, scale: 1.1 },
            { 
                yPercent: 15,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });

    // 5. Magnetic Buttons (Keep existing logic)
    const magneticElements = document.querySelectorAll('.mag-btn');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease-out';
        });
    });

    // 6. Ticker Logic (handled in CSS, but ensure smooth resize)
    window.addEventListener('resize', () => ScrollTrigger.refresh());

    // 11. Hero Title Character Animation
    const title = document.querySelector('.hero-title');
    if (title) {
        const htmlContent = title.innerHTML;
        const lines = htmlContent.split('<br>');
        title.innerHTML = '';

        let delayCounter = 0;
        lines.forEach((line, index) => {
            const words = line.split(' ');
            words.forEach((word, wordIdx) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';

                [...word].forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.innerHTML = char === ' ' ? '&nbsp;' : char;
                    charSpan.classList.add('char');
                    charSpan.style.animationDelay = `${delayCounter * 0.05}s`;
                    wordSpan.appendChild(charSpan);
                    delayCounter++;
                });

                title.appendChild(wordSpan);
                if (wordIdx < words.length - 1) {
                    title.appendChild(document.createTextNode(' '));
                }
            });
            if (index < lines.length - 1) {
                title.appendChild(document.createElement('br'));
            }
        });
    }

    // 12. Cursor Glow Follow Mouse Logic
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateGlow = () => {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            requestAnimationFrame(updateGlow);
        };
        updateGlow();
    }
});
