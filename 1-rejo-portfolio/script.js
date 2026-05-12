/* ============================================================
   REJO — Portfolio JavaScript
   ============================================================
   Sections:
   1. Loader
   2. Scroll Progress Bar
   3. Navbar — scroll state + active link highlight
   4. Hamburger / Mobile Menu
   5. Dark / Light Theme Toggle
   6. Hero Typing Effect
   7. Scroll Reveal Animation
   8. Skill Bar Animation (triggered on scroll)
   9. Smooth close mobile menu on link click
   ============================================================ */


/* ============================================================
   UTILITY — wait for DOM to be ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. LOADER
     Shows a fake terminal boot sequence, then fades out.
     To change the boot text: edit the `steps` array below.
  ---------------------------------------------------------- */
  const loader     = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');

  // Steps shown one by one in the loader terminal
  const steps = [
    'initializing...',
    'loading modules...',
    'booting portfolio...',
    'welcome, rejo.'
  ];

  let stepIndex = 0;

  function runLoaderStep() {
    if (stepIndex < steps.length) {
      loaderText.textContent = steps[stepIndex];
      stepIndex++;
      // Each step shows for a short delay
      setTimeout(runLoaderStep, stepIndex === steps.length ? 500 : 420);
    } else {
      // All steps done — hide the loader
      setTimeout(() => {
        loader.classList.add('hidden');
        // After loader hides, trigger hero animations
        document.body.style.overflow = '';
      }, 600);
    }
  }

  // Freeze scroll while loader is visible
  document.body.style.overflow = 'hidden';
  setTimeout(runLoaderStep, 300);


  /* ----------------------------------------------------------
     2. SCROLL PROGRESS BAR
     The thin line at the very top of the page.
     Width grows as the user scrolls down.
  ---------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    // How far the page can scroll total
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    // How far we've scrolled right now
    const scrolled   = window.scrollY;
    // Convert to a percentage
    const pct        = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });


  /* ----------------------------------------------------------
     3. NAVBAR — scroll state + active section highlight
     - Adds `.scrolled` class when user scrolls past 20px
       (this triggers the frosted-glass background in CSS)
     - Highlights the nav link matching the current section
  ---------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    // Frosted glass effect after scrolling down
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link: find which section is currently in view
    let currentSection = '';
    sections.forEach(sec => {
      const top    = sec.offsetTop - 100;   // 100px offset for navbar height
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      // Match the link href (#about) with the section id (about)
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // Run once on load


  /* ----------------------------------------------------------
     4. HAMBURGER MENU (mobile)
     Toggles the mobile dropdown menu open/closed.
     Also closes when a mobile link is clicked.
  ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close the mobile menu when any mobile nav link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });


  /* ----------------------------------------------------------
     5. DARK / LIGHT THEME TOGGLE
     HOW IT WORKS:
     - The <html> tag has data-theme="dark" by default (set in HTML)
     - Toggling switches it to "dark" or "light"
     - CSS variables in style.css respond to [data-theme="light"]
     - The user's preference is saved in localStorage so it
       persists when they revisit the page.

     HOW TO CUSTOMIZE:
     - Change color values in style.css under :root (dark)
       and [data-theme="light"] (light)
  ---------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');
  const htmlEl      = document.documentElement;

  // Load saved preference from localStorage (if any)
  const savedTheme = localStorage.getItem('rejo-theme');
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('rejo-theme', next);
    updateThemeIcon(next);
  });

  // Switch the button icon based on current theme
  function updateThemeIcon(theme) {
    if (theme === 'light') {
      // Light mode — show moon icon (click to go dark)
      themeIcon.className = 'ph ph-moon';
    } else {
      // Dark mode — show sun icon (click to go light)
      themeIcon.className = 'ph ph-sun';
    }
  }

  // Set correct icon on initial load
  updateThemeIcon(htmlEl.getAttribute('data-theme'));


  /* ----------------------------------------------------------
     6. HERO TYPING EFFECT
     Types out the terminal output line character by character.
     To change the text: edit the `outputText` string below.
  ---------------------------------------------------------- */
  const typingTarget = document.getElementById('typing-output');
  const outputText   = 'A self-taught dev. Front-end, Python, Linux, AI (someday).';

  let charIndex  = 0;
  let typingDone = false;

  function typeNextChar() {
    if (charIndex < outputText.length) {
      typingTarget.textContent += outputText[charIndex];
      charIndex++;
      // Randomize delay slightly for a natural typing feel
      const delay = 30 + Math.random() * 35;
      setTimeout(typeNextChar, delay);
    } else {
      typingDone = true;
    }
  }

  // Start typing after loader finishes (approximately)
  setTimeout(typeNextChar, 1800);


  /* ----------------------------------------------------------
     7. SCROLL REVEAL ANIMATION
     Any element with class `.reveal` fades in when it enters
     the viewport. Uses IntersectionObserver (modern, efficient).

     To make any element animate on scroll:
     Just add class="reveal" to it in HTML.
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing once revealed (no repeat animation)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,    // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px'  // Slightly before the bottom edge
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     8. SKILL BAR ANIMATION
     The skill progress bars animate (grow from 0 to their %)
     when the Skills section scrolls into view.
     Width is set via CSS variable --pct in the HTML.
  ---------------------------------------------------------- */
  const skillBars  = document.querySelectorAll('.skill-fill');
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          skillBars.forEach((bar, i) => {
            // Stagger each bar slightly
            setTimeout(() => {
              bar.style.animationPlayState = 'running';
            }, i * 80);
          });
          skillObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  // Pause bars until triggered (they start paused via CSS)
  skillBars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
  });


  /* ----------------------------------------------------------
     9. SMOOTH SCROLL for anchor links
     Handles cases where the built-in CSS scroll-behavior
     might not account for the fixed navbar height offset.
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar.offsetHeight;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top:      targetTop,
        behavior: 'smooth'
      });
    });
  });


}); // end DOMContentLoaded