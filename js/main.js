/**
 * Interacciones de UI: menú móvil, pestañas de instalación, toggle de privacidad.
 */
(function () {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  mobileMenuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });

  let privacyOn = false;
  window.toggleSimPrivacy = function toggleSimPrivacy() {
    privacyOn = !privacyOn;
    const toggleDot = document.getElementById("simToggleDot");
    const toggleBg = document.getElementById("simTogglePrivacy");
    const toggleText = document.getElementById("simToggleText");

    if (privacyOn) {
      toggleDot.style.left = "1rem";
      toggleBg.classList.remove("bg-gray-300");
      toggleBg.classList.add("bg-sabado-accent");
      toggleText.innerHTML =
        "<strong>Compartiendo con la clase.</strong> Tus comentarios son visibles para el grupo.";
      toggleText.classList.remove("text-gray-400");
      toggleText.classList.add("text-sabado-secondary");
    } else {
      toggleDot.style.left = "0.125rem";
      toggleBg.classList.remove("bg-sabado-accent");
      toggleBg.classList.add("bg-gray-300");
      toggleText.innerHTML = "Actualmente apagado. Solo tú puedes ver tus comentarios.";
      toggleText.classList.remove("text-sabado-secondary");
      toggleText.classList.add("text-gray-400");
    }
  };

  window.switchInstTab = function switchInstTab(platform) {
    document.querySelectorAll(".inst-tab-btn").forEach((btn) => {
      btn.classList.remove("border-sabado-accent", "text-sabado-primary", "font-bold");
      btn.classList.add("border-transparent", "text-gray-500");
    });

    const btnMap = { android: "tabBtnAndroid", ios: "tabBtnIos", pc: "tabBtnPc" };
    const boxMap = { android: "instAndroid", ios: "instIos", pc: "instPc" };

    const btn = document.getElementById(btnMap[platform]);
    btn?.classList.remove("border-transparent", "text-gray-500");
    btn?.classList.add("border-sabado-accent", "text-sabado-primary", "font-bold");

    document.querySelectorAll(".inst-content-box").forEach((box) => box.classList.add("hidden"));
    document.getElementById(boxMap[platform])?.classList.remove("hidden");
  };

  document.addEventListener("DOMContentLoaded", () => {
    const appUrl = window.APP_URL || "https://escuelasabatica-sable.vercel.app";
    document.querySelectorAll("[data-app-link]").forEach((el) => {
      el.setAttribute("href", appUrl);
    });
    document.querySelectorAll("[data-app-domain]").forEach((el) => {
      el.textContent = new URL(appUrl).hostname;
    });
  });
})();
