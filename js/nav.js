// /js/nav.js - Universal Navigation & Mobile Menu Handler for HashGANG

function toggleMenu() {
  const menu = document.getElementById("navMenu");
  const overlay = document.getElementById("navOverlay");
  if (!menu) return;
  const isOpen = menu.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}

function closeMenu() {
  const menu = document.getElementById("navMenu");
  const overlay = document.getElementById("navOverlay");
  if (menu) menu.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function toggleSolutionsDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById("dropdownSolutions");
  if (dropdown) dropdown.classList.toggle("open");
}

// Global click-outside listener: closes mobile drawer if user taps anywhere outside the menu
document.addEventListener("click", (e) => {
  const menu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger-btn");
  if (menu && menu.classList.contains("active")) {
    if (!menu.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
      closeMenu();
    }
  }
  const dropdown = document.getElementById("dropdownSolutions");
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

// Close mobile drawer on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    const dropdown = document.getElementById("dropdownSolutions");
    if (dropdown) dropdown.classList.remove("open");
  }
});

// Automatically close drawer when any link inside navMenu is clicked
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });
});

