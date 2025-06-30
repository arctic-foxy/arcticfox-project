document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentSlide = 0;
    const totalSlides = slides ? slides.length : 0;

    // Função para mostrar o slide específico
    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlide = 0; // Volta para o primeiro slide
        } else if (index < 0) {
            currentSlide = totalSlides - 1; // Vai para o último slide
        } else {
            currentSlide = index;
        }
        // Verifica se carouselContainer existe antes de tentar manipulá-lo
        if (carouselContainer) {
            carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        updateDots();
    }

    // Função para avançar o slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Função para retroceder o slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Cria os pontos de navegação dinamicamente
    function createDots() {
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.dataset.slideIndex = i;
                dot.addEventListener('click', () => showSlide(i));
                dotsContainer.appendChild(dot);
            }
            updateDots();
        } else {
        }
    }

    // Atualiza o estado dos pontos (qual está ativo)
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Adiciona event listeners aos botões do carrossel
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    if (carouselContainer && slides.length > 0 && dotsContainer) {
        createDots();
        showSlide(0); // Garante que o primeiro slide seja mostrado ao carregar
    }

    //funcionalidade para vídeos de review
    const mediaContainers = document.querySelectorAll('.media-container');

    mediaContainers.forEach(container => {
        const video = container.querySelector('.review-video');
        const image = container.querySelector('.review-image');
        if (video && video.tagName === 'VIDEO') { 
            let playOverlay = container.querySelector('.play-overlay');
            if (!playOverlay) {
                playOverlay = document.createElement('div');
                playOverlay.classList.add('play-overlay');
                container.appendChild(playOverlay);
                playOverlay.addEventListener('click', () => {
                    video.play().then(() => {
                        container.classList.remove('autoplay-blocked');
                        playOverlay.style.opacity = 0;
                        playOverlay.style.pointerEvents = 'none'; 
                    }).catch(err => {
                        console.error('Manual play failed:', err);
                    });
                });
            }

            container.addEventListener('mouseenter', () => {
                video.play().then(() => {
                    container.classList.remove('autoplay-blocked');
                    playOverlay.style.opacity = 0;
                    playOverlay.style.pointerEvents = 'none';
                }).catch(error => {
                    container.classList.add('autoplay-blocked');
                    playOverlay.style.opacity = 1;
                    playOverlay.style.pointerEvents = 'auto';
                });
            });

            container.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;

                container.classList.remove('autoplay-blocked');
                playOverlay.style.opacity = 0;
                playOverlay.style.pointerEvents = 'none';
            });
        }
    });
    const originalModeBtn = document.getElementById('originalModeBtn');
    const lightModeBtn = document.getElementById('lightModeBtn');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const body = document.body; // Referência ao <body>

    const MODE_KEY = 'websiteMode';
    // Função para aplicar o modo
    function applyMode(mode) {
        body.classList.remove('original-mode', 'light-mode', 'dark-mode');
        body.classList.add(mode);
        localStorage.setItem(MODE_KEY, mode); // Salva a preferência no localStorage
        updateActiveButton(mode); // Atualiza qual botão está ativo
    }

    // Função para atualizar o botão ativo
    function updateActiveButton(currentMode) {
        // Verifica se os botões existem antes de tentar manipulá-los
        if (originalModeBtn) originalModeBtn.classList.remove('active-mode');
        if (lightModeBtn) lightModeBtn.classList.remove('active-mode');
        if (darkModeBtn) darkModeBtn.classList.remove('active-mode');

        // Adiciona a classe 'active-mode' ao botão correspondente
        if (currentMode === 'original-mode' && originalModeBtn) {
            originalModeBtn.classList.add('active-mode');
        } else if (currentMode === 'light-mode' && lightModeBtn) {
            lightModeBtn.classList.add('active-mode');
        } else if (currentMode === 'dark-mode' && darkModeBtn) {
            darkModeBtn.classList.add('active-mode');
        }
    }

    // Adicionar listeners aos botões de modo (verificando se existem)
    if (originalModeBtn) {
        originalModeBtn.addEventListener('click', () => applyMode('original-mode'));
    }
    if (lightModeBtn) {
        lightModeBtn.addEventListener('click', () => applyMode('light-mode'));
    }
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => applyMode('dark-mode'));
    }

    // Carregar a preferência do usuário ao iniciar a página
    const savedMode = localStorage.getItem(MODE_KEY);
    if (savedMode) {
        applyMode(savedMode); // Aplica o modo salvo
    } else {
        applyMode('original-mode');
    }
});
    // --- Nova funcionalidade: Formulário de Contato com Validação ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) { // Garante que o formulário existe na página atual
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');

        function validateEmail(email) {
            // Expressão regular para validar e-mails
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }

        function showError(element, message, errorElement) {
            errorElement.textContent = message;
            element.closest('.form-group').classList.add('error'); // Adiciona classe 'error' ao grupo
        }

        function clearError(element, errorElement) {
            errorElement.textContent = '';
            element.closest('.form-group').classList.remove('error'); // Remove classe 'error'
        }

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let isValid = true; // Flag para verificar se todos os campos são válidos

            // Validação do Nome
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Por favor, digite seu nome.', nameError);
                isValid = false;
            } else {
                clearError(nameInput, nameError);
            }

            // Validação do E-mail
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Por favor, digite seu e-mail.', emailError);
                isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                showError(emailInput, 'Por favor, digite um e-mail válido.', emailError);
                isValid = false;
            } else {
                clearError(emailInput, emailError);
            }

            // Validação do Assunto
            if (subjectInput.value.trim() === '') {
                showError(subjectInput, 'Por favor, digite o assunto.', subjectError);
                isValid = false;
            } else {
                clearError(subjectInput, subjectError);
            }

            // Validação da Mensagem
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Por favor, digite sua mensagem.', messageError);
                isValid = false;
            } else {
                clearError(messageInput, messageError);
            }

            // Se todos os campos forem válidos, simula o envio
            if (isValid) {
                alert('Mensagem enviada com sucesso! (Funcionalidade de envio real desativada para demonstração)');
                contactForm.reset(); // Limpa o formulário
                // Em um projeto real, aqui você enviaria os dados para um servidor
            }
        });

        // Opcional: Limpar erros enquanto o usuário digita
        nameInput.addEventListener('input', () => clearError(nameInput, nameError));
        emailInput.addEventListener('input', () => clearError(emailInput, emailError));
        subjectInput.addEventListener('input', () => clearError(subjectInput, subjectError));
        messageInput.addEventListener('input', () => clearError(messageInput, messageError));
    };