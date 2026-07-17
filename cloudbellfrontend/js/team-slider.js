/* =========================================================
   Cloudibell Tech — Premium Team Carousel
   Step-by-step movement
   Starts from second card
   Slower premium animation
   Infinite seamless loop
   ========================================================= */

(function () {
    'use strict';

    const marquee = document.getElementById('teamMarquee');
    const track = document.getElementById('teamTrack');

    if (!marquee || !track) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) return;

    /* ---------- SETTINGS ---------- */

    // Slide animation duration
    const STEP_DURATION_MS = 1500;

    // Time each card stays centered
    const DWELL_MS = 3000;

    // Premium easing
    const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

    /* ------------------------------ */

    const cards = Array.from(track.querySelectorAll('.team-card'));
    const originalCount = cards.length / 2;

    let stepWidth = 0;
    let halfWidth = 0;
    let offsetX = 0;

    let activeCard = null;
    let cycleTimer = null;
    let isPaused = false;

    function measure() {

        const first = cards[0].getBoundingClientRect();
        const second = cards[1].getBoundingClientRect();

        stepWidth = second.left - first.left;
        halfWidth = stepWidth * originalCount;
    }

    function setActiveCard(card) {

        if (card === activeCard) return;

        if (activeCard) {
            activeCard.classList.remove('active');
        }

        if (card) {
            card.classList.add('active');
        }

        activeCard = card;
    }

    function getNearestCard() {

        const marqueeRect = marquee.getBoundingClientRect();
        const centerX = marqueeRect.left + marqueeRect.width / 2;

        let nearest = null;
        let nearestDistance = Infinity;

        cards.forEach(card => {

            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;

            const distance = Math.abs(cardCenter - centerX);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = card;
            }

        });

        return nearest;
    }

    function scheduleNext(delay) {

        clearTimeout(cycleTimer);
        cycleTimer = setTimeout(runCycle, delay);

    }

    function runCycle() {

        if (isPaused) {

            scheduleNext(200);
            return;

        }

        // Move exactly one card
        offsetX -= stepWidth;

        track.style.transition =
            `transform ${STEP_DURATION_MS}ms ${EASING}`;

        track.style.transform =
            `translateX(${offsetX}px)`;

        setTimeout(() => {

            // Reset after one duplicated set
            if (Math.abs(offsetX) >= halfWidth - 1) {

                track.style.transition = 'none';

                offsetX += halfWidth;

                track.style.transform =
                    `translateX(${offsetX}px)`;

                void track.offsetWidth;

            }

            setActiveCard(getNearestCard());

            scheduleNext(DWELL_MS);

        }, STEP_DURATION_MS);

    }

    function start() {

        measure();

        // Start from SECOND card
        offsetX = -stepWidth;

        track.style.transition = 'none';

        track.style.transform =
            `translateX(${offsetX}px)`;

        void track.offsetWidth;

        setActiveCard(getNearestCard());

        scheduleNext(DWELL_MS);

    }

    function stop() {

        clearTimeout(cycleTimer);

    }

    marquee.addEventListener('mouseenter', () => {

        isPaused = true;

    });

    marquee.addEventListener('mouseleave', () => {

        isPaused = false;

    });

    let resizePending = false;

    window.addEventListener('resize', () => {

        if (resizePending) return;

        resizePending = true;

        requestAnimationFrame(() => {

            measure();

            resizePending = false;

        });

    });

    const images = track.querySelectorAll('img');

    let loaded = 0;

    images.forEach(img => {

        if (img.complete) {

            loaded++;

        } else {

            img.addEventListener('load', () => {

                loaded++;

                if (loaded === images.length) {

                    measure();

                }

            });

            img.addEventListener('error', () => {

                loaded++;

            });

        }

    });

    reduceMotionQuery.addEventListener('change', e => {

        if (e.matches) {

            stop();

            track.style.transition = 'none';
            track.style.transform = 'none';

        } else {

            start();

        }

    });

    start();

})();