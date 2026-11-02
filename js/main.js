const SITE_NAME = "Azizah";
// Helpers
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ========== 1. Page tabs: each nav link opens its own view ==========
const views = $$(".view");
const navAnchors = $$("#nav-links a");

function showView() {
  const target = views.find((v) => v.id === location.hash.slice(1));
  if (!target) return; // ignore unknown hashes, keep the current view

  views.forEach((v) => (v.hidden = v !== target));
  navAnchors.forEach((a) => {
    if (a.getAttribute("href") === "#" + target.id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
    
    const label = navAnchors.find((a) => a.getAttribute("href") === "#" + target.id).textContent;
document.title = label + " | " + SITE_NAME;
  });

  window.scrollTo(0, 0);
  const heading = $("h1, h2", target); // move focus for keyboard and screen-reader users
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}
window.addEventListener("hashchange", showView);
if (!views.some((v) => v.id === location.hash.slice(1))) location.hash = "#home";
showView();

// ========== 2. Mobile menu ==========
const menuToggle = $("#menu-toggle");
const navLinks = $("#nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});
navAnchors.forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

// ========== 3. Dark / light theme (remembered) ==========
try {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
} catch (e) { /* storage unavailable: ignore */ }

$("#theme-toggle").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
});

// ========== 4. Project filter ==========
const filterButtons = $$(".filters button");
const cards = $$(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("active", b === button));
    cards.forEach((card) => {
      card.hidden = !(filter === "all" || card.dataset.category === filter);
    });
  });
});

// ========== 5. About tabs (arrow keys supported) ==========
$$(".tabs").forEach((tabs) => {
  const buttons = $$('[role="tab"]', tabs);
  const panels = $$('[role="tabpanel"]', tabs);

  function selectTab(selected) {
    buttons.forEach((b) => {
      const active = b === selected;
      b.setAttribute("aria-selected", active);
      b.tabIndex = active ? 0 : -1;
    });
    panels.forEach((p) => (p.hidden = p.id !== selected.getAttribute("aria-controls")));
  }

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => selectTab(button));
    button.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = buttons[(i + 1) % buttons.length];
      if (e.key === "ArrowLeft") next = buttons[(i - 1 + buttons.length) % buttons.length];
      if (next) { next.focus(); selectTab(next); }
    });
  });
});

// ========== 6. Contact form validation ==========
const form = $("#contact-form");
const status = $("#form-status");
const rules = [
  { id: "name", message: "Enter your name.", valid: (v) => v.length > 0 },
  { id: "email", message: "Enter a valid email, like name@example.com.",
    valid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  { id: "message", message: "Enter a message.", valid: (v) => v.length > 0 },
];

form.addEventListener("submit", (event) => {
  event.preventDefault(); // front-end only: nothing is sent
  let allValid = true;
  rules.forEach(({ id, message, valid }) => {
    const input = $("#" + id);
    const ok = valid(input.value.trim());
    $("#" + id + "-error").textContent = ok ? "" : message;
    input.setAttribute("aria-invalid", !ok);
    if (!ok) allValid = false;
  });
  status.textContent = allValid ? "Thanks! Your message looks good (demo form, nothing was sent)." : "";
  if (allValid) form.reset();
});

// ========== 7. Back-to-top button ==========
const backToTop = $("#back-to-top");
window.addEventListener("scroll", () => backToTop.classList.toggle("show", window.scrollY > 400));
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
