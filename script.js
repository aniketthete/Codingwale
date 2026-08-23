document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('📡 Transmission Received! Our engineering advisory team will reach out shortly.');
      contactForm.reset();
    });
  }

  const actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    });
  });
});
