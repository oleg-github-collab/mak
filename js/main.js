// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize site after preloader
  initPreloader();

  // Initialize custom cursor
  initCursor();

  // Initialize smooth scrolling
  initSmoothScroll();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize header scroll effect
  initHeaderScroll();

  // Initialize all animations
  initAnimations();

  // Initialize card interactions
  initCardInteractions();

  // Initialize contact form
  initContactForm();

  // Initialize back to top button
  initBackToTop();
});

// Preloader functionality
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const progressBar = document.querySelector('.preloader-progress');
  const counter = document.querySelector('.preloader-counter');
  
  if (!preloader || !progressBar || !counter) return;

  let progress = 0;
  const totalAssets = document.querySelectorAll('img').length + 5; // Images + CSS + JS + Fonts
  let loadedAssets = 0;
  
  // Function to update progress
  function updateProgress() {
      loadedAssets++;
      progress = Math.min(Math.ceil((loadedAssets / totalAssets) * 100), 100);
      progressBar.style.width = progress + '%';
      counter.textContent = progress + '%';
      
      if (progress >= 100) {
          setTimeout(hidePreloader, 500);
      }
  }
  
  // Hide preloader when loading is complete
  function hidePreloader() {
      preloader.classList.add('hidden');
      document.body.classList.add('loaded');
      
      // Start initial animations
      startInitialAnimations();
  }
  
  // Track image loading
  const images = document.querySelectorAll('img');
  let imagesLoaded = 0;
  
  function imageLoaded() {
      imagesLoaded++;
      updateProgress();
  }
  
  // If there are no images, still update progress
  if (images.length === 0) {
      for (let i = 0; i < 5; i++) {
          setTimeout(updateProgress, i * 200);
      }
  } else {
      // Track each image loading
      images.forEach(img => {
          if (img.complete) {
              imageLoaded();
          } else {
              img.addEventListener('load', imageLoaded);
              img.addEventListener('error', imageLoaded); // Count errors as loaded to avoid stalling
          }
      });
      
      // Add extra counts for other assets (CSS, JS, fonts)
      for (let i = 0; i < 5; i++) {
          setTimeout(updateProgress, i * 200);
      }
  }
  
  // Ensure preloader disappears even if some assets fail to load
  setTimeout(() => {
      if (preloader && !preloader.classList.contains('hidden')) {
          hidePreloader();
      }
  }, 5000);
}

// Start initial animations when preloader is hidden
function startInitialAnimations() {
  // Animate hero section elements
  animateHeroElements();
  
  // Reveal elements that are initially visible
  revealVisibleElements();
}

// Custom cursor functionality
function initCursor() {
  const cursor = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const cursorText = document.querySelector('.cursor-text');
  
  if (!cursor || !cursorOutline) return;
  
  // Check if device has touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  if (!isTouchDevice) {
      document.body.classList.add('cursor-enabled');
      
      // Update cursor position on mouse move
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
      
      // Add hover effect to interactive elements
      const interactiveElements = document.querySelectorAll('a, button, .card, .interactive, input, textarea, .cursor-hover-trigger');
      
      interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', () => {
              cursor.classList.add('cursor-hover');
              cursorOutline.classList.add('cursor-hover');
              
              // Show text for elements with data-cursor-text
              if (cursorText && el.dataset.cursorText) {
                  cursorText.textContent = el.dataset.cursorText;
                  document.body.classList.add('cursor-text-visible');
              }
          });
          
          el.addEventListener('mouseleave', () => {
              cursor.classList.remove('cursor-hover');
              cursorOutline.classList.remove('cursor-hover');
              
              // Hide text
              if (cursorText) {
                  document.body.classList.remove('cursor-text-visible');
              }
          });
      });
      
      // Add click effect
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

// Smooth scrolling implementation
function initSmoothScroll() {
  // Check if smooth scroll container exists
  const smoothScrollContainer = document.querySelector('.smooth-scroll-container');
  if (!smoothScrollContainer) return;
  
  // Initialize variables
  let scrollTop = 0;
  let lastScrollTop = 0;
  let ticking = false;
  
  // Set initial transform
  smoothScrollContainer.style.transform = 'translateY(0)';
  
  // Get scroll height
  function getScrollHeight() {
      return smoothScrollContainer.getBoundingClientRect().height - window.innerHeight;
  }
  
  // Handle scroll
  function handleScroll() {
      scrollTop = Math.max(0, Math.min(scrollTop, getScrollHeight()));
      if (Math.abs(scrollTop - lastScrollTop) > 1) {
          smoothScrollContainer.style.transform = `translateY(-${scrollTop}px)`;
          lastScrollTop = scrollTop;
      }
      ticking = false;
  }
  
  // Scroll event
  window.addEventListener('scroll', function(e) {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (!ticking) {
          window.requestAnimationFrame(handleScroll);
          ticking = true;
      }
  });
  
  // Resize event
  window.addEventListener('resize', function() {
      // Recalculate scroll height
      handleScroll();
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Toggle menu
  menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
  });
  
  // Close menu
  if (menuClose) {
      menuClose.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.classList.remove('menu-open');
      });
  }
  
  // Close menu when clicking links
  mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.classList.remove('menu-open');
      });
  });
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  // Check scroll position and add/remove classes
  function checkScroll() {
      if (window.scrollY > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  }
  
  // Initial check
  checkScroll();
  
  // Check on scroll
  window.addEventListener('scroll', checkScroll);
}

// Initialize all animations
function initAnimations() {
  // Text splitting for text animations
  initTextSplitting();
  
  // Initialize scroll-based animations
  initScrollAnimations();
  
  // Initialize parallax effect
  initParallax();
  
  // Initialize section-specific animations
  initHeroAnimation();
  initCardSpreadAnimation();
  initCardsCarouselAnimation();
  initFallingCardsAnimation();
  init3DGridAnimation();
  initCardDeckAnimation();
}

// Text splitting for animations
function initTextSplitting() {
  const splitTextElements = document.querySelectorAll('.split-text');
  
  splitTextElements.forEach(element => {
      let text = element.textContent;
      let splitHtml = '';
      
      // Split by words
      const words = text.split(' ');
      
      words.forEach((word, wordIndex) => {
          splitHtml += `<span class="word">`;
          
          // Split by characters
          Array.from(word).forEach((char, charIndex) => {
              splitHtml += `<span class="char" style="transition-delay: ${(wordIndex * 0.05) + (charIndex * 0.03)}s">${char}</span>`;
          });
          
          splitHtml += `</span> `;
      });
      
      element.innerHTML = splitHtml;
  });
}

// Scroll-based animations
function initScrollAnimations() {
  // Initialize Intersection Observer for animations
  const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
  };
  
  // Create observer for revealing animations
  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              
              // Play lottie animations if any
              if (entry.target.classList.contains('lottie-animation')) {
                  const animationId = entry.target.getAttribute('data-animation-id');
                  if (window.lottieAnimations && window.lottieAnimations[animationId]) {
                      window.lottieAnimations[animationId].play();
                  }
              }
              
              // Stop observing after animation
              if (!entry.target.classList.contains('keep-observing')) {
                  revealObserver.unobserve(entry.target);
              }
          } else {
              // Reset animation if it should repeat
              if (entry.target.classList.contains('keep-observing')) {
                  entry.target.classList.remove('revealed');
              }
          }
      });
  }, observerOptions);
  
  // Observe elements with reveal class
  document.querySelectorAll('.split-text, .lazy-load, .animate-on-scroll, .visual-title').forEach(el => {
      revealObserver.observe(el);
  });
  
  // Create observer for image reveal effects
  const imageRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              setTimeout(() => {
                  entry.target.classList.add('reveal');
              }, 200);
              
              // Stop observing after animation
              imageRevealObserver.unobserve(entry.target);
          }
      });
  }, observerOptions);
  
  // Observe elements with image-reveal class
  document.querySelectorAll('.content-image, .image-reveal').forEach(el => {
      imageRevealObserver.observe(el);
  });
}

// Parallax effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  const parallaxBg = document.querySelector('.parallax-bg');
  
  if (parallaxElements.length === 0 && !parallaxBg) return;
  
  // Update parallax on scroll
  function updateParallax() {
      const scrollTop = window.pageYOffset;
      
      // Update parallax elements
      parallaxElements.forEach(element => {
          const speed = element.getAttribute('data-parallax-speed') || 0.2;
          const offset = scrollTop * speed;
          element.style.transform = `translateY(${offset}px)`;
      });
      
      // Update parallax background
      if (parallaxBg) {
          const speed = parallaxBg.getAttribute('data-parallax-speed') || 0.2;
          const offset = scrollTop * speed;
          parallaxBg.style.transform = `translateY(${offset}px) translateZ(-50px) scale(1.5)`;
      }
  }
  
  // Initial update
  updateParallax();
  
  // Update on scroll
  window.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateParallax);
  });
}

// Hero section animations
function initHeroAnimation() {
  const heroShapes = document.querySelectorAll('.hero-shape-1, .hero-shape-2');
  const floatingCards = document.querySelectorAll('.floating-card');
  
  // Animate shapes
  heroShapes.forEach(shape => {
      // Random animation properties
      const duration = 15 + Math.random() * 10;
      const delay = Math.random() * 5;
      const x = 30 + Math.random() * 40;
      const y = 20 + Math.random() * 30;
      
      // Set animation
      shape.style.animation = `shapeAnimation ${duration}s ${delay}s infinite alternate ease-in-out`;
  });
  
  // Animate floating cards
  floatingCards.forEach(card => {
      // Random animation properties
      const duration = 3 + Math.random() * 2;
      const delay = Math.random() * 1;
      
      // Set animation
      card.style.animationDuration = `${duration}s`;
      card.style.animationDelay = `${delay}s`;
  });
}

// Animate hero elements when preloader is hidden
function animateHeroElements() {
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
}

// Reveal elements that are initially visible
function revealVisibleElements() {
  // Create observer
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('loaded');
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });
  
  // Observe elements
  document.querySelectorAll('.lazy-load').forEach(el => {
      observer.observe(el);
  });
}

// Card spread animation
function initCardSpreadAnimation() {
  const cardSpreadSection = document.querySelector('.cards-spread');
  if (!cardSpreadSection) return;
  
  const spreadCards = document.querySelectorAll('.spread-card');
  let cardPositions = [];
  
  // Store initial positions
  spreadCards.forEach((card, index) => {
      const transform = window.getComputedStyle(card).transform;
      cardPositions.push(transform);
  });
  
  // Function to update cards on scroll
  function updateCardPositions() {
      const rect = cardSpreadSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate visibility percentage
      let visiblePercent = 0;
      
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
          const visibleTop = Math.max(0, sectionTop);
          const visibleBottom = Math.min(windowHeight, sectionTop + sectionHeight);
          visiblePercent = (visibleBottom - visibleTop) / windowHeight;
      }
      
      // Update card positions based on scroll
      spreadCards.forEach((card, index) => {
          const progress = Math.min(1, visiblePercent * 1.5);
          let newTransform = cardPositions[index];
          
          // Apply movement based on scroll
          if (progress > 0) {
              const angle = parseInt(card.dataset.rotateAngle || 0);
              const moveX = parseInt(card.dataset.moveX || 0) * progress;
              const moveY = parseInt(card.dataset.moveY || 0) * progress;
              const rotateAdd = parseInt(card.dataset.rotateAdd || 0) * progress;
              
              newTransform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotate(${angle + rotateAdd}deg)`;
          }
          
          card.style.transform = newTransform;
      });
  }
  
  // Update on scroll
  window.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateCardPositions);
  });
  
  // Initial update
  updateCardPositions();
}

// 3D Cards Carousel
function initCardsCarouselAnimation() {
  const carousel = document.querySelector('.carousel-3d');
  if (!carousel) return;
  
  const cards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  let currentIndex = 0;
  const totalCards = cards.length;
  
  // Update carousel
  function updateCarousel() {
      cards.forEach((card, index) => {
          // Calculate position index relative to current card
          let position = (index - currentIndex) % totalCards;
          if (position < 0) position += totalCards;
          
          // Update card position
          card.style.setProperty('--card-index', position);
          
          // Set z-index based on position
          card.style.zIndex = totalCards - position;
          
          // Adjust opacity for far cards
          card.style.opacity = position > totalCards / 2 ? 0.5 : 1;
      });
  }
  
  // Initialize carousel
  updateCarousel();
  
  // Previous button
  if (prevBtn) {
      prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + totalCards) % totalCards;
          updateCarousel();
      });
  }
  
  // Next button
  if (nextBtn) {
      nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % totalCards;
          updateCarousel();
      });
  }
  
  // Auto rotate carousel
  let autoRotateTimer = null;
  
  function startAutoRotate() {
      stopAutoRotate();
      autoRotateTimer = setInterval(() => {
          currentIndex = (currentIndex + 1) % totalCards;
          updateCarousel();
      }, 3000);
  }
  
  function stopAutoRotate() {
      if (autoRotateTimer) {
          clearInterval(autoRotateTimer);
          autoRotateTimer = null;
      }
  }
  
  // Start auto-rotate
  startAutoRotate();
  
  // Stop auto-rotate on hover
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);
  
  // Handle card click
  cards.forEach((card, index) => {
      card.addEventListener('click', () => {
          // If clicked card is not current, make it current
          if (index !== currentIndex) {
              currentIndex = index;
              updateCarousel();
              return;
          }
          
          // Show modal or full view if card is current
          if (card.dataset.fullImage) {
              // Implementation for showing full image
          }
      });
  });
}

// Falling Cards Animation
function initFallingCardsAnimation() {
  const fallingCardsSection = document.querySelector('.falling-cards');
  if (!fallingCardsSection) return;
  
  const fallingCards = document.querySelectorAll('.falling-card');
  
  // Set random properties for each card
  fallingCards.forEach(card => {
      // Random positioning
      const randomLeft = Math.random() * 80 + 10; // 10-90%
      const randomDelay = Math.random() * 5; // 0-5s
      const randomDuration = Math.random() * 3 + 7; // 7-10s
      const randomRotate = Math.random() * 40 - 20; // -20 to 20 degrees
      const randomX = Math.random() * 200 - 100; // -100px to 100px
      
      // Apply random values
      card.style.left = `${randomLeft}%`;
      card.style.setProperty('--delay', `${randomDelay}s`);
      card.style.setProperty('--random-rotate', `${randomRotate}deg`);
      card.style.setProperty('--random-x', `${randomX}px`);
      card.style.animationDuration = `${randomDuration}s`;
      
      // Make card visible
      setTimeout(() => {
          card.style.opacity = '1';
      }, randomDelay * 1000);
  });
}

// 3D Grid Animation
function init3DGridAnimation() {
  const gridContainer = document.querySelector('.cards-grid-container');
  if (!gridContainer) return;
  
  const gridCards = document.querySelectorAll('.grid-card');
  
  // Set grid positions
  gridCards.forEach((card, index) => {
      // Calculate grid position (x, y)
      const col = index % 3;
      const row = Math.floor(index / 3);
      
      // Set data attributes for positioning
      card.dataset.gridX = col - 1; // -1, 0, 1
      card.dataset.gridY = row - 1; // -1, 0, 1
      
      // Set CSS variables
      card.style.setProperty('--x', card.dataset.gridX);
      card.style.setProperty('--y', card.dataset.gridY);
  });
  
  // Handle mouse movement for 3D effect
  gridContainer.addEventListener('mousemove', (e) => {
      const rect = gridContainer.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;
      
      // Calculate offset from center (normalized -0.5 to 0.5)
      const offsetX = mouseX - 0.5;
      const offsetY = mouseY - 0.5;
      
      // Apply effect to cards
      gridCards.forEach(card => {
          const cardX = parseFloat(card.dataset.gridX);
          const cardY = parseFloat(card.dataset.gridY);
          
          // Calculate intensity based on distance from mouse
          const distX = cardX - offsetX * 2;
          const distY = cardY - offsetY * 2;
          
          // Update transforms
          card.style.setProperty('--x', distX);
          card.style.setProperty('--y', distY);
      });
  });
  
  // Reset on mouse leave
  gridContainer.addEventListener('mouseleave', () => {
      gridCards.forEach(card => {
          // Reset to original position
          card.style.setProperty('--x', card.dataset.gridX);
          card.style.setProperty('--y', card.dataset.gridY);
      });
  });
}

// Card Deck Animation
function initCardDeckAnimation() {
  const deckSection = document.querySelector('.cards-deck');
  if (!deckSection) return;
  
  const deck = document.querySelector('.deck');
  const deckCards = document.querySelectorAll('.deck-card');
  const deckTop = document.querySelector('.deck-top');
  const drawButton = document.querySelector('.draw-button');
  
  // Set initial positions for deck cards
  deckCards.forEach((card, index) => {
      card.style.setProperty('--index', index + 1);
  });
  
  // Handle draw button click
  if (drawButton && deckTop) {
      drawButton.addEventListener('click', () => {
          // Flip top card
          deckTop.classList.add('flipped');
          
          // After animation, reset and shuffle deck
          setTimeout(() => {
              deckTop.classList.remove('flipped');
              
              // Shuffle the deck (visual effect)
              deckCards.forEach((card, index) => {
                  const randomOffset = Math.random() * 10 - 5;
                  card.style.transform = `translateZ(${-(index + 1)}px) translateY(${-(index + 1) + randomOffset}px) translateX(${randomOffset}px) rotateZ(${randomOffset/2}deg)`;
                  
                  // Reset position after shuffle animation
                  setTimeout(() => {
                      card.style.transform = `translateZ(${-(index + 1)}px) translateY(${-(index + 1)}px)`;
                  }, 500);
              });
          }, 800);
      });
  }
}

// Card interactions
function initCardInteractions() {
  // Interactive cards
  const interactiveCards = document.querySelectorAll('.card, .spread-card, .carousel-card, .grid-card');
  
  interactiveCards.forEach(card => {
      // 3D tilt effect on hover for cards
      card.addEventListener('mousemove', (e) => {
          const { left, top, width, height } = card.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          
          card.style.transform = `
              rotateY(${x * 20}deg)
              rotateX(${-y * 20}deg)
              translateZ(10px)
          `;
      });
      
      // Reset card position on mouse leave
      card.addEventListener('mouseleave', () => {
          card.style.transform = '';
      });
  });
}

// Initialize contact form
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  // Form validation
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
          if (!field.value.trim()) {
              isValid = false;
              field.classList.add('error');
          } else {
              field.classList.remove('error');
          }
      });
      
      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(emailField.value)) {
              isValid = false;
              emailField.classList.add('error');
          }
      }
      
      // If valid, simulate form submission
      if (isValid) {
          // Show loading indicator
          form.classList.add('submitting');
          
          // Simulate form submission (replace with actual submission code)
          setTimeout(() => {
              // Hide loading indicator
              form.classList.remove('submitting');
              
              // Show success message
              const formSuccess = document.createElement('div');
              formSuccess.className = 'form-success';
              formSuccess.innerHTML = `
                  <div class="icon"><i class="fas fa-check-circle"></i></div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for your message. We'll get back to you soon.</p>
              `;
              
              // Replace form with success message
              form.innerHTML = '';
              form.appendChild(formSuccess);
          }, 1500);
      }
  });
  
  // Add focus effects to form fields
  const formFields = form.querySelectorAll('input, textarea');
  
  formFields.forEach(field => {
      // Focus effect
      field.addEventListener('focus', () => {
          field.parentElement.classList.add('focused');
      });
      
      // Blur effect
      field.addEventListener('blur', () => {
          if (!field.value.trim()) {
              field.parentElement.classList.remove('focused');
          }
      });
      
      // Check initial state (for pre-filled fields)
      if (field.value.trim()) {
          field.parentElement.classList.add('focused');
      }
  });
}

// Initialize back to top button
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;
  
  // Check scroll position and toggle button visibility
  function checkScrollPosition() {
      if (window.scrollY > 500) {
          backToTopBtn.classList.add('visible');
      } else {
          backToTopBtn.classList.remove('visible');
      }
  }
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
  
  // Check scroll position on scroll
  window.addEventListener('scroll', checkScrollPosition);
  
  // Initial check
  checkScrollPosition();
}

// Scroll to element on anchor click
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Get offset considering header height
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      // Scroll to target
      window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
      });
  });
});

// Utility functions
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
      const context = this, args = arguments;
      const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
      }
  };
}

// Window resize handler with debounce
window.addEventListener('resize', debounce(function() {
  // Recalculate any size-dependent layouts
  
  // Check if mobile layout should be applied
  const isMobile = window.innerWidth < 768;
  document.body.classList.toggle('is-mobile', isMobile);
  
}, 200));