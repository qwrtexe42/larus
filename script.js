// ============================================================
// Интерактив сайта: загрузочный экран, появление секций,
// полоса прогресса, 3D-эффекты, лайтбокс, меню.
// ============================================================

// --- Загрузочный экран: минимальное время показа + уход шторки ---

const preloader = document.getElementById('preloader');
const loaderStart = Date.now();

function hideLoader() {
  const wait = Math.max(0, 2000 - (Date.now() - loaderStart));
  setTimeout(() => {
    preloader.classList.add('done');
    document.body.classList.add('loaded'); // старт анимаций hero
    setTimeout(() => preloader.remove(), 1100);
  }, wait);
}

if (document.readyState === 'complete') {
  hideLoader();
} else {
  window.addEventListener('load', hideLoader);
}

// --- Плавное появление секций при прокрутке ---

document.querySelectorAll('.section').forEach(section => {
  section.classList.add('reveal');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- Каскадное появление фото и карточек при прокрутке ---

// галерее задаём задержку по позиции в ряду, чтобы фото «выплывали» по очереди
document.querySelectorAll('.gallery__item').forEach((item, i) => {
  item.classList.add('sr');
  item.style.setProperty('--d', (i % 4) * 0.09 + 's');
});

// текстовые карточки и контакты — с лёгкой задержкой по номеру
document.querySelectorAll('.cards .card, .contacts .contact').forEach((item, i) => {
  item.classList.add('sr');
  item.style.setProperty('--d', (i % 3) * 0.12 + 's');
});

// события афиши
document.querySelectorAll('.event').forEach((item, i) => {
  item.classList.add('sr');
  item.style.setProperty('--d', i * 0.15 + 's');
});

// строки архивной летописи
document.querySelectorAll('.archive li').forEach((item, i) => {
  item.classList.add('sr');
  item.style.setProperty('--d', i * 0.1 + 's');
});

// колонки подвала
document.querySelectorAll('.footer__grid > *').forEach((item, i) => {
  item.classList.add('sr');
  item.style.setProperty('--d', i * 0.12 + 's');
});

// цитата на тёмной полосе
document.querySelectorAll('.band__quote, .band__author, .band .btn').forEach((item, i) => {
  item.classList.add('sr');
  item.style.setProperty('--d', 0.2 + i * 0.18 + 's');
});

// панель набора
document.querySelector('.join__panel')?.classList.add('sr');

const srObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      srObserver.unobserve(entry.target); // один раз достаточно
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sr').forEach(el => srObserver.observe(el));

// Заголовки секций «открываются» в 3D
document.querySelectorAll('.section__title').forEach(title => {
  title.classList.add('t3d');
  srObserver.observe(title);
});

// --- Полоса прогресса чтения (тонкая полоска сверху) ---

const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrolled / height) * 100 : 0;
  progressBar.style.width = percent + '%';
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// --- Шапка: тень при прокрутке + подсветка активного пункта меню ---

const header = document.querySelector('.header');

// --- Кнопка «наверх» ---

const toTop = document.getElementById('toTop');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
  toTop.classList.toggle('show', window.scrollY > 600);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const navLinks = document.querySelectorAll('.nav a');
const sections = [...navLinks]
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => navObserver.observe(section));

// --- Год в подвале обновляется сам ---

document.getElementById('year').textContent = new Date().getFullYear();

// --- Переключение фото руководителя по касанию (для телефонов) ---

const portrait = document.querySelector('.portrait');
if (portrait) {
  if (!window.matchMedia('(pointer: fine)').matches) {
    portrait.querySelector('.portrait__hint').textContent = 'нажмите ✦';
  }
  portrait.addEventListener('click', () => {
    portrait.classList.toggle('portrait--alt');
  });
}

// --- Мобильное меню ---

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// --- Лайтбокс: клик по фото в галерее открывает его на весь экран ---

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

document.querySelectorAll('.gallery__item img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('open');
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('open');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    lightbox.classList.remove('open');
  }
});

// --- 3D-наклон элементов за курсором (только на компьютерах) ---

const fine = window.matchMedia('(pointer: fine)').matches;

function attachTilt(el, strength = 6, lift = 4) {
  el.addEventListener('mousemove', event => {
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform =
      `perspective(700px) rotateY(${x * strength}deg) rotateX(${y * -strength}deg) translateY(${-lift}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}

if (fine) {
  document.querySelectorAll('.card, .contact, .event, .photo-card, .gallery__item, .portrait')
    .forEach(el => attachTilt(el, el.classList.contains('gallery__item') ? 9 : 6));

  // Магнитные кнопки: слегка притягиваются к курсору
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', event => {
      const rect = btn.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      btn.style.translate = `${x * 8}px ${y * 6}px`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.translate = '';
    });
  });
}

