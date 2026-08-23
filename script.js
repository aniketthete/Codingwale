// CodingWale Universal Application Script
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. NAVIGATION & MOBILE MENU TOGGLE
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const ctaButtons = document.querySelectorAll('.cta-button, .enroll-btn');

  // Sticky Navbar Effect on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Smooth CTA Click Visual Feedback
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });

  // ==========================================
  // 2. COURSES PAGE FILTER SYSTEM
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterBtns.length > 0 && courseCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Filter cards with smooth fade effect
        courseCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');

          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          card.style.transition = 'all 0.3s ease';

          setTimeout(() => {
            if (filterValue === 'all' || cardCategory === filterValue) {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 50);
            } else {
              card.style.display = 'none';
            }
          }, 200);
        });
      });
    });
  }

  // ==========================================
  // 3. INTERACTIVE ENROLLMENT MODAL TRIGGER
  // ==========================================
  const enrollBtns = document.querySelectorAll('.enroll-btn');

  enrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.course-card');
      const courseTitle = card ? card.querySelector('h3').innerText : 'Selected Module';
      
      alert(`🚀 Enrolling into: "${courseTitle}"\n\nRedirecting to quantum sandbox environment...`);
    });
  });

});
