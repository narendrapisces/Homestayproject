// ─── Mobile Menu Toggle ───
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
    const isOpen = navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.textContent = isOpen ? '✕' : '☰';
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', closeMenu);

// Close menu when a nav link is tapped
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
});

// ─── Smooth scrolling ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

// ─── Scroll-triggered fade-in ───
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.experience-card, .package-card, .team-member, .feature-item, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
