(function () {
  const body = document.body;
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const navLinks = document.querySelectorAll("[data-nav] a");
  const faqButtons = document.querySelectorAll("[data-faq-button]");
  const galleryButtons = document.querySelectorAll("[data-lightbox-trigger]");
  const dialog = document.querySelector("[data-lightbox]");
  const lightboxImage = dialog ? dialog.querySelector("[data-lightbox-image]") : null;
  const lightboxCaption = dialog ? dialog.querySelector("[data-lightbox-caption]") : null;
  const lightboxClose = dialog ? dialog.querySelector("[data-lightbox-close]") : null;
  const yearNode = document.querySelector("[data-current-year]");
  const mobileSticky = document.querySelector(".mobile-sticky");
  const hero = document.querySelector(".hero");

  const closeNav = () => {
    if (!toggle || !nav) {
      return;
    }
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    body.classList.remove("menu-open");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
      body.classList.toggle("menu-open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) {
        closeNav();
      }
    });
  }

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item ? item.querySelector(".faq-answer") : null;
      if (!item || !answer) {
        return;
      }

      const isOpen = item.classList.contains("open");
      item.classList.toggle("open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : "0px";
    });
  });

  if (dialog && lightboxImage && lightboxCaption) {
    galleryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        lightboxImage.src = button.getAttribute("data-image-src") || "";
        lightboxImage.alt = button.getAttribute("data-image-alt") || "";
        lightboxCaption.textContent = button.getAttribute("data-image-caption") || "";
        dialog.showModal();
      });
    });

    lightboxClose?.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const clickedOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (clickedOutside) {
        dialog.close();
      }
    });
  }

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  if (mobileSticky) {
    const updateStickyVisibility = () => {
      if (window.innerWidth >= 480) {
        mobileSticky.classList.add("is-visible");
        return;
      }

      const threshold = hero ? Math.max(260, hero.offsetHeight - 140) : 280;
      mobileSticky.classList.toggle("is-visible", window.scrollY > threshold);
    };

    updateStickyVisibility();
    window.addEventListener("scroll", updateStickyVisibility, { passive: true });
    window.addEventListener("resize", updateStickyVisibility);
  }
})();
