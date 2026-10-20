// ========== 1. Mobile menu toggle ==========
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen); // for screen readers
});

// Close the menu after clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ========== 2. Dark / light theme toggle (saved) ==========
const themeToggle = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ========== 3. Highlight active nav link on scroll ==========
const sections = document.querySelectorAll("main section");
const links = document.querySelectorAll("#nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  },
  { threshold: 0.5 } // section is "active" when half is visible
);

sections.forEach((section) => observer.observe(section));

// ========== 4. Project filter ==========
const filterButtons = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      card.hidden = !(filter === "all" || card.dataset.category === filter);
    });
  });
});

// ========== 5. Contact form validation ==========
const form = document.getElementById("contact-form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  // Remove old error messages
  form.querySelectorAll(".error").forEach((el) => el.remove());

  const fields = [
    { input: form.name, message: "Please enter your name." },
    { input: form.email, message: "Please enter a valid email." },
    { input: form.message, message: "Please enter a message." },
  ];

  let valid = true;

  fields.forEach(({ input, message }) => {
    const value = input.value.trim();
    const emailBad = input.type === "email" && !value.includes("@");

    if (value === "" || emailBad) {
      const error = document.createElement("p");
      error.className = "error";
      error.textContent = message;
      error.style.color = "#b91c1c";
      input.after(error);
      valid = false;
    }
  });

  if (valid) {
    form.reset();
    const success = document.createElement("p");
    success.className = "error";
    success.textContent = "Thanks! Your message was validated (demo only).";
    form.append(success);
  }
});

// ========== 6. Back-to-top button ==========
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 400 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});