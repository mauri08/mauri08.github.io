// Navegación
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menú móvil
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Cambiar estilo de navbar al hacer scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Activar enlace de navegación según la sección visible
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Scroll suave para anclajes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Galería - Filtros
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar clase active al botón clickeado
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Modal de Galería
const galleryModal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentImageIndex = 0;
let visibleImages = [];

// Obtener todas las imágenes visibles
function updateVisibleImages() {
    visibleImages = Array.from(galleryItems)
        .filter(item => !item.classList.contains('hidden'))
        .map(item => item.querySelector('img').src);
}

// Abrir modal
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        const img = item.querySelector('img');
        currentImageIndex = visibleImages.indexOf(img.src);
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Cerrar modal
modalClose.addEventListener('click', () => {
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
});

galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Navegación en el modal
modalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    modalImage.src = visibleImages[currentImageIndex];
});

modalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    modalImage.src = visibleImages[currentImageIndex];
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (galleryModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
            modalImage.src = visibleImages[currentImageIndex];
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
            modalImage.src = visibleImages[currentImageIndex];
        }
    }
});

// Formulario de Contacto
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    const submitButton = contactForm.querySelector('.submit-button');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        formStatus.textContent = 'Enviando tu consulta...';
        formStatus.className = 'form-status';
        submitButton.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                formStatus.textContent = '¡Gracias! Te contactaremos muy pronto.';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                const data = await response.json().catch(() => null);
                const errorMessage = data?.errors?.map(err => err.message).join(', ') || 'Hubo un error al enviar tu consulta. Intenta nuevamente.';
                formStatus.textContent = errorMessage;
                formStatus.classList.add('error');
            }
        } catch (error) {
            formStatus.textContent = 'No pudimos enviar tu consulta. Revisa tu conexión e inténtalo otra vez.';
            formStatus.classList.add('error');
        } finally {
            submitButton.disabled = false;
        }
    });
}

// Animación al hacer scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animación
document.querySelectorAll('.feature-card, .gallery-item, .service-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Inicializar visibleImages
updateVisibleImages();


