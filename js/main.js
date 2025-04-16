/**
 * МАК "Коріння та крила" - основний JavaScript файл
 * Сайт рівня awwwards з розширеними анімаціями та взаємодією
 * Автор: Claude Sonnet 3.7 (2025)
 */

// Налаштування глобальних змінних
let currentSection = 0;
let isAnimating = false;
let touchStartY = 0;
let touchDeltaY = 0;
let sections = [];
let sectionAnimationTimelines = [];
let cursorX = 0;
let cursorY = 0;
let mouseX = 0;
let mouseY = 0;
let carouselRotation = 0;
let preloaderProgress = 0;
let preloaderInterval;

// Ініціалізація сайту після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація прелоадера
    initPreloader();
});

// Ініціалізація прелоадера
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const preloaderProgress = document.querySelector('.preloader-progress');
    const preloaderCounter = document.querySelector('.preloader-counter');
    
    // Симуляція завантаження ресурсів
    let progress = 0;
    let totalImages = document.querySelectorAll('img').length;
    let loadedImages = 0;
    
    // Функція для оновлення прогресу
    function updateProgress(value) {
        progress = value;
        preloaderProgress.style.width = `${progress}%`;
        preloaderCounter.textContent = `${Math.round(progress)}%`;
    }
    
    // Обробники завантаження для зображень з lazy-load
    document.querySelectorAll('.lazy-load').forEach(img => {
        const imgSrc = img.getAttribute('src');
        const tempImage = new Image();
        
        tempImage.onload = function() {
            loadedImages++;
            updateProgress((loadedImages / totalImages) * 100);
            
            // Якщо всі зображення завантажені, починаємо ініціалізацію сайту
            if (loadedImages >= totalImages) {
                completePreloader();
            }
        };
        
        tempImage.onerror = function() {
            loadedImages++;
            updateProgress((loadedImages / totalImages) * 100);
            
            // Якщо всі зображення завантажені, починаємо ініціалізацію сайту
            if (loadedImages >= totalImages) {
                completePreloader();
            }
        };
        
        // Починаємо завантаження зображення
        tempImage.src = imgSrc;
    });
    
    // Якщо зображень немає або вони завантажуються занадто довго, 
    // встановлюємо таймаут для завершення прелоадера
    setTimeout(() => {
        if (progress < 100) {
            completePreloader();
        }
    }, 5000);
    
    // Імітуємо мінімальний час завантаження для UX
    function completePreloader() {
        gsap.to(preloaderProgress, {
            width: '100%',
            duration: 0.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                const width = parseInt(preloaderProgress.style.width);
                preloaderCounter.textContent = `${Math.round(width)}%`;
            },
            onComplete: () => {
                // Анімація зникнення прелоадера
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        initSite();
                    }
                });
            }
        });
    }
}

// Ініціалізація сайту після завершення прелоадера
function initSite() {
    // Ініціалізація основних компонентів
    initSmoothScroll();
    initSections();
    initHeader();
    initMobileMenu();
    initCustomCursor();
    initAnimations();
    initLazyLoading();
    initSplitText();
    initInteractions();
    initBackToTop();
    initContactForm();
    initParticles();
    initCurrentYear();
    
    // Додаткові функції для специфічних секцій
    init3DCarousel();
    initCardDeck();
    init3DGridInteraction();
    
    // Активуємо першу секцію
    activateSection(currentSection);
}

// Ініціалізація плавного прокручування
function initSmoothScroll() {
    sections = document.querySelectorAll('.section');
    const smoothScrollContainer = document.querySelector('.smooth-scroll-container');
    
    // Налаштовуємо обробник колеса миші для всього документа
    document.addEventListener('wheel', function(e) {
        if (isAnimating) return;
        
        if (e.deltaY > 0) {
            // Прокручування вниз
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else {
            // Прокручування вгору
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    }, { passive: false });
    
    // Налаштовуємо обробники для тач-пристроїв
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (isAnimating) return;
        
        touchDeltaY = touchStartY - e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        if (isAnimating) return;
        
        if (touchDeltaY > 50) {
            // Свайп вгору (прокручування вниз)
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else if (touchDeltaY < -50) {
            // Свайп вниз (прокручування вгору)
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
        
        touchDeltaY = 0;
    }, { passive: true });
    
    // Обробник для клавіатури (стрілки вгору/вниз)
    document.addEventListener('keydown', function(e) {
        if (isAnimating) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
                e.preventDefault();
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
                e.preventDefault();
            }
        }
    });
    
    // Налаштування навігації по посиланнях з атрибутом href="#section-id"
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const index = Array.from(sections).indexOf(targetSection);
                if (index !== -1) {
                    scrollToSection(index);
                }
            }
            
            // Закриваємо мобільне меню при кліку на посилання
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

// Ініціалізація секцій та їх таймлайнів
function initSections() {
    sections.forEach((section, index) => {
        // Створюємо таймлайн для анімації переходу між секціями
        const timeline = gsap.timeline({
            paused: true,
            defaults: {
                duration: 1.2,
                ease: 'power2.inOut'
            }
        });
        
        // Додаємо анімацію входу
        timeline.fromTo(section, {
            opacity: 0,
            y: 100
        }, {
            opacity: 1,
            y: 0,
            duration: 1.2
        }, 0);
        
        // Додаємо анімацію виходу
        timeline.to(section, {
            opacity: 0,
            y: -100,
            duration: 1.2
        }, "exit");
        
        sectionAnimationTimelines.push(timeline);
    });
}

// Активація секції за індексом
function activateSection(index) {
    if (index < 0 || index >= sections.length) return;
    
    // Оновлюємо поточний індекс
    currentSection = index;
    
    // Активуємо поточну секцію
    sections.forEach((section, i) => {
        if (i === currentSection) {
            section.classList.add('active');
            section.style.visibility = 'visible';
            
            // Зупиняємо всі таймлайни та запускаємо активний
            sectionAnimationTimelines[i].progress(0).pause();
            sectionAnimationTimelines[i].play();
            
            // Запускаємо специфічні анімації для секції
            triggerSectionAnimations(section);
        } else {
            if (Math.abs(i - currentSection) > 1) {
                section.classList.remove('active');
                section.style.visibility = 'hidden';
            }
        }
    });
    
    // Оновлюємо навігацію
    updateNavigation();
}

// Прокручування до конкретної секції
function scrollToSection(index) {
    if (index < 0 || index >= sections.length || isAnimating) return;
    if (index === currentSection) return;
    
    isAnimating = true;
    
    // Фіксуємо напрямок прокрутки
    const direction = index > currentSection ? 'down' : 'up';
    
    // Знімаємо активний клас з поточної секції
    sections[currentSection].classList.remove('active');
    
    // Анімований перехід від поточної секції до наступної
    const tl = gsap.timeline({
        onComplete: () => {
            // Встановлюємо новий індекс
            currentSection = index;
            
            // Активуємо нову секцію
            activateSection(currentSection);
            
            // Знімаємо блокування прокрутки
            setTimeout(() => {
                isAnimating = false;
            }, 200);
        }
    });
    
    // Анімація виходу для поточної секції
    tl.to(sections[currentSection], {
        opacity: 0,
        y: direction === 'down' ? -100 : 100,
        duration: 0.8,
        ease: 'power2.inOut'
    }, 0);
    
    // Підготовка для входу нової секції
    tl.set(sections[index], {
        visibility: 'visible',
        opacity: 0,
        y: direction === 'down' ? 100 : -100
    }, 0);
    
    // Анімація входу для нової секції
    tl.to(sections[index], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.inOut'
    }, 0.4);
}

// Запуск специфічних анімацій для кожної секції
function triggerSectionAnimations(section) {
    const sectionId = section.getAttribute('data-section');
    
    // Запускаємо специфічні анімації залежно від типу секції
    switch (sectionId) {
        case 'hero':
            animateHeroSection();
            break;
        case 'cards-spread-1':
            animateCardsSpread();
            break;
        case 'cards-carousel':
            animateCardsCarousel();
            break;
        case 'falling-cards':
            animateFallingCards();
            break;
        case 'cards-grid-3d':
            animate3DGrid();
            break;
        case 'cards-deck':
            animateCardsDeck();
            break;
    }
}

// Оновлення навігації при зміні секцій
function updateNavigation() {
    // Оновлюємо видимість кнопки "Вгору"
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', currentSection > 0);
    }
    
    // Оновлюємо шапку
    const header = document.querySelector('.header');
    if (header) {
        if (currentSection === 0) {
            header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
        }
    }
}

// Ініціалізація шапки
function initHeader() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    // Оновлюємо стан шапки при прокручуванні
    window.addEventListener('scroll', function() {
        // Цей слухач не працюватиме з нашою кастомною прокруткою,
        // але залишаємо для сумісності з типовою прокруткою
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Приховуємо шапку при прокручуванні вниз
        if (currentScroll > lastScrollTop && currentScroll > 300) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// Ініціалізація мобільного меню
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        mobileMenuClose.addEventListener('click', toggleMobileMenu);
    }
    
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            
            // Анімуємо бургер-меню в хрестик
            const spans = mobileMenuToggle.querySelectorAll('span');
            gsap.to(spans[0], { rotation: 45, y: 8, duration: 0.3 });
            gsap.to(spans[1], { opacity: 0, duration: 0.3 });
            gsap.to(spans[2], { rotation: -45, y: -8, duration: 0.3 });
        } else {
            document.body.style.overflow = '';
            
            // Повертаємо бургер-меню
            const spans = mobileMenuToggle.querySelectorAll('span');
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    }
}

// Ініціалізація кастомного курсора
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    
    // Функція оновлення позиції курсора
    function updateCursorPosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    // Слідкуємо за рухом миші
    document.addEventListener('mousemove', updateCursorPosition);
    
    // Анімуємо курсор за допомогою requestAnimationFrame для плавності
    function animateCursor() {
        // Плавна інтерполяція для затримки курсора
        const easing = 0.2;
        
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        // Оновлюємо позицію елементів курсора
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorOutline.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorText.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Обробка наведення на інтерактивні елементи
    const interactiveElements = document.querySelectorAll('a, button, .btn, [class*="cursor-"]');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorOutline.classList.add('cursor-hover');
            
            // Перевіряємо, чи має елемент клас для акцентного курсора
            if (element.classList.contains('btn-accent') || element.classList.contains('cursor-accent')) {
                cursorOutline.classList.add('cursor-hover-accent');
            }
            
            // Перевіряємо, чи має елемент текст для курсора
            const cursorTextContent = element.getAttribute('data-cursor-text');
            if (cursorTextContent) {
                cursorText.textContent = cursorTextContent;
                cursorText.classList.add('cursor-text-visible');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover-accent');
            cursorText.classList.remove('cursor-text-visible');
        });
    });
    
    // Приховуємо курсор при виході з вікна
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            cursorDot.classList.add('cursor-hidden');
            cursorOutline.classList.add('cursor-hidden');
            cursorText.classList.add('cursor-hidden');
        }
    });
    
    document.addEventListener('mouseover', () => {
        cursorDot.classList.remove('cursor-hidden');
        cursorOutline.classList.remove('cursor-hidden');
        cursorText.classList.remove('cursor-hidden');
    });
}

// Ініціалізація основних анімацій
function initAnimations() {
    // Реєструємо плагіни GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Налаштування налаштування для базових анімацій
    gsap.config({
        nullTargetWarn: false,
    });
    
    // Анімуємо логотип в шапці
    const logoAnimation = gsap.timeline({ repeat: -1, repeatDelay: 10 });
    logoAnimation.to('.logo-accent', {
        scale: 1.5,
        opacity: 0.2,
        duration: 1.5,
        ease: 'power2.inOut'
    }).to('.logo-accent', {
        scale: 1,
        opacity: 0.1,
        duration: 1.5,
        ease: 'power2.inOut'
    });
}

// Ініціалізація лінивого завантаження зображень
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    // Функція для перевірки, чи елемент у видимій області
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= -300 &&
            rect.left >= -300 &&
            rect.bottom <= (window.innerHeight + 300) &&
            rect.right <= (window.innerWidth + 300)
        );
    }
    
    // Функція для завантаження зображення
    function loadImage(img) {
        if (!img.classList.contains('loaded')) {
            img.classList.add('loaded');
        }
    }
    
    // Перевіряємо всі зображення, завантажуємо видимі
    function checkImages() {
        lazyImages.forEach(img => {
            if (isElementInViewport(img) || document.querySelector('.section.active').contains(img)) {
                loadImage(img);
            }
        });
    }
    
    // Початкова перевірка зображень
    checkImages();
    
    // Перевіряємо зображення при зміні секції
    document.addEventListener('sectionChange', checkImages);
}

// Ініціалізація розділення тексту
function initSplitText() {
    // Розділяємо тексти для анімації посимвольно
    document.querySelectorAll('.split-text').forEach(element => {
        new SplitType(element, { types: 'chars, words' });
        
        // Затримка для символів
        const chars = element.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.style.transitionDelay = `${0.03 * index}s`;
        });
    });
}

// Ініціалізація взаємодій
function initInteractions() {
    // Обробник для анімованих карт
    document.querySelectorAll('.card-draw').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
    
    // Анімація карт при наведенні
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            if (!card.classList.contains('flipped')) {
                // 3D ефект при наведенні
                card.style.transition = 'transform 0.3s ease';
                updateCardTransform(e, card);
            }
        });
        
        card.addEventListener('mousemove', (e) => {
            if (!card.classList.contains('flipped')) {
                updateCardTransform(e, card);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'rotateX(0) rotateY(0)';
        });
    });
    
    // Функція для розрахунку 3D-трансформації карти
    function updateCardTransform(e, card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Розрахунок кута нахилу (максимум 15 градусів)
        const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10;
        const rotateX = ((centerY - mouseY) / (rect.height / 2)) * 10;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
}

// Ініціалізація кнопки "На гору"
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(0);
        });
    }
}

// Ініціалізація форми контактів
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Анімація полів форми при фокусі
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // Початкове встановлення стану, якщо поле заповнене
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
            
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
        
        // Обробка відправки форми
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Перевірка форми перед відправкою
            let isValid = true;
            formInputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    gsap.to(input, {
                        x: [-5, 5, -5, 5, 0],
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });
                    
                    input.addEventListener('input', function() {
                        this.classList.remove('error');
                    }, { once: true });
                }
            });
            
            if (!isValid) return;
            
            // Імітація відправки форми
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;
            
            // Анімація кнопки при відправці
            submitButton.innerHTML = '<span class="loading-spinner"></span> Відправляємо...';
            submitButton.disabled = true;
            
            // Імітація отримання відповіді від сервера через 2 секунди
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Відправлено!';
                submitButton.classList.add('success');
                
                // Скидаємо форму
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                
                // Повертаємо оригінальний текст кнопки через 3 секунди
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonHTML;
                    submitButton.disabled = false;
                    submitButton.classList.remove('success');
                }, 3000);
            }, 2000);
        });
    }
}

// Ініціалізація частинок (для секції hero)
function initParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroParticles) {
        // Створюємо частинки
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Випадкове розташування
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Випадковий розмір
            const size = Math.random() * 5 + 2;
            
            // Випадкова форма (коло або квадрат)
            const shape = Math.random() > 0.5 ? '50%' : '0';
            
            // Випадковий колір (блакитний або теракотовий з різною прозорістю)
            const color = Math.random() > 0.5 ? 
                `rgba(79, 139, 204, ${Math.random() * 0.2 + 0.05})` : 
                `rgba(198, 90, 36, ${Math.random() * 0.2 + 0.05})`;
            
            // Встановлюємо стилі
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.borderRadius = shape;
            particle.style.backgroundColor = color;
            particle.style.position = 'absolute';
            particle.style.opacity = '0';
            
            // Додаємо до контейнера
            heroParticles.appendChild(particle);
        }
    }
}

// Анімація секції hero
function animateHeroSection() {
    // Анімуємо частинки
    const particles = document.querySelectorAll('.hero-particles .particle');
    particles.forEach((particle, index) => {
        // Анімація появи
        gsap.to(particle, {
            opacity: 1,
            duration: 1,
            delay: Math.random() * 2,
            ease: 'power2.inOut'
        });
        
        // Повільне плавання
        gsap.to(particle, {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            duration: 15 + Math.random() * 20,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
}

// Анімація секції з розкладанням карт
function animateCardsSpread() {
    const cards = document.querySelectorAll('.cards-spread .spread-card .card-inner');
    
    // Анімація перевертання карт з затримкою
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'rotateY(180deg)';
            
            setTimeout(() => {
                card.style.transform = 'rotateY(0deg)';
            }, 1500);
        }, index * 300 + 1000);
    });
}

// Анімація 3D карусель
function animateCardsCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    
    // Почергове виділення карт
    let currentHighlight = 0;
    
    function highlightNextCard() {
        cards.forEach((card, index) => {
            if (index === currentHighlight) {
                gsap.to(card, {
                    scale: 1.1,
                    duration: 0.5,
                    ease: 'power2.inOut'
                });
            } else {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.inOut'
                });
            }
        });
        
        currentHighlight = (currentHighlight + 1) % cards.length;
    }
    
    // Запускаємо анімацію підсвічування
    const highlightInterval = setInterval(highlightNextCard, 2000);
    
    // Очищаємо інтервал, коли секція стає неактивною
    const carouselSection = document.querySelector('.cards-carousel');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (!carouselSection.classList.contains('active')) {
                    clearInterval(highlightInterval);
                }
            }
        });
    });
    
    observer.observe(carouselSection, { attributes: true });
}

// Ініціалізація 3D карусель
function init3DCarousel() {
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const cards = document.querySelectorAll('.carousel-card');
    
    // Початковий індекс активної карти
    let activeCardIndex = 0;
    
    // Обробники натискання кнопок
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            rotateCarousel('prev');
        });
        
        nextButton.addEventListener('click', () => {
            rotateCarousel('next');
        });
    }
    
    // Функція обертання карусель
    function rotateCarousel(direction) {
        carouselRotation += direction === 'next' ? 45 : -45;
        
        cards.forEach((card, index) => {
            const angle = carouselRotation + (index * 45);
            const z = -200 + ((index - activeCardIndex + cards.length) % cards.length) * 100;
            
            gsap.to(card, {
                transform: `translate(-50%, -50%) translateZ(${z}px) rotateY(${angle}deg)`,
                duration: 1,
                ease: 'power2.inOut'
            });
        });
        
        // Оновлюємо активний індекс
        activeCardIndex = direction === 'next' ? 
            (activeCardIndex + 1) % cards.length : 
            (activeCardIndex - 1 + cards.length) % cards.length;
    }
}

// Анімація карт, що випадають
function animateFallingCards() {
    const cards = document.querySelectorAll('.falling-card');
    
    // Затримка для додаткової анімації
    setTimeout(() => {
        cards.forEach((card, index) => {
            // Затримка анімації для карт за індексом
            const delay = index * 0.2;
            
            // Анімація повороту та падіння
            gsap.to(card, {
                rotation: gsap.utils.random(-15, 15),
                y: gsap.utils.random(-30, 30),
                duration: 2,
                delay: delay,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true,
                repeatDelay: 0.5
            });
        });
    }, 1000);
}

// Анімація 3D сітки карт
function animate3DGrid() {
    const gridContainer = document.querySelector('.cards-grid-container');
    const cards = document.querySelectorAll('.grid-card');
    
    // Анімація появи сітки карт
    setTimeout(() => {
        cards.forEach((card, index) => {
            const x = parseInt(card.style.getPropertyValue('--x'));
            const y = parseInt(card.style.getPropertyValue('--y'));
            
            gsap.to(card, {
                translateZ: 20 + (x + y) * 10,
                duration: 1,
                delay: (x + y) * 0.1,
                ease: 'power2.inOut'
            });
            
            // Повернення до початкового стану
            setTimeout(() => {
                gsap.to(card, {
                    translateZ: (x + y) * 10,
                    duration: 1,
                    ease: 'power2.inOut'
                });
            }, 1500 + (x + y) * 100);
        });
    }, 1000);
}

// Ініціалізація взаємодії з 3D сіткою
function init3DGridInteraction() {
    const gridContainer = document.querySelector('.cards-grid-container');
    
    if (gridContainer) {
        gridContainer.addEventListener('mousemove', (e) => {
            const rect = gridContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Нормалізуємо координати миші від -1 до 1
            const normalizedX = (mouseX / rect.width) * 2 - 1;
            const normalizedY = (mouseY / rect.height) * 2 - 1;
            
            // Застосовуємо поворот до контейнера (обмежуємо до 20 градусів)
            const rotateY = normalizedX * 20;
            const rotateX = -normalizedY * 20;
            
            gsap.to(gridContainer, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        gridContainer.addEventListener('mouseleave', () => {
            gsap.to(gridContainer, {
                rotateX: 20,
                rotateY: -20,
                duration: 1,
                ease: 'power2.inOut'
            });
        });
    }
}

// Анімація колоди карт
function animateCardsDeck() {
    const deckTop = document.querySelector('.deck-top');
    const deckCards = document.querySelectorAll('.deck-card');
    const drawButton = document.querySelector('.draw-button');
    
    if (drawButton && deckTop) {
        drawButton.addEventListener('click', () => {
            // Анімація витягування верхньої карти
            gsap.to(deckTop, {
                x: 150,
                y: -50,
                rotation: 10,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Анімуємо перевертання карти
                    deckTop.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
                    
                    setTimeout(() => {
                        // Повертаємо карту на місце
                        gsap.to(deckTop, {
                            x: 0,
                            y: 0,
                            rotation: 0,
                            duration: 0.8,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                setTimeout(() => {
                                    deckTop.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
                                }, 500);
                            }
                        });
                    }, 1500);
                }
            });
        });
    }
}

// Ініціалізація колоди карт
function initCardDeck() {
    const deckTop = document.querySelector('.deck-top');
    const drawButton = document.querySelector('.draw-button');
    
    // Додаємо обробник для кнопки витягування карти та верхньої карти
    if (deckTop) {
        deckTop.addEventListener('click', () => {
            drawCard();
        });
    }
    
    if (drawButton) {
        drawButton.addEventListener('click', () => {
            drawCard();
        });
    }
    
    // Функція анімації витягування карти
    function drawCard() {
        if (deckTop.classList.contains('drawing')) return;
        
        deckTop.classList.add('drawing');
        
        // Анімація витягування
        gsap.to(deckTop, {
            x: 150,
            y: -50,
            rotation: 10,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                // Перевертаємо карту
                deckTop.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
                
                setTimeout(() => {
                    // Повертаємо карту в колоду
                    gsap.to(deckTop, {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        duration: 0.8,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            setTimeout(() => {
                                deckTop.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
                                deckTop.classList.remove('drawing');
                            }, 500);
                        }
                    });
                }, 1500);
            }
        });
    }
}

// Встановлення поточного року в футері
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}