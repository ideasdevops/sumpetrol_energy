// ============================================
// Sumpetrol Landing Page - JavaScript Moderno
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // MENU TOGGLE (Mobile)
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ACTIVE NAVIGATION LINK
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        const headerHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Activar enlace "Inicio" cuando estás en el hero
        if (scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#inicio') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .value-card, .service-showcase-card, .about-stat-card, .contact-detail-item'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });

    // ============================================
    // COUNTER ANIMATION (Stats)
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section-background, .hero-background');
        
        parallaxElements.forEach(el => {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestParallaxTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxTick);

    // ============================================
    // FORM VALIDATION & SUBMISSION
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Validación en tiempo real
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Envío del formulario
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitForm(this);
            } else {
                // Scroll al primer campo con error
                const firstError = this.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remover mensajes de error previos
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
        
        // Validación según el tipo de campo
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingrese un email válido';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingrese un teléfono válido';
            }
        }
        
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            errorDiv.style.cssText = 'color: #8B1538; font-size: 0.85rem; margin-top: 0.25rem;';
            field.parentElement.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    function submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const formData = new FormData(form);
        
        // Cambiar estado del botón
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Enviando...</span><i class="fas fa-spinner fa-spin"></i>';
        
        // Preparar datos del formulario
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Enviar a endpoint PHP
        fetch('send-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'success');
                form.reset();
            } else {
                showNotification('Error al enviar el mensaje. Por favor, intente nuevamente o contáctenos directamente.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al enviar el mensaje. Por favor, intente nuevamente o contáctenos directamente.', 'error');
        })
        .finally(() => {
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        });
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'success') {
        // Remover notificación existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#e76f51'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Añadir animaciones CSS para notificaciones
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #8B1538 !important;
            background: #fff5f5 !important;
        }
    `;
    document.head.appendChild(notificationStyles);

    // ============================================
    // INTERACTIVE TABS SECTION (Minería y Energías Renovables)
    // ============================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    function switchTab(tabName) {
        // Desactivar todos los tabs
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `content-${tabName}`) {
                content.classList.add('active');
            }
        });
    }
    
    // Event listeners para botones de tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // ============================================
    // SWIPE GESTURES (Touch y Mouse)
    // ============================================
    const interactiveSection = document.querySelector('.interactive-content');
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    
    if (interactiveSection) {
        // Touch events para móviles
        interactiveSection.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        interactiveSection.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // Mouse drag para desktop
        interactiveSection.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.pageX - interactiveSection.offsetLeft;
            scrollLeft = interactiveSection.scrollLeft;
            interactiveSection.style.cursor = 'grabbing';
        });
        
        interactiveSection.addEventListener('mouseleave', function() {
            isDragging = false;
            interactiveSection.style.cursor = 'default';
        });
        
        interactiveSection.addEventListener('mouseup', function() {
            isDragging = false;
            interactiveSection.style.cursor = 'default';
        });
        
        interactiveSection.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - interactiveSection.offsetLeft;
            const walk = (x - startX) * 2;
            interactiveSection.scrollLeft = scrollLeft - walk;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (document.querySelector('.interactive-section') && 
                document.querySelector('.interactive-section').getBoundingClientRect().top < window.innerHeight &&
                document.querySelector('.interactive-section').getBoundingClientRect().bottom > 0) {
                
                if (e.key === 'ArrowLeft') {
                    const activeTab = document.querySelector('.tab-button.active');
                    if (activeTab && activeTab.getAttribute('data-tab') === 'renovables') {
                        switchTab('mineria');
                    }
                } else if (e.key === 'ArrowRight') {
                    const activeTab = document.querySelector('.tab-button.active');
                    if (activeTab && activeTab.getAttribute('data-tab') === 'mineria') {
                        switchTab('renovables');
                    }
                }
            }
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe izquierda - mostrar renovables
                switchTab('renovables');
            } else {
                // Swipe derecha - mostrar minería
                switchTab('mineria');
            }
        }
    }
    
    // ============================================
    // CURSOR EFFECT (Optional - Modern Touch)
    // ============================================
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid #8B1538;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            display: none;
        `;
        document.body.appendChild(cursor);
        
        let cursorVisible = false;
        
        document.addEventListener('mousemove', (e) => {
            if (!cursorVisible) {
                cursor.style.display = 'block';
                cursorVisible = true;
            }
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Efecto hover en elementos interactivos
        const interactiveElements = document.querySelectorAll('a, button, .btn, .service-card, .value-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#A52A2A';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#8B1538';
            });
        });
    }

    // ============================================
    // LAZY LOADING IMAGES (si se añaden imágenes)
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // PERFORMANCE: Debounce para eventos de scroll
    // ============================================
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Aplicar debounce a funciones pesadas
    const debouncedUpdateActiveNav = debounce(updateActiveNavLink, 10);
    window.addEventListener('scroll', debouncedUpdateActiveNav);

    // ============================================
    // CONSOLE LOG (Solo para desarrollo)
    // ============================================
    console.log('%c🚀 Sumpetrol Landing Page', 'color: #f4a261; font-size: 20px; font-weight: bold;');
    console.log('%cDesarrollado con pasión para la industria energética y minera', 'color: #1e3a5f; font-size: 12px;');
});

// ============================================
// UTILITY: Scroll to Top (si se necesita)
// ============================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

    // ============================================
    // MODAL DE SERVICIOS
    // ============================================
    const serviceModal = document.getElementById('serviceModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalExtended = document.getElementById('modalExtended');
    
    // Información ampliada de cada servicio
    const servicesData = {
        'perforacion': {
            title: 'Perforación y Explotación',
            icon: 'fas fa-hammer',
            description: 'Técnicas avanzadas de perforación adaptadas a cada tipo de yacimiento mineral, optimizando la extracción y minimizando el impacto ambiental.',
            features: [
                'Perforación de precisión',
                'Análisis geológico avanzado',
                'Optimización de procesos',
                'Tecnología de última generación',
                'Monitoreo en tiempo real',
                'Minimización de impacto ambiental'
            ],
            extended: {
                title: 'Nuestro Enfoque en Perforación',
                content: 'Utilizamos equipos de perforación de última generación y técnicas avanzadas que nos permiten adaptarnos a diferentes tipos de yacimientos. Nuestro equipo de geólogos y especialistas en perforación trabajan en conjunto para optimizar cada proyecto, asegurando la máxima eficiencia y el menor impacto ambiental posible.'
            }
        },
        'gestion-hidrica': {
            title: 'Gestión de Recursos Hídricos',
            icon: 'fas fa-tint',
            description: 'Soluciones integrales para el manejo eficiente del agua en operaciones mineras, desde captación hasta tratamiento y reciclaje.',
            features: [
                'Sistemas de tratamiento',
                'Reciclaje de agua',
                'Gestión sostenible',
                'Análisis de calidad',
                'Optimización de consumo',
                'Cumplimiento normativo'
            ],
            extended: {
                title: 'Gestión Responsable del Agua',
                content: 'El agua es un recurso crítico en operaciones mineras. Desarrollamos sistemas integrales que incluyen captación, tratamiento, reciclaje y gestión responsable del recurso hídrico, cumpliendo con los más altos estándares ambientales y normativos.'
            }
        },
        'logistica': {
            title: 'Logística Especializada',
            icon: 'fas fa-truck',
            description: 'Cadena de suministro optimizada para equipos y materiales mineros, garantizando disponibilidad y eficiencia operativa.',
            features: [
                'Transporte especializado',
                'Almacenamiento estratégico',
                'Gestión de inventarios',
                'Coordinación de entregas',
                'Optimización de rutas',
                'Trazabilidad completa'
            ],
            extended: {
                title: 'Logística de Clase Mundial',
                content: 'Nuestra red logística está diseñada para garantizar la disponibilidad continua de equipos y materiales críticos. Trabajamos con proveedores estratégicos y gestionamos inventarios inteligentes que minimizan costos y maximizan la eficiencia operativa.'
            }
        },
        'mantenimiento': {
            title: 'Mantenimiento de Equipos',
            icon: 'fas fa-cogs',
            description: 'Programas de mantenimiento preventivo y correctivo para maximizar la productividad y vida útil de la maquinaria minera.',
            features: [
                'Mantenimiento predictivo',
                'Reparación especializada',
                'Optimización de costos',
                'Diagnóstico avanzado',
                'Repuestos garantizados',
                'Técnicos certificados'
            ],
            extended: {
                title: 'Mantenimiento Proactivo',
                content: 'Implementamos programas de mantenimiento basados en datos y análisis predictivo, permitiendo identificar y resolver problemas antes de que afecten la producción. Nuestro equipo de técnicos especializados garantiza el máximo tiempo de operación de los equipos.'
            }
        },
        'energia-solar': {
            title: 'Energía Solar',
            icon: 'fas fa-sun',
            description: 'Desarrollo e implementación de proyectos solares a escala industrial, desde diseño hasta operación y mantenimiento.',
            features: [
                'Parques solares',
                'Sistemas fotovoltaicos',
                'Integración energética',
                'Cubiertas solares',
                'Sistemas de almacenamiento',
                'Monitoreo y mantenimiento'
            ],
            extended: {
                title: 'Energía Solar para el Futuro',
                content: 'Desarrollamos proyectos solares completos que incluyen estudios de viabilidad, diseño personalizado, instalación de paneles de última generación, sistemas de almacenamiento y programas de mantenimiento. Nuestras soluciones se adaptan a empresas, bodegas, escuelas y proyectos industriales, generando energía limpia y reduciendo costos operativos significativamente.'
            }
        },
        'energia-eolica': {
            title: 'Energía Eólica',
            icon: 'fas fa-wind',
            description: 'Soluciones eólicas adaptadas a las necesidades energéticas de cada cliente, optimizando la generación y distribución.',
            features: [
                'Parques eólicos',
                'Análisis de viento',
                'Sistemas híbridos',
                'Aerogeneradores de última generación',
                'Estudios de viabilidad',
                'Integración a red'
            ],
            extended: {
                title: 'Viento como Fuente de Energía',
                content: 'Realizamos estudios detallados de recursos eólicos y diseñamos parques eólicos optimizados para cada ubicación. Nuestros proyectos incluyen la selección de aerogeneradores de última generación, sistemas de control inteligente y programas de mantenimiento preventivo para maximizar la generación energética.'
            }
        },
        'sistemas-hibridos': {
            title: 'Sistemas Híbridos',
            icon: 'fas fa-battery-full',
            description: 'Combinación optimizada de fuentes renovables para operaciones remotas, garantizando suministro continuo y eficiente.',
            features: [
                'Almacenamiento energético',
                'Micro-redes',
                'Gestión inteligente',
                'Sistemas solares + eólicos',
                'Baterías de litio',
                'Control automatizado'
            ],
            extended: {
                title: 'Sistemas Híbridos Inteligentes',
                content: 'Combinamos múltiples fuentes de energía renovable (solar, eólica, baterías) en sistemas híbridos inteligentes que garantizan suministro continuo las 24 horas. Nuestros sistemas de gestión energética optimizan automáticamente el uso de cada fuente según disponibilidad y demanda, ideal para operaciones remotas o instalaciones que requieren alta confiabilidad.'
            }
        },
        'eficiencia-energetica': {
            title: 'Eficiencia Energética',
            icon: 'fas fa-chart-line',
            description: 'Auditorías y mejoras para optimizar el consumo energético industrial, reduciendo costos y huella de carbono.',
            features: [
                'Auditorías energéticas',
                'Optimización de procesos',
                'Reducción de emisiones',
                'Iluminación LED',
                'Automatización energética',
                'Análisis de consumo'
            ],
            extended: {
                title: 'Optimización Energética Integral',
                content: 'Realizamos auditorías energéticas completas que identifican oportunidades de ahorro. Implementamos soluciones como iluminación LED de alta eficiencia, sistemas de automatización, optimización de procesos industriales y gestión inteligente de la energía, resultando en reducciones significativas de costos y emisiones de carbono.'
            }
        }
    };
    
    // Manejar clics en tarjetas de servicio
    const serviceCards = document.querySelectorAll('.service-card[data-service]');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            const serviceData = servicesData[serviceId];
            
            if (serviceData) {
                openModal(serviceData);
            }
        });
    });
    
    // Función para abrir el modal
    function openModal(data) {
        modalTitle.textContent = data.title;
        modalIcon.innerHTML = `<i class="${data.icon}"></i>`;
        modalDescription.textContent = data.description;
        
        // Limpiar y llenar características
        modalFeatures.innerHTML = '';
        data.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            modalFeatures.appendChild(li);
        });
        
        // Información ampliada
        modalExtended.innerHTML = '';
        if (data.extended) {
            const extendedDiv = document.createElement('div');
            extendedDiv.innerHTML = `
                <h4>${data.extended.title}</h4>
                <p>${data.extended.content}</p>
            `;
            modalExtended.appendChild(extendedDiv);
        }
        
        // Mostrar modal
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Cerrar modal
    function closeModal() {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners para cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (serviceModal) {
        const modalOverlay = serviceModal.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }
        
        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
}
