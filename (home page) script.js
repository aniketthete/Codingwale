// Mobile Menu Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Animated Stat Counters
const counters = document.querySelectorAll('.counter');
let countersTriggered = false;

function animateCounters() {
  const metricsSection = document.getElementById('metrics');
  if (!metricsSection) return;

  const sectionPos = metricsSection.getBoundingClientRect().top;
  const screenPos = window.innerHeight;

  if (sectionPos < screenPos && !countersTriggered) {
    countersTriggered = true;
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const speed = target / 60;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
      updateCount();
    });
  }
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);
