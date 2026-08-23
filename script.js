document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
  });

  // Courses Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterBtns.length > 0 && courseCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        courseCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Enrollment and Form Handlers
  const enrollBtns = document.querySelectorAll('.enroll-btn');
  enrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.course-card');
      const title = card ? card.querySelector('h3').innerText : 'Module';
      alert(`🚀 Enrolling in: "${title}"`);
    });
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('📡 Transmission Received!');
      contactForm.reset();
    });
  }
});
