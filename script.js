document.addEventListener('DOMContentLoaded', () => {
    // Hero Slider Logic
    const heroSlides = document.querySelectorAll('.hero-slider .slide');
    const heroDots = document.querySelectorAll('.hero-dots .dot');
    const nextHeroBtn = document.querySelector('.next-hero');
    const prevHeroBtn = document.querySelector('.prev-hero');
    let currentHeroSlide = 0;
    let heroSliderTimer;

    function showHeroSlide(index) {
        // Remove active class from all slides and dots
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));

        // Handle index wrapping
        if (index >= heroSlides.length) currentHeroSlide = 0;
        else if (index < 0) currentHeroSlide = heroSlides.length - 1;
        else currentHeroSlide = index;

        // Add active class to current
        heroSlides[currentHeroSlide].classList.add('active');
        heroDots[currentHeroSlide].classList.add('active');

        // Reset timer
        resetHeroTimer();
    }

    function nextHeroSlide() {
        currentHeroSlide++;
        showHeroSlide(currentHeroSlide);
    }

    function prevHeroSlide() {
        currentHeroSlide--;
        showHeroSlide(currentHeroSlide);
    }

    function resetHeroTimer() {
        clearInterval(heroSliderTimer);
        heroSliderTimer = setInterval(nextHeroSlide, 6000); // 6 seconds auto-play
    }

    if (heroSlides.length > 0) {
        // Init navigation
        nextHeroBtn.addEventListener('click', nextHeroSlide);
        prevHeroBtn.addEventListener('click', prevHeroSlide);

        heroDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                currentHeroSlide = idx;
                showHeroSlide(currentHeroSlide);
            });
        });

        // Start auto-play
        resetHeroTimer();
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Handle text reveal spans
                const spans = entry.target.querySelectorAll('.reveal-text span');
                spans.forEach((span, index) => {
                    span.style.transitionDelay = `${index * 0.1}s`;
                });
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => revealObserver.observe(el));

    // Stats Counter Animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.innerText = Math.floor(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + '+';
                        }
                    };
                    updateCounter();
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) statsObserver.observe(statsSection);

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission (Real submission to Formspree via AJAX)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            const formData = new FormData(contactForm);

            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.innerText = 'Message Sent!';
                    btn.style.backgroundColor = '#25D366';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                btn.innerText = 'Error! Try again.';
                btn.style.backgroundColor = '#ff4d4d';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // Cursor Follower
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);

    window.addEventListener('mousemove', (e) => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    // Word Reveal Helper
    const wordReveals = document.querySelectorAll('.word-reveal');
    wordReveals.forEach(el => {
        const text = el.innerText;
        el.innerHTML = text.split(' ').map(word => `<span>${word}</span>`).join(' ');
    });

    // Intersection Observer update for word reveal
    const animatedLines = document.querySelectorAll('.animated-line');
    animatedLines.forEach(line => revealObserver.observe(line));

    // Parallax Scroll Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const parallaxItems = document.querySelectorAll('.parallax-bg');

        parallaxItems.forEach(item => {
            const speed = item.getAttribute('data-speed') || 0.2;
            item.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Magnet Effect for Primary Buttons
    const magnetButtons = document.querySelectorAll('.btn-primary');
    magnetButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
    });

    // Services Slider Logic
    const servicesSlider = document.querySelector('.services-slider');
    const nextServicesBtn = document.querySelector('.next-services');
    const prevServicesBtn = document.querySelector('.prev-services');

    if (servicesSlider && nextServicesBtn && prevServicesBtn) {
        let counter = 0;
        const getCardWidth = () => {
            const card = document.querySelector('.service-card');
            return card ? card.offsetWidth + 32 : 382; // card width + gap
        };

        nextServicesBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            const maxScroll = servicesSlider.scrollWidth - servicesSlider.parentElement.clientWidth;
            if (Math.abs(counter * cardWidth) < maxScroll) {
                counter++;
                servicesSlider.style.transform = `translateX(-${counter * cardWidth}px)`;
            } else {
                counter = 0; // Loop back to start
                servicesSlider.style.transform = `translateX(0)`;
            }
        });

        prevServicesBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            if (counter > 0) {
                counter--;
                servicesSlider.style.transform = `translateX(-${counter * cardWidth}px)`;
            }
        });
    }

    refreshIcons();
    setTimeout(refreshIcons, 500); // Pulse check for any late renders
});
