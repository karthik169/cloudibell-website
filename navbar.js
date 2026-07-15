/* =========================================================
   Cloudibell Tech — Navigation Bar behavior
   Handles: scroll shadow, hamburger <-> X morph, right-side
   slide-in mobile menu (with overlay, outside-click close,
   item-click close, Escape close, body scroll lock), and
   active-link highlighting on scroll (index.html) / by page
   (contact.html).
   ========================================================= */
(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('navOverlay');

    if (!navbar) return;

    /* ---------------- shadow on scroll ---------------- */
    function updateScrollShadow() {
        navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', updateScrollShadow, { passive: true });
    updateScrollShadow();

    /* ---------------- mobile slide-in menu ---------------- */
    if (toggle && menu && overlay) {
        const mobileLinks = menu.querySelectorAll('.mobile-link');

        function openMenu() {
            menu.classList.add('is-open');
            overlay.classList.add('is-open');
            toggle.classList.add('is-active');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('nav-open');
        }

        function closeMenu() {
            menu.classList.remove('is-open');
            overlay.classList.remove('is-open');
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        }

        function toggleMenu() {
            if (menu.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        toggle.addEventListener('click', toggleMenu);

        // close when clicking the overlay (outside the panel)
        overlay.addEventListener('click', closeMenu);

        // close when a menu item is clicked
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // close on Escape
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMenu();
        });

        // if the viewport grows back to desktop size, make sure the
        // mobile menu isn't left open/scroll-locked
        window.addEventListener('resize', function () {
            if (window.innerWidth > 991) closeMenu();
        });
    }

    /* ---------------- active link highlighting ---------------- */
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const currentFile = (window.location.pathname.split('/').pop() || 'index.html');

    function setActiveByMatch(matchFn) {
        allNavLinks.forEach(function (link) {
            link.classList.toggle('active', matchFn(link));
        });
    }

    if (currentFile === 'contact.html') {
        // static page — just mark "Contact" active
        setActiveByMatch(function (link) {
            const href = link.getAttribute('href') || '';
            return href.indexOf('contact.html') !== -1;
        });
    } else {
        // index.html — highlight based on which section is in view
        const sectionIds = ['home', 'about', 'services', 'team'];
        const sectionEls = sectionIds
            .map(function (id) { return document.getElementById(id); })
            .filter(Boolean);

        function setActiveById(id) {
            setActiveByMatch(function (link) {
                const href = link.getAttribute('href') || '';
                return href === '#' + id || href.endsWith('#' + id);
            });
        }

        if (sectionEls.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            setActiveById(entry.target.id);
                        }
                    });
                },
                { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
            );

            sectionEls.forEach(function (el) { observer.observe(el); });
        }

        setActiveById('home');
    }
})();