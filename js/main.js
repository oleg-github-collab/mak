/**
 * МАК "Коріння та крила" - основний JavaScript файл
 * Відповідає за всі інтерактивні функції сайту
 */

document.addEventListener('DOMContentLoaded', function() {
  // Ініціалізація всіх компонентів
  initHeader();
  initMobileMenu();
  initCustomCursor();
  initScrollReveal();
  initBackToTop();
  initContactForm();
  initVideoPlayback();
  initParallaxEffect();
  initCurrentYear();
});

/**
* Ініціалізація поведінки шапки сайту
*/
function initHeader() {
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // Додаємо клас scrolled при прокручуванні
      if (currentScroll > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
      
      // Приховуємо шапку при прокручуванні вниз
      if (currentScroll > lastScrollTop && currentScroll > 300) {
          header.style.transform = 'translateY(-100%)';
      } else {
          header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}

/**
* Ініціалізація мобільного меню
*/
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (mobileMenuToggle && mobileMenu) {
      // Відкриття меню
      mobileMenuToggle.addEventListener('click', function() {
          mobileMenu.classList.add('active');
          document.body.style.overflow = 'hidden';
      });
      
      // Закриття меню
      mobileMenuClose.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
      });
      
      // Закриття меню при кліку на посилання
      mobileNavLinks.forEach(link => {
          link.addEventListener('click', function() {
              mobileMenu.classList.remove('active');
              document.body.style.overflow = '';
          });
      });
  }
}

/**
* Ініціалізація кастомного курсору
*/
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (cursor && cursorFollower && window.innerWidth > 1024) {
      document.addEventListener('mousemove', function(e) {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
          
          // Додаємо затримку для follower для створення ефекту інерції
          setTimeout(function() {
              cursorFollower.style.left = e.clientX + 'px';
              cursorFollower.style.top = e.clientY + 'px';
          }, 100);
      });
      
      // Збільшуємо курсор при наведенні на посилання та кнопки
      const links = document.querySelectorAll('a, button, .btn');
      links.forEach(link => {
          link.addEventListener('mouseenter', function() {
              cursor.classList.add('active');
              cursorFollower.classList.add('active');
          });
          
          link.addEventListener('mouseleave', function() {
              cursor.classList.remove('active');
              cursorFollower.classList.remove('active');
          });
      });
  } else {
      // Приховуємо курсор на мобільних пристроях
      if (cursor && cursorFollower) {
          cursor.style.display = 'none';
          cursorFollower.style.display = 'none';
      }
  }
}

/**
* Ініціалізація анімацій появи елементів при прокручуванні
*/
function initScrollReveal() {
  const animatedElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  
  function revealElements() {
      const windowHeight = window.innerHeight;
      
      animatedElements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementPosition < windowHeight - elementVisible) {
              // Додаємо затримку, якщо вказано
              const delay = element.getAttribute('data-delay') || 0;
              setTimeout(() => {
                  element.classList.add('active');
              }, delay);
          }
      });
  }
  
  // Виклик при завантаженні сторінки
  revealElements();
  
  // Виклик при прокручуванні
  window.addEventListener('scroll', revealElements);
}

/**
* Ініціалізація кнопки "На гору"
*/
function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
      window.addEventListener('scroll', function() {
          if (window.pageYOffset > 300) {
              backToTopButton.classList.add('visible');
          } else {
              backToTopButton.classList.remove('visible');
          }
      });
      
      backToTopButton.addEventListener('click', function(e) {
          e.preventDefault();
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }
}

/**
* Ініціалізація форми контактів
*/
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
      // Анімація полів при фокусі
      const formInputs = contactForm.querySelectorAll('input, textarea');
      formInputs.forEach(input => {
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
          
          // Імітація відправки форми
          const submitButton = this.querySelector('button[type="submit"]');
          const originalText = submitButton.innerHTML;
          
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправляємо...';
          submitButton.disabled = true;
          
          // Імітація отримання відповіді від сервера через 2 секунди
          setTimeout(() => {
              submitButton.innerHTML = '<i class="fas fa-check"></i> Відправлено!';
              submitButton.classList.add('success');
              
              // Скидаємо форму
              this.reset();
              
              // Повертаємо оригінальний текст кнопки через 3 секунди
              setTimeout(() => {
                  submitButton.innerHTML = originalText;
                  submitButton.disabled = false;
                  submitButton.classList.remove('success');
              }, 3000);
          }, 2000);
      });
  }
}

/**
* Ініціалізація відтворення відео (якщо є)
*/
function initVideoPlayback() {
  const videoContainers = document.querySelectorAll('.video-container');
  
  videoContainers.forEach(container => {
      const playButton = container.querySelector('.video-play-button');
      const poster = container.querySelector('.video-poster');
      const video = container.querySelector('video');
      
      if (playButton && video) {
          playButton.addEventListener('click', function() {
              if (poster) poster.style.display = 'none';
              playButton.style.display = 'none';
              video.style.display = 'block';
              video.play();
          });
      }
  });
}

/**
* Ініціалізація паралакс ефекту
*/
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  function updateParallax() {
      parallaxElements.forEach(element => {
          const scrollPosition = window.pageYOffset;
          const elementOffset = element.offsetTop;
          const distance = scrollPosition - elementOffset;
          const speed = 0.5;
          
          element.style.transform = `translateY(${distance * speed}px)`;
      });
  }
  
  if (parallaxElements.length > 0 && window.innerWidth > 768) {
      window.addEventListener('scroll', updateParallax);
  }
}

/**
* Плавна прокрутка для навігаційних посилань
*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
          });
      }
  });
});

/**
* Встановлення поточного року в футері
*/
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
  }
}

/**
* Додаткові функції для інтерактивних елементів
*/

// Ініціалізація картинок, що з'являються при наведенні
function initHoverImages() {
  const hoverTriggers = document.querySelectorAll('.hover-trigger');
  
  hoverTriggers.forEach(trigger => {
      const hoverImage = trigger.querySelector('.hover-image');
      
      trigger.addEventListener('mouseenter', function() {
          hoverImage.classList.add('visible');
      });
      
      trigger.addEventListener('mouseleave', function() {
          hoverImage.classList.remove('visible');
      });
  });
}

// Ініціалізація лічильників анімації
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  function startCounting() {
      counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const speed = 200; // час анімації в мс
          const increment = target / speed;
          let count = 0;
          
          const updateCount = () => {
              count += increment;
              
              if (count < target) {
                  counter.innerText = Math.ceil(count);
                  setTimeout(updateCount, 1);
              } else {
                  counter.innerText = target;
              }
          };
          
          updateCount();
      });
  }
  
  // Запускаємо лічильники, коли вони з'являються у видимій частині екрана
  const counterSection = document.querySelector('.counters-section');
  
  if (counterSection) {
      const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
              startCounting();
              observer.unobserve(counterSection);
          }
      });
      
      observer.observe(counterSection);
  }
}

// Викликаємо додаткові функції
window.addEventListener('load', function() {
  initHoverImages();
  initCounters();
});