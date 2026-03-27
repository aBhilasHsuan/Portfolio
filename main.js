// 2. Animate Hero Title Letters
document.addEventListener('DOMContentLoaded', () => {
    // 10. Splash Screen Loader & Dynamic Logo
    const splash = document.getElementById('splash-bg');
    const mainLogo = document.getElementById('main-logo');
    const header = document.querySelector('.header');
    const fullMenu = document.getElementById('fullMenu');
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');

    // --- MENU LOGIC ---
    if (menuToggle && fullMenu && closeMenu) {
        menuToggle.addEventListener('click', () => {
            fullMenu.classList.add('is-active');
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden'; 
        });

        closeMenu.addEventListener('click', () => {
            fullMenu.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        });

        // Close menu on link click
        fullMenu.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                fullMenu.classList.remove('is-active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
    }

    if (splash && mainLogo && header) {
        // 1. Animate Logo Characters Reveal
        const logoText = mainLogo.textContent;
        mainLogo.innerHTML = '';
        [...logoText].forEach((char, i) => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            span.classList.add('char');
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)';
            span.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + (i * 0.05)}s`;
            mainLogo.appendChild(span);
        });

        requestAnimationFrame(() => {
            mainLogo.querySelectorAll('.char').forEach((span, i) => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        });

        // 2. Transition out
        setTimeout(() => {
            splash.classList.add('slide-up');
            mainLogo.classList.remove('is-loading');
            document.body.classList.add('loaded'); // Trigger cursor-glow visibility
        }, 1200);

        window.addEventListener('scroll', () => {

            if (window.scrollY > 50) {
                mainLogo.classList.add('is-scrolled');
                header.classList.add('is-scrolled');
            } else {
                mainLogo.classList.remove('is-scrolled');
                header.classList.remove('is-scrolled');
            }
        });
    }

    const title = document.querySelector('.hero-title');
    if (title) {
        const htmlContent = title.innerHTML;
        const lines = htmlContent.split('<br>');
        title.innerHTML = '';

        let delayCounter = 0;
        lines.forEach((line, index) => {
            const words = line.split(' ');
            words.forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';

                [...word].forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.innerHTML = char === ' ' ? '&nbsp;' : char;
                    charSpan.classList.add('char');
                    charSpan.style.animationDelay = `${delayCounter * 0.03}s`;
                    wordSpan.appendChild(charSpan);
                    delayCounter++;
                });

                title.appendChild(wordSpan);
                title.innerHTML += ' ';
            });
            if (index < lines.length - 1) {
                title.innerHTML += '<br>';
            }
        });
    }

    // 3. Main Scroll Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));

    // 4. About Section Word Reveal
    const revealTextElement = document.querySelector('.reveal-text');
    if (revealTextElement) {
        const text = revealTextElement.textContent.trim();
        const words = text.split(' ');
        revealTextElement.innerHTML = '';

        words.forEach(word => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            revealTextElement.appendChild(span);
        });

        const revealSpans = revealTextElement.querySelectorAll('span');

        window.addEventListener('scroll', () => {
            const rect = revealTextElement.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            let progress = 1 - ((rect.top - (windowHeight / 3)) / (rect.height));

            revealSpans.forEach((span, i) => {
                const triggerPoint = i / revealSpans.length;
                if (progress > triggerPoint) {
                    span.classList.add('active');
                } else {
                    span.classList.remove('active');
                }
            });
        });
    }

    // 5. Magnetic Buttons
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

    // 10. Portfolio Sidebar Logic
    const workSection = document.getElementById('work');
    const portfolioNav = document.querySelector('.portfolio-nav');
    const portfolioContainer = document.querySelector('.portfolio-container');
    const navItems = document.querySelectorAll('.nav-item');
    const portfolioSlides = document.querySelectorAll('.portfolio-slide');

    if (workSection && portfolioNav) {
        // Show/Hide sidebar based on work section involvement
        const workObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    portfolioNav.classList.add('visible');
                } else {
                    portfolioNav.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        workObserver.observe(workSection);
    }

    if (portfolioContainer && navItems.length > 0) {
        const slideObserverOptions = {
            root: null, // Global scroll tracking
            rootMargin: '0px',
            threshold: 0.7
        };

        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const projectId = entry.target.id.split('-')[1];
                    navItems.forEach(item => {
                        item.classList.toggle('active', item.dataset.project === projectId);
                    });
                }
            });
        }, slideObserverOptions);

        portfolioSlides.forEach(slide => slideObserver.observe(slide));

        // Sidebar click to scroll
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.dataset.project;
                const targetSlide = document.getElementById(`project-${projectId}`);
                if (targetSlide) {
                    targetSlide.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // 11. Glitch Effect for specific elements
    const glitchElements = document.querySelectorAll('.btn-more, .nav-text');
    glitchElements.forEach(el => {
        el.classList.add('glitch-hover');
    });

    // 6. Original Nakula View Cursor Track (Disabled for now as it doesn't fit the new style well)
    /*
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const viewBtn = card.querySelector('.view-btn');
        if (!viewBtn) return;

        card.addEventListener('mousemove', (e) => {
            viewBtn.style.left = `${e.clientX}px`;
            viewBtn.style.top = `${e.clientY}px`;
            viewBtn.style.marginLeft = '-50px';
            viewBtn.style.marginTop = '-50px';
        });
    });
    */

    // 8. Parallax Background
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        const massiveLogo = document.querySelector('.massive-logo');
        if (massiveLogo) {
            const footerTop = document.querySelector('.footer').offsetTop;
            const relativeScroll = scrolled + window.innerHeight - footerTop;

            if (relativeScroll > 0) {
                massiveLogo.style.transform = `translateX(-50%) translateY(${relativeScroll * -0.1}px)`;
            }
        }
    });

    // 9. Scroll To Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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
            // Add a slight lag for premium feel
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;

            requestAnimationFrame(updateGlow);
        };

        updateGlow();
    }
});
