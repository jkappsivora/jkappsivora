/* ==========================================================================
   JK APPSIVORA - INTERACTION LOGIC
   ========================================================================== */

// Google Sheets Integration Config
// Replace this with your Google Web App URL once deployed
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyt11QQWfOhh7RFxmHF_oirjnnd8Lak7oKIhXAx4uuqMZhmL0B8uLBI04cW2-A77vcX8g/exec';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.site-header');
    const progressEl = document.getElementById('scrollProgress');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressEl.style.width = `${progress}%`;
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // 3b. Hero Headline Typing Animation
    const typingText = document.getElementById('typingText');
    if (typingText) {
        const words = ["Mobile Apps", "Custom Software", "SaaS Platforms", "Digital Solutions"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingText.innerText = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40; // faster deletion
            } else {
                typingText.innerText = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80; // normal typing
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at complete word
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 400; // pause before typing next word
            }

            setTimeout(type, typingSpeed);
        };

        setTimeout(type, 800); // start typing after 800ms
    }

    // 4. HTML5 Canvas Particles System (Interactive Hero Background)
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 130 };

        // Adjust canvas dimensions
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };

        // Track cursor coordinates
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Bounce on edges
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Interaction with mouse cursor (subtle pull/push)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        // Move particle slightly away from cursor
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= (dx / distance) * force * 1.5;
                        this.y -= (dy / distance) * force * 1.5;
                    }
                }

                // Normal movement
                this.x += this.directionX;
                this.y += this.directionY;

                this.draw();
            }
        }

        const initParticles = () => {
            particles = [];
            let numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);
            // Limit particles count for performance
            if (numberOfParticles > 90) numberOfParticles = 90;
            if (numberOfParticles < 30) numberOfParticles = 30;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * (canvas.width - size * 2) + size * 2);
                let y = (Math.random() * (canvas.height - size * 2) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;

                // Mix of neon cyan and purple semi-transparent particles
                let color = i % 2 === 0 ? 'rgba(0, 255, 255, 0.4)' : 'rgba(172, 38, 238, 0.4)';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        // Draw connections between points
        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 90) {
                        opacityValue = 1 - (distance / 90);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${opacityValue * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse cursor
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = particles[a].x - mouse.x;
                    let dy = particles[a].y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        opacityValue = 1 - (distance / mouse.radius);
                        ctx.strokeStyle = `rgba(172, 38, 238, ${opacityValue * 0.25})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // 5. Tech Section Tabs Switching
    const tabBtns = document.querySelectorAll('.tech-tab-btn');
    const panels = document.querySelectorAll('.tech-panel');

    const animatePanelBadges = (panel) => {
        const badges = panel.querySelectorAll('.tech-badge-card');
        badges.forEach((badge, index) => {
            badge.classList.remove('animate');
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(15px)';
            badge.style.transition = 'none';

            // Trigger reflow to restart animation
            void badge.offsetWidth;

            badge.style.transition = 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            badge.style.transitionDelay = `${index * 50}ms`;

            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
            badge.classList.add('animate');
        });
    };

    // Run animation on page load for initial active panel
    const activePanelOnLoad = document.querySelector('.tech-panel.active');
    if (activePanelOnLoad) {
        setTimeout(() => animatePanelBadges(activePanelOnLoad), 300);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active states
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Set current active state
            btn.classList.add('active');
            const panel = document.getElementById(targetTab);
            if (panel) {
                panel.classList.add('active');
                animatePanelBadges(panel);
            }
        });
    });

    // 6. Intersection Observer Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing after item is revealed to optimize performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // reveal slightly before entry
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Active Navigation Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.clientHeight;
            if (window.scrollY >= (sectionTop - 180)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}` ||
                (currentSectionId === 'home' && link.getAttribute('href') === '#')) {
                link.classList.add('active');
            }
        });
    });

    // 7. Contact Form Validation & Submission Logic
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const toast = document.getElementById('toastNotification');
    const toastClose = document.getElementById('toastClose');

    const showToast = (title, message) => {
        if (!toast) return;
        const toastTitle = toast.querySelector('h6');
        const toastMsg = toast.querySelector('p');
        if (toastTitle) toastTitle.innerText = title;
        if (toastMsg) toastMsg.innerText = message;
        toast.classList.add('show');
        // Auto hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    };

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (input, errorId, show) => {
        const group = input.closest('.form-group');
        if (show) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }
    };

    const validateForm = () => {
        let isValid = true;

        // Name
        if (!nameInput.value.trim()) {
            setError(nameInput, 'nameError', true);
            isValid = false;
        } else {
            setError(nameInput, 'nameError', false);
        }

        // Email
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            setError(emailInput, 'emailError', true);
            isValid = false;
        } else {
            setError(emailInput, 'emailError', false);
        }

        // Phone
        if (!phoneInput.value.trim()) {
            setError(phoneInput, 'phoneError', true);
            isValid = false;
        } else {
            setError(phoneInput, 'phoneError', false);
        }

        // Message
        if (!messageInput.value.trim()) {
            setError(messageInput, 'messageError', true);
            isValid = false;
        } else {
            setError(messageInput, 'messageError', false);
        }

        return isValid;
    };

    // Form inputs blur events for immediate feedback
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        input.addEventListener('blur', () => {
            if (input === emailInput) {
                setError(emailInput, 'emailError', !emailInput.value.trim() || !emailRegex.test(emailInput.value));
            } else {
                setError(input, input.id + 'Error', !input.value.trim());
            }
        });

        input.addEventListener('input', () => {
            // Remove error when user starts typing
            const group = input.closest('.form-group');
            group.classList.remove('error');
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm()) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;

                // Set loading status
                submitBtn.disabled = true;
                submitBtn.innerHTML = `Sending... <i data-lucide="loader" class="btn-icon animate-spin"></i>`;
                lucide.createIcons();

                // If URL is not configured, fallback to simulated success for easy local testing
                if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
                    console.warn("Google Sheets URL is not configured. Simulating submission.");
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();

                        showToast("Message Sent Successfully!", "We will get back to you within 24 hours.");
                        contactForm.reset();
                    }, 1200);
                    return;
                }

                // Send data to Google Sheet
                const formData = new URLSearchParams(new FormData(contactForm));
                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString(),
                    mode: 'no-cors' // Prevents CORS preflight blocks on Google Apps Script redirection
                })
                    .then(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();

                        showToast("Message Sent Successfully!", "We will get back to you within 24 hours.");
                        contactForm.reset();
                    })
                    .catch(error => {
                        console.error("Submission to Google Sheets failed:", error);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        lucide.createIcons();
                        alert("Oops! There was a network issue sending your message. Please try again.");
                    });
            }
        });
    }

    if (toastClose && toast) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }

    // 8. Newsletter Subscription
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input && input.value.trim() && emailRegex.test(input.value)) {
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
                
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<i data-lucide="loader" class="animate-spin" style="width: 16px; height: 16px; display: inline-block;"></i>`;
                    lucide.createIcons();
                }

                // If URL is not configured, fallback to simulated success for easy local testing
                if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnHtml;
                            lucide.createIcons();
                        }
                        showToast("Subscribed Successfully!", "Thank you for subscribing to our newsletter.");
                        newsletterForm.reset();
                    }, 1000);
                    return;
                }

                // Submit email subscription to the same Google Sheet
                const formData = new URLSearchParams();
                formData.append('name', 'Newsletter Subscriber');
                formData.append('email', input.value.trim());
                formData.append('phone', 'N/A');
                formData.append('message', 'Subscribed to Newsletter');

                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString(),
                    mode: 'no-cors'
                })
                .then(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                        lucide.createIcons();
                    }
                    showToast("Subscribed Successfully!", "Thank you for subscribing to our newsletter.");
                    newsletterForm.reset();
                })
                .catch(error => {
                    console.error("Newsletter subscription to Google Sheets failed:", error);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                        lucide.createIcons();
                    }
                    alert("Oops! There was an issue subscribing. Please try again later.");
                });
            }
        });
    }

    // 9. Stats Counting Animation
    const stats = document.querySelectorAll('.stat-num');
    const startCounting = (el) => {
        const text = el.innerText;
        const target = parseInt(text.replace(/[^0-9]/g, ''), 10);
        const suffix = text.replace(/[0-9]/g, '');
        let count = 0;
        const duration = 1500; // 1.5 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);

        el.innerText = '0' + suffix;
        const timer = setInterval(() => {
            count++;
            el.innerText = count + suffix;
            if (count >= target) {
                el.innerText = target + suffix;
                clearInterval(timer);
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Delay slightly for visual pacing
                setTimeout(() => startCounting(entry.target), 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    stats.forEach(s => statsObserver.observe(s));

    // 10. 3D Tilt Effect on Cards with Mouse Glow Coordinate Binding
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const tiltCards = document.querySelectorAll('.service-card, .portfolio-card, .why-card');

    tiltCards.forEach(card => {
        // Set relative position for glow pseudo-element compatibility
        card.style.position = 'relative';

        if (isTouch) return; // Skip 3D mousemove transforms on touch-based devices

        card.style.transformStyle = 'preserve-3d';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 10; // max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * -10; // max 10deg rotation

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.08s ease';

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        });
    });

    // 11. Magnetic Button Animation Effect
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Pull button slightly towards cursor
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // 12. 3D Parallax Layer Effect on Hero Visual Card Stack
    const heroVisual = document.getElementById('heroVisual');
    const mainCard = document.querySelector('.main-card');
    const secWrapper = document.querySelector('.secondary-wrapper');
    const tertWrapper = document.querySelector('.tertiary-wrapper');
    const secCard = document.querySelector('.secondary-card');
    const tertCard = document.querySelector('.tertiary-card');

    if (heroVisual && !isTouch) {
        heroVisual.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 1024) return;
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Normalize coordinate system (-0.5 to 0.5)
            const normX = x / (rect.width / 2);
            const normY = y / (rect.height / 2);

            // Rotate the tech graphic stack container slightly
            const container = heroVisual.querySelector('.tech-graphic');
            if (container) {
                container.style.transform = `perspective(1200px) rotateX(${normY * 12}deg) rotateY(${normX * -12}deg)`;
                container.style.transition = 'transform 0.08s ease';
            }

            // Translate the card elements relative to their depths (Parallax)
            if (mainCard) {
                mainCard.style.transform = `translate3d(${-normX * 8}px, ${-normY * 8}px, 30px)`;
                mainCard.style.transition = 'transform 0.08s ease';
            }

            if (tertCard && tertWrapper) {
                // Pause float animation
                tertWrapper.style.animationPlayState = 'paused';
                tertCard.style.transform = `translate3d(${-normX * 24}px, ${-normY * 24}px, 90px)`;
                tertCard.style.transition = 'transform 0.08s ease';
            }
        });

        heroVisual.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 1024) return;
            const container = heroVisual.querySelector('.tech-graphic');
            if (container) {
                container.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
                container.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            }

            if (mainCard) {
                mainCard.style.transform = 'translate3d(0, 0, 0)';
                mainCard.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            }

            if (tertCard && tertWrapper) {
                // Resume float animation
                tertWrapper.style.animationPlayState = 'running';
                tertCard.style.transform = 'translate3d(0, 0, 0)';
                tertCard.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            }
        });
    }
});
