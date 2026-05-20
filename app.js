/* ==========================================================================
   BUAP DEVS - MAIN JAVASCRIPT APPLICATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Menu & Scroll handlers
    const mainHeader = document.querySelector('.main-header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scrolled header background transition
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Active Section Scroll Spy
    function highlightActiveSection() {
        let scrollPosition = window.scrollY + 120;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Mobile Navigation Toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu on link click (mobile view)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Cursor Glow Follow Effect
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // 3. Cotizador / Smart Interactive Calculator Logic
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const estimatedPriceEl = document.getElementById('estimated-price');
    const summaryCategoryEl = document.getElementById('summary-category');
    const summaryTimeEl = document.getElementById('summary-time');
    const btnQuoteWhatsapp = document.getElementById('btn-quote-whatsapp');
    
    let activeCategory = 'automation'; // default

    // Tab switcher
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            
            // Remove active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active states
            btn.classList.add('active');
            const targetContent = document.getElementById(`calc-${target}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            activeCategory = target;
            
            // Update summary category label
            const labelMap = {
                'automation': 'Automatización',
                'web': 'Desarrollo Web',
                'mobile': 'Aplicación Móvil',
                'homework': 'Tarea / Trabajo Escolar',
                'tutoring': 'Clase / Tutoría'
            };
            summaryCategoryEl.textContent = labelMap[target] || target;
            
            calculatePrice();
        });
    });

    // Handle range slider updates
    const hoursSlider = document.getElementById('class-hours');
    const hoursValLabel = document.getElementById('hours-val');
    if (hoursSlider && hoursValLabel) {
        hoursSlider.addEventListener('input', (e) => {
            hoursValLabel.textContent = e.target.value;
            calculatePrice();
        });
    }

    // Helper to switch tabs from external links (e.g. Services grid CTAs)
    window.selectCalculatorTab = function(category) {
        const targetBtn = document.querySelector(`.tab-btn[data-target="${category}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    };

    // Calculate Price System
    function calculatePrice() {
        let price = 0;
        let timeEstimate = '7 - 10 días hábiles';
        let detailString = '';

        if (activeCategory === 'automation') {
            const selectType = document.getElementById('auto-type');
            const basePrice = parseFloat(selectType.options[selectType.selectedIndex].dataset.price);
            const typeName = selectType.options[selectType.selectedIndex].text;
            
            const selectedUrgency = document.querySelector('input[name="auto-urgency"]:checked');
            const multiplier = parseFloat(selectedUrgency.dataset.multiplier);
            
            price = basePrice * multiplier;
            timeEstimate = selectedUrgency.value === 'express' ? '3 - 5 días hábiles' : '7 - 10 días hábiles';
            detailString = `Automatización: ${typeName} | Urgencia: ${selectedUrgency.value === 'express' ? 'Express' : 'Estándar'}`;
            
        } else if (activeCategory === 'web') {
            const selectType = document.getElementById('web-type');
            const basePrice = parseFloat(selectType.options[selectType.selectedIndex].dataset.price);
            const typeName = selectType.options[selectType.selectedIndex].text;
            
            let extraFeaturesCost = 0;
            let extras = [];
            
            if (document.getElementById('web-seo').checked) {
                extraFeaturesCost += parseFloat(document.getElementById('web-seo').dataset.price);
                extras.push('SEO Avanzado');
            }
            if (document.getElementById('web-admin').checked) {
                extraFeaturesCost += parseFloat(document.getElementById('web-admin').dataset.price);
                extras.push('Panel Admin');
            }
            if (document.getElementById('web-domain').checked) {
                extraFeaturesCost += parseFloat(document.getElementById('web-domain').dataset.price);
                extras.push('Hosting + Dominio');
            }
            
            price = basePrice + extraFeaturesCost;
            
            // Time estimate based on web project type complexity
            const webTypeValue = selectType.value;
            if (webTypeValue === 'landing') timeEstimate = '4 - 6 días hábiles';
            else if (webTypeValue === 'pymes') timeEstimate = '10 - 15 días hábiles';
            else if (webTypeValue === 'ecommerce') timeEstimate = '15 - 25 días hábiles';
            else timeEstimate = 'A convenir según requisitos';
            
            detailString = `Sitio Web: ${typeName} | Extras: ${extras.length > 0 ? extras.join(', ') : 'Ninguno'}`;
            
        } else if (activeCategory === 'mobile') {
            const selectPlatform = document.getElementById('mobile-platform');
            const platformPrice = parseFloat(selectPlatform.options[selectPlatform.selectedIndex].dataset.price);
            const platformName = selectPlatform.options[selectPlatform.selectedIndex].text;
            
            const selectFeatures = document.getElementById('mobile-features');
            const featuresPrice = parseFloat(selectFeatures.options[selectFeatures.selectedIndex].dataset.price);
            const featuresName = selectFeatures.options[selectFeatures.selectedIndex].text;
            
            price = platformPrice + featuresPrice;
            timeEstimate = '15 - 35 días hábiles';
            detailString = `App Móvil: ${platformName} | Complejidad: ${featuresName}`;
            
        } else if (activeCategory === 'homework') {
            const selectLang = document.getElementById('hw-lang');
            const basePrice = parseFloat(selectLang.options[selectLang.selectedIndex].dataset.price);
            const langName = selectLang.options[selectLang.selectedIndex].text;
            
            const selectComplexity = document.getElementById('hw-complexity');
            const compMultiplier = parseFloat(selectComplexity.options[selectComplexity.selectedIndex].dataset.multiplier);
            const compName = selectComplexity.options[selectComplexity.selectedIndex].text;
            
            const selectedUrgency = document.querySelector('input[name="hw-urgency"]:checked');
            const urgencyMultiplier = parseFloat(selectedUrgency.dataset.multiplier);
            
            price = basePrice * compMultiplier * urgencyMultiplier;
            
            const urgencyValue = selectedUrgency.value;
            if (urgencyValue === 'urgent') timeEstimate = 'Menos de 24 - 48 horas';
            else if (urgencyValue === 'quick') timeEstimate = '2 - 4 días';
            else timeEstimate = '5 - 7 días';
            
            detailString = `Tarea: Lenguaje ${langName} | Dificultad: ${compName} | Entrega: ${selectedUrgency.parentNode.innerText.trim()}`;
            
        } else if (activeCategory === 'tutoring') {
            const selectTopic = document.getElementById('class-topic');
            const hourlyRate = parseFloat(selectTopic.options[selectTopic.selectedIndex].dataset.price);
            const topicName = selectTopic.options[selectTopic.selectedIndex].text;
            
            const hoursCount = parseInt(hoursSlider.value);
            
            const selectedMode = document.querySelector('input[name="class-mode"]:checked');
            const modeMultiplier = parseFloat(selectedMode.dataset.multiplier);
            
            price = hourlyRate * hoursCount * modeMultiplier;
            timeEstimate = 'Programado a tu horario';
            detailString = `Tutoría: ${topicName} | Cantidad: ${hoursCount} horas | Modo: ${selectedMode.value === 'individual' ? '1-a-1 Individual' : 'Grupal'}`;
        }

        // Format and render estimated price
        const formattedPrice = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
        estimatedPriceEl.textContent = formattedPrice;
        summaryTimeEl.textContent = timeEstimate;
        
        // Dynamically build and update WhatsApp link
        const baseWhatsappUrl = 'https://wa.me/522221234567'; // Change this to your business WhatsApp
        const whatsappText = `¡Hola! He cotizado un servicio en la web de BUAP Devs.
*Detalles de mi solicitud:*
- *Categoría:* ${summaryCategoryEl.textContent}
- *Opción:* ${detailString}
- *Tiempo estimado:* ${timeEstimate}
- *Presupuesto Aprox:* ${formattedPrice}

Me gustaría que un desarrollador de la BUAP revise los detalles de mi caso. ¡Muchas gracias!`;
        
        btnQuoteWhatsapp.href = `${baseWhatsappUrl}?text=${encodeURIComponent(whatsappText)}`;
    }

    // Attach listeners on all input changes in the calculator to recalculate live
    const calcInputs = document.querySelectorAll('.calc-controls-card input, .calc-controls-card select');
    calcInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    // Run initial calculation
    calculatePrice();


    // 4. Contact Form Submission handler & Modal
    const contactForm = document.getElementById('contactForm');
    const formNotification = document.getElementById('formNotification');
    const btnCloseNotification = document.getElementById('btn-close-notification');
    
    if (contactForm && formNotification) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Read form inputs just to compose a message if wanted
            const name = document.getElementById('client-name').value;
            const email = document.getElementById('client-email').value;
            const service = document.getElementById('service-select').options[document.getElementById('service-select').selectedIndex].text;
            const details = document.getElementById('project-details').value;
            const isBuap = document.getElementById('client-buap').checked;
            
            // Print a simulator log
            console.log(`Solicitud de ${name} (${email}) recibida. Servicio: ${service}. Descuento Lobo: ${isBuap ? 'Sí' : 'No'}. Detalles: ${details}`);
            
            // Show custom success popup modal
            formNotification.classList.add('active');
        });
    }

    // 4. Scroll Reveal Animation Logic
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Once it appears, we don't need to observe it anymore
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial check for elements and start observing
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        scrollObserver.observe(el);
    });

    if (btnCloseNotification) {
        btnCloseNotification.addEventListener('click', () => {
            formNotification.classList.remove('active');
            contactForm.reset();
        });
    }
});
