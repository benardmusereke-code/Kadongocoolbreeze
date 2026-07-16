/* ============================================
   KADONGO COOL BREEZ — Core JavaScript
   Shared functionality across all pages
   ============================================ */

(function () {
    'use strict';

    /* ---- Lenis Smooth Scroll ---- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* ---- GSAP Registration ---- */
    gsap.registerPlugin(ScrollTrigger);

    /* ---- Loader ---- */
    function hideLoader() {
        const loader = document.querySelector('.loader-overlay');
        if (loader) loader.classList.add('done');
        const content = document.querySelector('.page-content');
        if (content) content.classList.add('loaded');
        initHeroAnimations();
    }

    window.addEventListener('load', () => setTimeout(hideLoader, 1800));
    setTimeout(hideLoader, 3500); // fallback

    /* ---- Hero Animations ---- */
    function initHeroAnimations() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.to('.hero-title .line-inner', { y: 0, duration: 1.4, stagger: 0.15 })
            .to('.hero-badge', { opacity: 1, y: 0, duration: 1 }, '-=1')
            .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1 }, '-=0.7')
            .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
    }

    /* ---- Header Scroll ---- */
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        }, { passive: true });
    }

    /* ---- Mobile Menu ---- */
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    if (hamburger && navMobile) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });

        navMobile.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---- Reveal on Scroll ---- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger, .scale-reveal, .img-reveal, .section-eyebrow, .section-title, .section-lead').forEach(el => {
        revealObserver.observe(el);
    });

    /* ---- Parallax Effects ---- */
    document.querySelectorAll('.page-hero-bg').forEach(bg => {
        gsap.to(bg, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: bg.closest('.page-hero'),
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });
    });

    /* ---- Footer Year ---- */
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- Cookie Consent ---- */
    function acceptCookies() {
        localStorage.setItem('kadongo_cookies_accepted', 'true');
        closeCookieConsent();
    }

    function rejectCookies() {
        localStorage.setItem('kadongo_cookies_accepted', 'rejected');
        closeCookieConsent();
    }

    function closeCookieConsent() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.style.display = 'none', 600);
        }
    }

    window.addEventListener('load', () => {
        if (!localStorage.getItem('kadongo_cookies_accepted')) {
            setTimeout(() => {
                const banner = document.getElementById('cookieConsent');
                if (banner) banner.classList.add('show');
            }, 4000);
        }
    });

    /* ---- Resize ---- */
    window.addEventListener('resize', () => ScrollTrigger.refresh());

    /* ---- Expose to global for page-specific scripts ---- */
    window.Kadongo = {
        lenis,
        gsap,
        ScrollTrigger,
        acceptCookies,
        rejectCookies,
        initHeroAnimations,
    };
})();
