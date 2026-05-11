/**
 * script.js
 * REJO — Personal Portfolio
 *
 * Functionality:
 * - Loader screen with typing effect
 * - Scroll progress indicator
 * - Navbar background change on scroll
 * - Active nav link highlighting based on scroll position
 * - Mobile hamburger menu toggle
 * - Dark/Light theme toggle with localStorage persistence
 * - Scroll reveal animation for sections
 * - Smooth scrolling for navigation links
 * - Typing effect in Hero terminal
 */

// ============================================================
// 1. LOADER SCREEN WITH TYPING EFFECT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const loaderTextSpan = document.getElementById('loader-text');

  if (loader && loaderTextSpan) {
    const messages = [
      'whoami',
      '> rejo',
    //   '> self-taught developer',
    //   '> exploring front-end & AI',
    //   '> system ready.',
    ];
    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = '';
    let isDeleting = false;

    function typeLoaderEffect() {
      // Get current message based on index
      if (messageIndex < messages.length) {
        currentMessage = messages[messageIndex];
      } else {
        // If all messages are done, exit loader after a short delay
        setTimeout(() => {
          if (loader) {
            loader.classList.add('hidden');
          }
        }, 600);
        return;
      }

      if (!isDeleting && charIndex <= currentMessage.length) {
        // Typing phase
        loaderTextSpan.textContent = currentMessage.substring(0, charIndex);
        charIndex++;
        setTimeout(typeLoaderEffect, 80);
      } else if (isDeleting && charIndex >= 0) {
        // Deleting phase (optional but adds nice effect)
        loaderTextSpan.textContent = currentMessage.substring(0, charIndex);
        charIndex--;
        setTimeout(typeLoaderEffect, 40);
      } else {
        // Switch between typing and deleting
        if (!isDeleting && charIndex > currentMessage.length) {
          // Finished typing current message, wait then delete
          isDeleting = true;
          setTimeout(typeLoaderEffect, 1000);
        } else if (isDeleting && charIndex < 0) {
          // Finished deleting, move to next message
          isDeleting = false;
          messageIndex++;
          charIndex = 0;
          setTimeout(typeLoaderEffect, 200);
        }
      }
    }

    // Start the typing effect for loader
    typeLoaderEffect();
  } else {
    // If loader elements missing, just hide loader quickly
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 500);
    }
  }
});

// ============================================================
// 2. SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('scroll-progress');

function updateScrollProgress() {
  if (!progressBar) return;
  const winScroll = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

// ============================================================
// 3. NAVBAR BACKGROUND CHANGE ON SCROLL & ACTIVE LINK HIGHLIGHT
// ============================================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function handleNavbarScroll() {
  if (!navbar) return;
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveNavLink() {
  let current = '';
  const scrollPos = window.scrollY + 150; // offset for better accuracy

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href.substring(1) === current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  handleNavbarScroll();
  updateActiveNavLink();
});
handleNavbarScroll();
updateActiveNavLink();

// ============================================================
// 4. MOBILE HAMBURGER MENU TOGGLE
// ============================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    // Prevent body scroll when menu is open (optional)
    if (mobileMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu when a link is clicked
  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Also close menu on window resize if it becomes visible desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    if (hamburger) hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ============================================================
// 5. DARK/LIGHT THEME TOGGLE WITH LOCALSTORAGE
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    if (themeIcon) {
      themeIcon.classList.remove('ph-moon');
      themeIcon.classList.add('ph-sun');
    }
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    if (themeIcon) {
      themeIcon.classList.remove('ph-sun');
      themeIcon.classList.add('ph-moon');
    }
    localStorage.setItem('theme', 'dark');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// ============================================================
// 6. SCROLL REVEAL ANIMATION (Intersection Observer)
// ============================================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -10px 0px',
  }
);

revealElements.forEach((el) => {
  revealObserver.observe(el);
});

// ============================================================
// 7. SMOOTH SCROLLING FOR NAVIGATION LINKS
// ============================================================
const allNavLinks = document.querySelectorAll(
  '.nav-link, .mobile-link, .hero-cta .btn, .footer a[href^="#"]'
);

allNavLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // adjust for navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          if (hamburger) hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    }
  });
});

// ============================================================
// 8. HERO TERMINAL TYPING EFFECT
// ============================================================
const typingOutput = document.getElementById('typing-output');

if (typingOutput) {
  const heroMessages = [
    '> rejo',
    '> self-taught developer',
    '> front-end & python',
    '> exploring AI systems',
  ];
  let heroMsgIndex = 0;
  let heroCharIndex = 0;
  let heroCurrent = '';

  function typeHeroEffect() {
    if (heroMsgIndex >= heroMessages.length) {
      // Stop typing effect once done
      return;
    }

    heroCurrent = heroMessages[heroMsgIndex];
    if (heroCharIndex <= heroCurrent.length) {
      typingOutput.textContent = heroCurrent.substring(0, heroCharIndex);
      heroCharIndex++;
      setTimeout(typeHeroEffect, 70);
    } else {
      // Move to next message after delay
      heroMsgIndex++;
      heroCharIndex = 0;
      if (heroMsgIndex < heroMessages.length) {
        // Add a line break and continue
        typingOutput.innerHTML += '<br>';
      }
      setTimeout(typeHeroEffect, 300);
    }
  }

  // Start hero typing effect after a slight delay (once loader is almost done)
  setTimeout(() => {
    typeHeroEffect();
  }, 800);
}

// ============================================================
// 9. ADDITIONAL POLISH: Prevent scroll progress flicker
// ============================================================
window.dispatchEvent(new Event('scroll'));

// ============================================================
// 10. HANDLE CV BUTTON FALLBACK (Optional: console feedback)
// ============================================================
const cvBtn = document.querySelector('.cv-btn');
if (cvBtn) {
  cvBtn.addEventListener('click', (e) => {
    // If CV file doesn't exist, user will see a failed download.
    // This is just to inform during development.
    console.log('CV download attempted — ensure rejo-cv.pdf exists in the root folder.');
  });
}

// ============================================================
// End of script.js
// ============================================================