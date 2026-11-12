// ==========================================================
// ÁUREA Studio — Interactividad
// ==========================================================


// ========== MENÚ MÓVIL ==========
document.documentElement.classList.add("js");


const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const desktopQuery = window.matchMedia("(min-width: 901px)");

function openMenu() {
  navMenu.classList.add("is-open");
  navToggle.classList.add("is-active");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Cerrar menú");
  document.body.classList.add("no-scroll");
}

function closeMenu() {
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("is-active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");
  document.body.classList.remove("no-scroll");
}

function toggleMenu() {
  const isOpen = navMenu.classList.contains("is-open");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

// Abrir / cerrar con la hamburguesa
navToggle.addEventListener("click", toggleMenu);

// Cerrar al elegir un enlace
navLinks.forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

// Cerrar con la tecla Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Cerrar si la pantalla pasa a tamaño escritorio
desktopQuery.addEventListener("change", function (event) {
  if (event.matches) {
    closeMenu();
  }
});

// ========= CONTADORES CON ANIMACIÓN ============= 
const counters = document.querySelectorAll(".stat__number");
const counterDuration = 2000;
const prefersReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / counterDuration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    counter.textContent = Math.round(target * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

const counterObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

if (!prefersReduceMotion) {
  counters.forEach(function (counter) {
    counter.textContent = "0";
    counterObserver.observe(counter);
  });
}

// ============= CARRUSEL DE TESTIMONIOS ============ //
// 1. el estado: let currentIndex = 0;
// - es la "memoria" del carrusel: qué testimonio está a la vista ahora
// - se usa let y no const porque su valor va a cambiar con cada clic. Esa es la regla: const por defecto y let solo si hay que reasignar.
// - vale 0 porque las listas en JS empiezan siempre en 0: el primer testimonio es testimonials[0], el segundo es testimonials[1] y el tercero testimonials[2].

// showTestimonial(index)
// - quita is-active del testimonio actual, que se desvanece gracias al CSS.
// - calcula el nuevo indice
// - añade is-active al nuevo, que aparece subiendo, y actualiza el contador. Usa currentIndex + 1 porque las personas cuentan desde 1, aun que JS cuente desde 0.
const testimonials = document.querySelectorAll(".testimonial");
const prevButton = document.getElementById("testimonial-prev");
const nexButton = document.getElementById("testimonial-next");
const currentCounter = document.getElementById("testimonial-current");
const totalCounter = document.getElementById("testimonial-total");

let currentIndex = 0;

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function showTestimonial(index) {
  testimonials[currentIndex].classList.remove("is-active");

  currentIndex = (index + testimonials.length) % testimonials.length;
  
  testimonials[currentIndex].classList.add("is-active");
  currentCounter.textContent = formatNumber(currentIndex + 1);
}

prevButton.addEventListener("click", function() {
  showTestimonial(currentIndex - 1);
});

nexButton.addEventListener("click", function () {
  showTestimonial(currentIndex + 1);
});

totalCounter.textContent = formatNumber(testimonials.length);

// ========== VALIDACIÓN DEL FORMULARIO ==========
const contactForm = document.getElementById("contact-form");
const formFields = contactForm.querySelectorAll("input, select, textarea");
const formSuccess = document.getElementById("form-success");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s()-]{9,}$/;

function getErrorMessage(field) {
  const value = field.value.trim();

  switch (field.id) {
    case "name":
      if (value === "") return "Escribe tu nombre.";
      if (value.length < 2) return "El nombre debe tener al menos 2 caracteres.";
      break;

    case "email":
      if (value === "") return "Escribe tu email.";
      if (!emailPattern.test(value)) return "Introduce un email válido, por ejemplo nombre@correo.com.";
      break;

    case "phone":
      if (value !== "" && !phonePattern.test(value)) return "Introduce un teléfono válido (mínimo 9 dígitos).";
      break;

    case "project-type":
      if (value === "") return "Selecciona el tipo de proyecto.";
      break;

    case "message":
      if (value === "") return "Cuéntanos brevemente tu proyecto.";
      if (value.length < 20) return `El mensaje debe tener al menos 20 caracteres (llevas ${value.length}).`;
      break;

    case "privacy":
      if (!field.checked) return "Debes aceptar la política de privacidad.";
      break;
  }

  return "";
}

function validateField(field) {
  const message = getErrorMessage(field);
  const errorElement = document.getElementById(`${field.id}-error`);
  const hasError = message !== "";

  errorElement.textContent = message;
  field.classList.toggle("is-invalid", hasError);
  field.setAttribute("aria-invalid", hasError);

  return !hasError;
}

// Validar al salir de cada campo y revalidar al corregir
formFields.forEach(function (field) {
  field.addEventListener("blur", function () {
    validateField(field);
  });

  field.addEventListener("input", function () {
    if (field.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }
  });
});

// Envío
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  formSuccess.textContent = "";

  let firstInvalidField = null;

  formFields.forEach(function (field) {
    const isValid = validateField(field);

    if (!isValid && firstInvalidField === null) {
      firstInvalidField = field;
    }
  });

  if (firstInvalidField !== null) {
    firstInvalidField.focus();
    return;
  }

  const firstName = document.getElementById("name").value.trim().split(" ")[0];
  formSuccess.textContent = `Gracias, ${firstName}. Hemos recibido tu mensaje y te responderemos en menos de 48 horas.`;
  contactForm.reset();
});

// ========== AÑO ACTUAL EN EL FOOTER ==========
document.getElementById("current-year").textContent = new Date().getFullYear();

// ========== ANIMACIONES AL HACER SCROLL ==========
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(function (element) {
  revealObserver.observe(element);
});