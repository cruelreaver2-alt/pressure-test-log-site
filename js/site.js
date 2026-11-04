(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(closeNav, 0);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  var banner = document.getElementById("consent-banner");
  var accept = document.getElementById("consent-accept");
  var reject = document.getElementById("consent-reject");
  var reopen = document.getElementById("consent-reopen");
  var storageKey = "ptl-consent";

  function consentUpdate(granted) {
    var value = granted ? "granted" : "denied";
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
        analytics_storage: value
      });
    }
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {}
  }

  function showBanner(moveFocus) {
    if (!banner) return;
    banner.hidden = false;
    document.body.classList.add("has-consent-banner");
    if (moveFocus && reject) reject.focus();
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove("has-consent-banner");
  }

  if (accept) {
    accept.addEventListener("click", function () {
      consentUpdate(true);
      hideBanner();
    });
  }

  if (reject) {
    reject.addEventListener("click", function () {
      consentUpdate(false);
      hideBanner();
    });
  }

  if (reopen) {
    reopen.addEventListener("click", function () {
      showBanner(true);
    });
  }

  var stored = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch (error) {}

  if (stored !== "granted" && stored !== "denied") showBanner(false);
})();
