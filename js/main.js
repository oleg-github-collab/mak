// Ініціалізація AOS
AOS.init({
    duration: 1000,
    once: true,
  });
  
  // Логіка форми
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    document.getElementById('form-response').innerText = 'Дякуємо! Ваше повідомлення надіслано.';
    form.reset();
  });
  