class ThemeSwitcherComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; }
        .theme-switcher {
          display: inline-flex;
          border: 1px solid var(--toggle-border, rgba(15, 23, 42, 0.12));
          border-radius: 999px;
          overflow: hidden;
          background: var(--toggle-bg, rgba(255, 255, 255, 0.65));
          box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
        }

        button {
          border: none;
          background: transparent;
          color: var(--text, #1f2937);
          padding: 0.65rem 0.95rem;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.2s ease, color 0.2s ease;
        }

        button:hover,
        button.active {
          background: var(--toggle-active-bg, rgba(37, 99, 235, 0.14));
          color: var(--accent, #2563eb);
        }

        button:hover {
          background: var(--toggle-hover-bg, rgba(37, 99, 235, 0.1));
        }

        button:not(:last-child) {
          border-right: 1px solid var(--toggle-inner-border, rgba(15, 23, 42, 0.08));
        }
      </style>
      <div class="theme-switcher" role="group" aria-label="Theme selector">
        <button type="button" data-theme="light">Light</button>
        <button type="button" data-theme="dark">Dark</button>
        <button type="button" data-theme="styled">Styled</button>
      </div>
    `;
    this.buttons = Array.from(this.shadowRoot.querySelectorAll('button'));
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  connectedCallback() {
    this.buttons.forEach(button => button.addEventListener('click', this.onButtonClick));
    this.loadTheme();
  }

  disconnectedCallback() {
    this.buttons.forEach(button => button.removeEventListener('click', this.onButtonClick));
  }

  onButtonClick(event) {
    this.setTheme(event.currentTarget.dataset.theme);
  }

  loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'styled');
    this.setTheme(defaultTheme);
  }

  setTheme(mode) {
    const isDark = mode === 'dark';
    const isStyled = mode === 'styled';

    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('styled-mode', isStyled);
    this.buttons.forEach(button => button.classList.toggle('active', button.dataset.theme === mode));
    localStorage.setItem('theme', mode);
  }
}

customElements.define('theme-switcher-component', ThemeSwitcherComponent);

document.addEventListener('DOMContentLoaded', function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');

  function openLightbox(img) {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || 'Expanded image';
    lightboxCaption.textContent = img.dataset.caption || img.alt || '';
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImage.src = '';
  }

  document.querySelectorAll('figure img, .side-panel .side-image img').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img);
    });
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox || event.target === lightboxImage) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
});
