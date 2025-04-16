/**
 * Головний JavaScript файл для сайту Roots & Wings
 * Метафоричні асоціативні карти
 */

// Очікуємо завантаження DOM перед ініціалізацією скриптів
document.addEventListener('DOMContentLoaded', function() {
  // Ініціалізуємо прелоадер для початкового завантаження сайту
  initPreloader();
  
  // Ініціалізуємо кастомний курсор
  initCursor();
  
  // Ініціалізуємо мобільне меню
  initMobileMenu();
  
  // Ініціалізуємо ефект прокрутки для хедера
  initHeaderScroll();
  
  // Ініціалізуємо плавну прокрутку для якорів
  initSmoothScroll();
  
  // Ініціалізуємо анімації
  initAnimations();
  
  // Ініціалізуємо інтерактивні компоненти
  initCardSpread();
  initCardsCarousel();
  initCardDeck();
  initCardGrid();
  
  // Ініціалізуємо паралакс-ефекти
  initParallax();
  
  // Ініціалізуємо контактну форму
  initContactForm();
  
  // Ініціалізуємо кнопку "повернутися нагору"
  initBackToTop();
});

/**
* Функціональність прелоадера
* Відображає прогрес завантаження сайту та приховує прелоадер після завершення
*/
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const progressBar = document.querySelector('.preloader-progress');
  const counter = document.querySelector('.preloader-counter');
  
  if (!preloader || !progressBar || !counter) return;

  let progress = 0;
  const totalAssets = document.querySelectorAll('img').length + 5; // Зображення + CSS + JS + Шрифти
  let loadedAssets = 0;
  
  // Функція для оновлення прогресу
  function updateProgress() {
      loadedAssets++;
      progress = Math.min(Math.ceil((loadedAssets / totalAssets) * 100), 100);
      progressBar.style.width = progress + '%';
      counter.textContent = progress + '%';
      
      if (progress >= 100) {
          setTimeout(hidePreloader, 500);
      }
  }
  
  // Функція для приховування прелоадера після завершення завантаження
  function hidePreloader() {
      preloader.classList.add('hidden');
      document.body.classList.add('loaded');
      
      // Запускаємо початкові анімації
      startInitialAnimations();
  }
  
  // Відстежуємо завантаження зображень
  const images = document.querySelectorAll('img');
  let imagesLoaded = 0;
  
  function imageLoaded() {
      imagesLoaded++;
      updateProgress();
  }
  
  // Якщо зображень немає, все одно оновлюємо прогрес
  if (images.length === 0) {
      for (let i = 0; i < 5; i++) {
          setTimeout(updateProgress, i * 200);
      }
  } else {
      // Відстежуємо завантаження кожного зображення
      images.forEach(img => {
          if (img.complete) {
              imageLoaded();
          } else {
              img.addEventListener('load', imageLoaded);
              img.addEventListener('error', imageLoaded); // Враховуємо помилки як завантажені, щоб уникнути зависання
          }
      });
      
      // Додаємо додаткові лічильники для інших ресурсів (CSS, JS, шрифти)
      for (let i = 0; i < 5; i++) {
          setTimeout(updateProgress, i * 200);
      }
  }
  
  // Переконуємося, що прелоадер зникне, навіть якщо деякі ресурси не завантажаться
  setTimeout(() => {
      if (preloader && !preloader.classList.contains('hidden')) {
          hidePreloader();
      }
  }, 5000);
}

/**
* Початкові анімації, які запускаються після зникнення прелоадера
*/
function startInitialAnimations() {
  // Анімація елементів головної секції
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroDescription = document.querySelector('.hero-description');
  const heroButtons = document.querySelector('.hero-buttons');
  const heroImage = document.querySelector('.hero-image');
  
  if (heroTitle) heroTitle.classList.add('revealed');
  if (heroSubtitle) {
      setTimeout(() => {
          heroSubtitle.classList.add('revealed');
      }, 200);
  }
  if (heroDescription) {
      setTimeout(() => {
          heroDescription.classList.add('revealed');
      }, 400);
  }
  if (heroButtons) {
      setTimeout(() => {
          heroButtons.classList.add('revealed');
      }, 600);
  }
  if (heroImage) {
      setTimeout(() => {
          heroImage.classList.add('revealed');
      }, 800);
  }
  
  // Створюємо спостерігач для відображення елементів, які спочатку видимі
  initScrollObserver();
}

/**
* Ініціалізація спостерігача прокрутки для анімацій
*/
function initScrollObserver() {
  // Створюємо спостерігач
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              entry.target.classList.add('loaded');
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });
  
  // Спостерігаємо за елементами
  document.querySelectorAll('.lazy-load, .visual-title, .split-text:not(.hero-title):not(.hero-subtitle), .content-item').forEach(el => {
      observer.observe(el);
  });
}

/**
* Функціональність кастомного курсора
*/
function initCursor() {
  const cursor = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const cursorText = document.querySelector('.cursor-text');
  
  if (!cursor || !cursorOutline) return;
  
  // Перевіряємо, чи має пристрій сенсорні можливості
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  if (!isTouchDevice) {
      document.body.classList.add('cursor-enabled');
      
      // Оновлюємо положення курсора при русі миші
      document.addEventListener('mousemove', e => {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
          
          cursorOutline.style.left = e.clientX + 'px';
          cursorOutline.style.top = e.clientY + 'px';
          
          if (cursorText) {
              cursorText.style.left = e.clientX + 'px';
              cursorText.style.top = e.clientY + 'px';
          }
      });
      
      // Додаємо ефект при наведенні на інтерактивні елементи
      const interactiveElements = document.querySelectorAll('a, button, .card, .interactive, input, textarea, .cursor-hover-trigger, .spread-card, .carousel-card, .grid-card, .deck-card, .draw-button, .carousel-prev, .carousel-next');
      
      interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', () => {
              cursor.classList.add('cursor-hover');
              cursorOutline.classList.add('cursor-hover');
              
              // Показуємо текст для елементів з data-cursor-text
              if (cursorText && el.dataset.cursorText) {
                  cursorText.textContent = el.dataset.cursorText;
                  document.body.classList.add('cursor-text-visible');
              }
          });
          
          el.addEventListener('mouseleave', () => {
              cursor.classList.remove('cursor-hover');
              cursorOutline.classList.remove('cursor-hover');
              
              // Приховуємо текст
              if (cursorText) {
                  document.body.classList.remove('cursor-text-visible');
              }
          });
      });
      
      // Додаємо ефект при натисканні
      document.addEventListener('mousedown', () => {
          cursor.classList.add('cursor-click');
          cursorOutline.classList.add('cursor-click');
      });
      
      document.addEventListener('mouseup', () => {
          cursor.classList.remove('cursor-click');
          cursorOutline.classList.remove('cursor-click');
      });
  }
}

/**
* Функціональність мобільного меню
*/
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Перемикання меню
  menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
  });
  
  // Закриття меню
  if (menuClose) {
      menuClose.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.classList.remove('menu-open');
      });
  }
  
  // Закриття меню при натисканні на посилання
  mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.classList.remove('menu-open');
      });
  });
}

/**
* Ефект прокрутки для хедера
*/
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  // Перевіряємо положення прокрутки та додаємо/видаляємо класи
  function checkScroll() {
      if (window.scrollY > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  }
  
  // Початкова перевірка
  checkScroll();
  
  // Перевірка при прокрутці
  window.addEventListener('scroll', checkScroll);
}

/**
* Плавна прокрутка для якірних посилань
*/
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (!targetElement) return;
          
          // Отримуємо зміщення з урахуванням висоти хедера
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          // Прокручуємо до цілі
          window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
          });
      });
  });
  
  // Додаємо обробник для індикатора прокрутки
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
      scrollIndicator.addEventListener('click', function() {
          const nextSection = document.querySelector('.section:nth-child(2)');
          if (nextSection) {
              const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
              const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
              
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  }
}

/**
* Ініціалізація кнопки "повернутися нагору"
*/
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;
  
  // Перевіряємо положення прокрутки та перемикаємо видимість кнопки
  function checkScrollPosition() {
      if (window.scrollY > 500) {
          backToTopBtn.classList.add('visible');
      } else {
          backToTopBtn.classList.remove('visible');
      }
  }
  
  // Прокрутка до початку сторінки при натисканні на кнопку
  backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
  
  // Перевірка положення прокрутки при прокрутці
  window.addEventListener('scroll', checkScrollPosition);
  
  // Початкова перевірка
  checkScrollPosition();
}

/**
* Ініціалізація всіх анімацій
*/
function initAnimations() {
  // Розділення тексту для анімацій
  initTextSplitting();
  
  // Додаємо анімацію плаваючим картам в hero-секції
  animateFloatingCards();
  
  // Додаємо анімацію карткам, що падають
  initFallingCards();
}

/**
* Розділення тексту для анімацій
*/
function initTextSplitting() {
  const splitTextElements = document.querySelectorAll('.split-text');
  
  splitTextElements.forEach(element => {
      if (element.dataset.splitted) return; // Уникаємо повторного розділення
      
      let text = element.textContent;
      let splitHtml = '';
      
      // Розділяємо за словами
      const words = text.split(' ');
      
      words.forEach((word, wordIndex) => {
          splitHtml += `<span class="word">`;
          
          // Розділяємо за символами
          Array.from(word).forEach((char, charIndex) => {
              splitHtml += `<span class="char" style="transition-delay: ${(wordIndex * 0.05) + (charIndex * 0.03)}s">${char}</span>`;
          });
          
          splitHtml += `</span> `;
      });
      
      element.innerHTML = splitHtml;
      element.dataset.splitted = 'true';
  });
}

/**
* Анімація плаваючих карт в hero-секції
*/
function animateFloatingCards() {
  const floatingCards = document.querySelectorAll('.floating-card');
  
  floatingCards.forEach((card, index) => {
      // Генеруємо випадкові значення для анімації
      const duration = 3 + Math.random() * 2; // 3-5 секунд
      const delay = index * 0.5; // Затримка для різних карт
      const translateY = -10 - Math.random() * 10; // Зміщення по Y
      const rotate = -5 + Math.random() * 10; // Обертання
      
      // Встановлюємо стилі анімації
      card.style.animation = `floatingAnimation ${duration}s ease-in-out ${delay}s infinite alternate`;
      
      // Додаємо keyframes для анімації
      const styleSheet = document.styleSheets[0];
      const keyframes = `
          @keyframes floatingAnimation {
              0% {
                  transform: translateY(0) rotate(${card.style.transform.replace('rotate(', '').replace('deg)', '')});
              }
              100% {
                  transform: translateY(${translateY}px) rotate(${rotate + parseFloat(card.style.transform.replace('rotate(', '').replace('deg)', ''))}deg);
              }
          }
      `;
      
      try {
          styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      } catch (error) {
          // Якщо не вдалося додати через insertRule, створюємо стиль
          const styleElement = document.createElement('style');
          styleElement.textContent = keyframes;
          document.head.appendChild(styleElement);
      }
  });
}

/**
* Ініціалізація карток, що падають
*/
function initFallingCards() {
  const fallingCards = document.querySelectorAll('.falling-card');
  
  fallingCards.forEach((card, index) => {
      // Встановлюємо випадкове обертання для кожної картки
      const randomRotate = -20 + Math.random() * 40; // Від -20 до 20 градусів
      card.style.setProperty('--random-rotate', `${randomRotate}deg`);
  });
}

/**
* Ініціалізація інтерактивних карток з розкладанням
*/
function initCardSpread() {
  const spreadCards = document.querySelectorAll('.spread-card');
  
  spreadCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
          const rotateAngle = card.dataset.rotateAngle || 0;
          const moveX = card.dataset.moveX || 0;
          const moveY = card.dataset.moveY || 0;
          const rotateAdd = card.dataset.rotateAdd || 0;
          
          // Додаємо "підйом" картки і додаткове обертання при наведенні
          this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) translateZ(30px) rotate(${parseFloat(rotateAngle) + parseFloat(rotateAdd)}deg)`;
          this.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', function() {
          const rotateAngle = card.dataset.rotateAngle || 0;
          const moveX = card.dataset.moveX || 0;
          const moveY = card.dataset.moveY || 0;
          
          // Повертаємо картку у початкове положення
          this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) rotate(${rotateAngle}deg)`;
          this.style.zIndex = '';
      });
  });
}

/**
* Ініціалізація каруселі карток
*/
function initCardsCarousel() {
  const carousel = document.querySelector('.carousel-3d');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const cards = document.querySelectorAll('.carousel-card');
  
  if (!carousel || !cards.length) return;
  
  let currentIndex = 0;
  const totalCards = cards.length;
  
  // Функція для оновлення позицій карток
  function updateCarousel() {
      cards.forEach((card, index) => {
          let newIndex = (index - currentIndex + totalCards) % totalCards;
          card.style.setProperty('--card-index', newIndex);
      });
  }
  
  // Слухаємо кліки по кнопках
  if (prevBtn) {
      prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + totalCards) % totalCards;
          updateCarousel();
      });
  }
  
  if (nextBtn) {
      nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % totalCards;
          updateCarousel();
      });
  }
  
  // Додаємо можливість перетягування для мобільних пристроїв
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
      const swipeThreshold = 50; // Мінімальна відстань, щоб зарахувати свайп
      
      if (touchEndX < touchStartX - swipeThreshold) {
          // Свайп вліво
          currentIndex = (currentIndex + 1) % totalCards;
          updateCarousel();
      } else if (touchEndX > touchStartX + swipeThreshold) {
          // Свайп вправо
          currentIndex = (currentIndex - 1 + totalCards) % totalCards;
          updateCarousel();
      }
  }
}

/**
* Ініціалізація колоди карт для витягування
*/
function initCardDeck() {
  const deck = document.querySelector('.deck');
  const drawButton = document.querySelector('.draw-button');
  const topCard = document.querySelector('.deck-top');
  
  if (!deck || !drawButton || !topCard) return;
  
  drawButton.addEventListener('click', function() {
      // Перевертаємо верхню картку
      topCard.classList.add('flipped');
      
      // Через 1.5 секунди повертаємо картку назад
      setTimeout(() => {
          topCard.classList.remove('flipped');
          
          // Перемішуємо карти в колоді після повернення
          const deckCards = document.querySelectorAll('.deck-card:not(.deck-top)');
          deckCards.forEach(card => {
              const randomRotate = -2 + Math.random() * 4; // Випадкове обертання
              const randomY = Math.random() * -3; // Випадкове зміщення по Y
              
              card.style.transform = `translateY(${randomY}px) rotate(${randomRotate}deg)`;
          });
      }, 1500);
  });
}

/**
* Ініціалізація 3D сітки карт
*/
function initCardGrid() {
  const gridContainer = document.querySelector('.cards-grid-container');
  const gridCards = document.querySelectorAll('.grid-card');
  
  if (!gridContainer || !gridCards.length) return;
  
  // Додаємо ефект трансформації при русі миші
  gridContainer.addEventListener('mousemove', function(e) {
      const rect = gridContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Розрахунок кута нахилу
      const angleX = (mouseY / rect.height) * 10; // Максимальний кут 10 градусів
      const angleY = (mouseX / rect.width) * -10;
      
      // Застосовуємо трансформацію до контейнера
      gridContainer.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      
      // Застосовуємо трансформацію до карток
      gridCards.forEach(card => {
          // Розрахунок позиції картки відносно центру
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
          const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;
          
          // Розрахунок відстані від центру
          const distanceX = ((cardCenterX / rect.width) - 0.5) * 2;
          const distanceY = ((cardCenterY / rect.height) - 0.5) * 2;
          
          // Розрахунок Z-трансформації
          const zTransform = Math.abs(distanceX) + Math.abs(distanceY);
          
          // Застосовуємо трансформацію
          card.style.transform = `scale(0.95) translateZ(${30 + zTransform * 30}px)`;
      });
  });
  
  // Повертаємо до початкового стану, коли миша покидає контейнер
  gridContainer.addEventListener('mouseleave', function() {
      gridContainer.style.transform = 'rotateX(0) rotateY(0)';
      
      gridCards.forEach(card => {
          card.style.transform = 'scale(0.95) translateZ(0)';
      });
  });
}

/**
* Ініціалізація паралакс-ефектів
*/
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
  
  if (!parallaxElements.length) return;
  
  function updateParallax() {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
          const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
          const offset = scrollTop * speed;
          
          element.style.transform = `translateY(${offset}px)`;
      });
  }
  
  window.addEventListener('scroll', updateParallax);
  
  // Початкове оновлення
  updateParallax();
}

/**
* Ініціалізація контактної форми
*/
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) return;
  
  // Додаємо анімацію для фокусу на полях форми
  const formInputs = contactForm.querySelectorAll('input, textarea');
  
  formInputs.forEach(input => {
      input.addEventListener('focus', function() {
          this.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
          if (!this.value) {
              this.parentElement.classList.remove('focused');
          }
      });
      
      // Перевіряємо, чи є значення при завантаженні
      if (input.value) {
          input.parentElement.classList.add('focused');
      }
  });
  
  // Обробка відправки форми
  contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Перевіряємо валідність форми
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      
      let isValid = true;
      
      // Перевірка імені
      if (!name.value.trim()) {
          name.parentElement.classList.add('error');
          isValid = false;
      } else {
          name.parentElement.classList.remove('error');
      }
      
      // Перевірка email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value)) {
          email.parentElement.classList.add('error');
          isValid = false;
      } else {
          email.parentElement.classList.remove('error');
      }
      
      // Перевірка повідомлення
      if (!message.value.trim()) {
          message.parentElement.classList.add('error');
          isValid = false;
      } else {
          message.parentElement.classList.remove('error');
      }
      
      // Якщо форма валідна, симулюємо відправку
      if (isValid) {
          const submitButton = contactForm.querySelector('button[type="submit"]');
          const originalText = submitButton.textContent;
          
          // Змінюємо текст кнопки
          submitButton.textContent = 'Відправка...';
          submitButton.disabled = true;
          
          // Симулюємо відправку
          setTimeout(() => {
              submitButton.textContent = 'Відправлено!';
              
              // Показуємо повідомлення про успіх
              const successMessage = document.createElement('div');
              successMessage.className = 'success-message';
              successMessage.textContent = 'Ваше повідомлення успішно відправлено. Ми зв\'яжемося з вами найближчим часом.';
              
              contactForm.appendChild(successMessage);
              
              // Очищаємо форму
              contactForm.reset();
              formInputs.forEach(input => {
                  input.parentElement.classList.remove('focused');
              });
              
              // Повертаємо оригінальний текст кнопки
              setTimeout(() => {
                  submitButton.textContent = originalText;
                  submitButton.disabled = false;
                  
                  // Видаляємо повідомлення про успіх
                  successMessage.remove();
              }, 3000);
          }, 1500);
      }
  });
}

// Ініціалізуємо слухачі подій для вікна
window.addEventListener('load', function() {
  // Перевіряємо, чи вже було завантажено сторінку
  if (document.body.classList.contains('loaded')) {
      // Якщо так, запускаємо початкові анімації
      startInitialAnimations();
  }
});

window.addEventListener('resize', function() {
  // Перевіряємо, чи змінився розмір вікна для адаптації інтерфейсу
  // Наприклад, можна оновити позиції елементів у каруселі
  if (typeof updateCarousel === 'function') {
      updateCarousel();
  }
});