/* ==========================================
   PFA LANDING PAGE - INTERACTIVE SCRIPT (JS)
   Features: Countdown, Accordion, Slider, WhatsApp Form
   Author: COA Tech / Antigravity
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 0. Theme Switcher (Light / Dark Theme)
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('pfa_theme') || 'light';

    // Apply the saved theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
            }
            
            localStorage.setItem('pfa_theme', theme);
            
            // Toggle icon class
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
    
    // ==========================================
    // 1. Mobile Menu Toggle
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navbar.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Close menu when clicking on any link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // ==========================================
    // 2. Rolling Countdown Timer for Urgency
    // ==========================================
    // Creates a persistent target date in localStorage so it doesn't reset on every refresh
    let countdownTarget = localStorage.getItem('pfa_countdown_target');
    
    if (!countdownTarget) {
        // Set target to 2 days, 14 hours, 32 minutes from now
        const now = new Date().getTime();
        const duration = (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000);
        countdownTarget = now + duration;
        localStorage.setItem('pfa_countdown_target', countdownTarget);
    } else {
        countdownTarget = parseInt(countdownTarget, 10);
        // If the saved target is in the past, reset it for a new 2-day period to keep the ad urgency active
        if (countdownTarget < new Date().getTime()) {
            const now = new Date().getTime();
            const duration = (2 * 24 * 60 * 60 * 1000) + (10 * 60 * 60 * 1000); // 2 days 10 hours
            countdownTarget = now + duration;
            localStorage.setItem('pfa_countdown_target', countdownTarget);
        }
    }

    const timerElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        miniDays: document.getElementById('miniDays'),
        miniHours: document.getElementById('miniHours'),
        miniMinutes: document.getElementById('miniMinutes'),
        miniSeconds: document.getElementById('miniSeconds')
    };

    function updateTimer() {
        const now = new Date().getTime();
        const difference = countdownTarget - now;

        if (difference <= 0) {
            // Timer finished (fallbacks)
            Object.values(timerElements).forEach(el => {
                if (el) el.textContent = '00';
            });
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const format = (num) => num.toString().padStart(2, '0');

        // Update pricing countdown
        if (timerElements.days) timerElements.days.textContent = format(days);
        if (timerElements.hours) timerElements.hours.textContent = format(hours);
        if (timerElements.minutes) timerElements.minutes.textContent = format(minutes);
        if (timerElements.seconds) timerElements.seconds.textContent = format(seconds);

        // Update hero countdown
        if (timerElements.miniDays) timerElements.miniDays.textContent = format(days);
        if (timerElements.miniHours) timerElements.miniHours.textContent = format(hours);
        if (timerElements.miniMinutes) timerElements.miniMinutes.textContent = format(minutes);
        if (timerElements.miniSeconds) timerElements.miniSeconds.textContent = format(seconds);
    }

    // Run timer immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);

    // ==========================================
    // 3. Syllabus & FAQ Accordion Logic
    // ==========================================
    // Syllabus Accordion (Allow one open at a time)
    const syllabusItems = document.querySelectorAll('.syllabus .accordion-item');
    syllabusItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            syllabusItems.forEach(i => i.classList.remove('active'));
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // FAQ Accordion (Allow multiple open)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // ==========================================
    // 4. Stats Counter Animation on Scroll
    // ==========================================
    const statsBar = document.querySelector('.stats-bar');
    const statNums = document.querySelectorAll('.stat-num');
    let counted = false;

    function startCounting() {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 1800; // ms
            const stepTime = Math.max(Math.floor(duration / target), 10);
            let current = 0;
            
            const timer = setInterval(() => {
                if (target < 50) {
                    current += 1;
                } else {
                    current += Math.ceil(target / 100);
                }
                
                if (current >= target) {
                    num.textContent = target.toLocaleString('en-US');
                    clearInterval(timer);
                } else {
                    num.textContent = current.toLocaleString('en-US');
                }
            }, stepTime);
        });
    }

    if (statsBar && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    startCounting();
                    counted = true;
                    observer.unobserve(statsBar);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsBar);
    } else {
        // Fallback for older browsers
        setTimeout(startCounting, 1000);
    }

    // ==========================================
    // 5. Testimonials Slider / Carousel
    // ==========================================
    const carousel = document.getElementById('testimonialsCarousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    if (carousel && slides.length > 0) {
        // Event Listeners for controls
        if (nextBtn) nextBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); }); // swapped for RTL
        if (prevBtn) prevBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); }); // swapped for RTL
        
        // Event Listeners for indicators
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.target.getAttribute('data-slide'), 10);
                showSlide(targetIdx);
                resetAutoplay();
            });
        });

        // Autoplay
        startAutoplay();

        function startAutoplay() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carousel.addEventListener('mouseleave', startAutoplay);
    }

    // ==========================================
    // 6. Booking Form Validation & WhatsApp Integration
    // ==========================================
    const bookingForm = document.getElementById('pfaBookingForm');
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');
    const modalRedirectBtn = document.getElementById('modalRedirectBtn');
    
    let generatedWhatsAppUrl = '';

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const accountingLevelEl = document.getElementById('accountingLevel');
            const accountingLevel = accountingLevelEl.options[accountingLevelEl.selectedIndex].text;
            
            // Simple validation check
            if (fullName === '' || phoneNumber === '') {
                alert('من فضلك املأ الحقول المطلوبة.');
                return;
            }

            // Create WhatsApp Custom Text Message
            const academyNumber = '201013907174'; // Academy phone
            const baseMessage = `السلام عليكم يا أكاديمية COA، أنا مهتم بكورس PFA الشامل في المحاسبة المالية الإلكترونية.
تفاصيل بياناتي:
- الاسم: ${fullName}
- الهاتف: ${phoneNumber}
- مستواي المحاسبي: ${accountingLevel}

أرغب في الاستفادة من الخصم (1000 جنيه بدلاً من 3500) والحصول على الماتريال وتفعيل حسابي.`;

            const encodedMessage = encodeURIComponent(baseMessage);
            generatedWhatsAppUrl = `https://wa.me/${academyNumber}?text=${encodedMessage}`;

            // Show Success Modal Popup
            if (successModal) {
                successModal.classList.add('active');
            } else {
                // Direct redirect if modal elements are missing
                window.open(generatedWhatsAppUrl, '_blank');
            }
        });
    }

    // Modal Close actions
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    if (modalRedirectBtn) {
        modalRedirectBtn.addEventListener('click', () => {
            window.open(generatedWhatsAppUrl, '_blank');
            successModal.classList.remove('active');
            if (bookingForm) bookingForm.reset();
        });
    }

    // Click outside modal content to close
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }
});
