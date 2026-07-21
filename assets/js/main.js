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
  const locationSmsTrigger = document.querySelector("[data-location-sms-trigger]");
  const locationSmsStatus = document.querySelector("[data-location-sms-status]");

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

  if (locationSmsTrigger) {
    const setLocationStatus = (message, state = "") => {
      if (!locationSmsStatus) {
        return;
      }
      locationSmsStatus.textContent = message;
      locationSmsStatus.classList.remove("is-loading", "is-error", "is-success");
      if (state) {
        locationSmsStatus.classList.add(state);
      }
    };

    const buildViberHref = (message) => `viber://forward?text=${encodeURIComponent(message)}`;

    locationSmsTrigger.addEventListener("click", () => {
      const smsNumber = locationSmsTrigger.getAttribute("data-sms-number") || "+359896661319";

      if (!("geolocation" in navigator)) {
        setLocationStatus("Това устройство не поддържа автоматично споделяне на локация.", "is-error");
        return;
      }

      locationSmsTrigger.disabled = true;
      setLocationStatus("Извличаме текущата ви локация...", "is-loading");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const accuracy = Math.round(position.coords.accuracy || 0);
          const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
          const message = [
            `Спешно, закъсал/а съм. Моля за пътна помощ на ${smsNumber}.`,
            `Координати: ${lat}, ${lng}`,
            accuracy ? `Точност: около ${accuracy} м` : "",
            `Google Maps: ${mapsLink}`
          ].filter(Boolean).join("\n");

          setLocationStatus("Отваряме Viber с готова локация...", "is-success");
          window.location.href = buildViberHref(message);

          window.setTimeout(() => {
            locationSmsTrigger.disabled = false;
          }, 1200);
        },
        (error) => {
          let message = "Не успяхме да вземем текущата ви локация.";

          if (error.code === 1) {
            message = "Разрешете достъп до локацията, за да подготвим Viber съобщение с позицията ви.";
          } else if (error.code === 2) {
            message = "Локацията не можа да бъде определена. Опитайте отново след малко.";
          } else if (error.code === 3) {
            message = "Заявката за локация изтече. Опитайте отново.";
          }

          setLocationStatus(message, "is-error");
          locationSmsTrigger.disabled = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
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
