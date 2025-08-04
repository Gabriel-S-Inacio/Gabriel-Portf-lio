// --- Rolagem suave para os links internos ---
function ativarRolagemSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                // Ajusta o scroll para que o cabeçalho não cubra a seção
                const offsetTop = destino.offsetTop - document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- Efeito de aparecer ao rolar (Intersection Observer) ---
function observarElementos() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                entry.target.classList.remove('oculto'); // Garante que a classe 'oculto' seja removida
                observer.unobserve(entry.target); // Deixa de observar o elemento após ele ficar visível
            }
        });
    }, { threshold: 0.2 }); // Ajuste o threshold para quando o elemento deve aparecer (20% visível)

    // Seleciona todos os elementos que devem ter a animação
    document.querySelectorAll('section, .card, .intro, section h2').forEach(el => {
        el.classList.add('oculto'); // Garante que eles comecem invisíveis
        observer.observe(el);
    });
}

// --- Boas-Vindas personalizadas ---
function exibirBoasVindas() {
    const nomeSalvo = localStorage.getItem("visitanteNome");
    const saudacaoMensagemEl = document.getElementById("saudacaoMensagem");

    if (saudacaoMensagemEl) { // Garante que o elemento existe
        if (!nomeSalvo) {
            
        } else {
            saudacaoMensagemEl.textContent = `${nomeSalvo}! Agradeço a sua visita ao meu portfólio!`;
            // Tambem pode-se adicionar um timer para a mensagem sumir após alguns segundos.
             setTimeout(() => {
                 saudacaoMensagemEl.style.opacity = '0';
                 setTimeout(() => saudacaoMensagemEl.style.display = 'none', 500);
             }, 5000); // Some após 5 segundos
        }
    }
}

// --- Lógica para o Modal da Imagem de Perfil ---
function configurarModalFoto() {
    const foto = document.getElementById("fotoPerfil");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.getElementById("closeModal");

    if (foto && modal && modalImg && closeBtn) { // Verifica se todos os elementos existem
        foto.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = foto.src;
            modalImg.alt = foto.alt; // Copia o alt text para o modal
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        // Fechar modal com a tecla ESC para acessibilidade
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
}

// --- Lógica para Alternar Tema (Dark/Light Mode) ---
function configurarToggleTema() {
    const toggleTemaBtn = document.getElementById('toggleTema');
    const body = document.body;

    // Função para aplicar o tema
    function aplicarTema(tema) {
        if (tema === 'light') {
            body.classList.add('light-mode');
            toggleTemaBtn.textContent = 'Modo Escuro'; // Altera o texto do botão
        } else {
            body.classList.remove('light-mode');
            toggleTemaBtn.textContent = 'Modo Claro'; // Altera o texto do botão
        }
        localStorage.setItem('temaPreferido', tema); // Salva a preferência
    }

    // Carregar tema preferido ao carregar a página
    const temaSalvo = localStorage.getItem('temaPreferido');
    if (temaSalvo) {
        aplicarTema(temaSalvo);
    } else {
        // Se não houver tema salvo, define um padrão (ex: dark)
        aplicarTema('dark');
    }

    // Adicionar listener ao botão
    if (toggleTemaBtn) {
        toggleTemaBtn.addEventListener('click', () => {
            const temaAtual = body.classList.contains('light-mode') ? 'light' : 'dark';
            aplicarTema(temaAtual === 'dark' ? 'light' : 'dark'); // Alterna o tema
        });
    }
}

// --- Inicialização de todas as funcionalidades quando o DOM estiver carregado ---
document.addEventListener("DOMContentLoaded", function () {
    ativarRolagemSuave();
    observarElementos();
    configurarModalFoto();
    configurarToggleTema();
    exibirBoasVindas();

    // Opcional: Para uma primeira visita, perguntar o nome (se ainda quiser)
    const nomeSalvo = localStorage.getItem("visitanteNome");
    if (!nomeSalvo) {
        const nome = prompt("Olá! Qual seu nome?");
        if (nome) {
            localStorage.setItem("visitanteNome", nome);
            alert(`Bem-vindo(a), ${nome}! Explore meu portfólio :)`);
            exibirBoasVindas(); // Atualiza a mensagem na tela após o prompt
        }
    }
});

// --- Lógica para Cards Flutuantes ---
function configurarFloatingCards() {
    const leftCard = document.querySelector('.left-card');
    const rightCard = document.querySelector('.right-card');
    const closeButtons = document.querySelectorAll('.close-card');

    // Função para mostrar um card
    function showCard(cardElement) {
        if (cardElement) {
            cardElement.classList.add('is-active');
            // Opcional: Salvar no localStorage que o card está visível, se quiser que ele permaneça visível
            // localStorage.setItem(cardElement.id + 'Visible', 'true');
        }
    }

    // Função para esconder um card
    function hideCard(cardElement) {
        if (cardElement) {
            cardElement.classList.remove('is-active');
            // Opcional: Salvar no localStorage que o card foi fechado, para não reaparecer na mesma sessão
            localStorage.setItem(cardElement.dataset.card + 'Closed', 'true');
        }
    }

    // Adiciona event listeners aos botões de fechar
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cardToCloseClass = button.dataset.card; // Pega 'left-card' ou 'right-card'
            const cardToClose = document.querySelector(`.${cardToCloseClass}`);
            hideCard(cardToClose);
        });
    });

    // Lógica para mostrar os cards apenas em telas grandes
    function checkAndToggleCardsVisibility() {
        if (window.innerWidth > 1200) {
            // Verifica se o card não foi fechado previamente nesta sessão
            if (leftCard && !localStorage.getItem('left-cardClosed')) {
                showCard(leftCard);
            }
            if (rightCard && !localStorage.getItem('right-cardClosed')) {
                showCard(rightCard);
            }
        } else {
            // Esconde os cards em telas pequenas (o CSS já faz isso com display: none!important)
            if (leftCard) {
                leftCard.classList.remove('is-active');
            }
            if (rightCard) {
                rightCard.classList.remove('is-active');
            }
        }
    }

    // Chama a função ao carregar a página
    checkAndToggleCardsVisibility();

    // Chama a função sempre que a janela for redimensionada
    window.addEventListener('resize', checkAndToggleCardsVisibility);

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const footer = document.querySelector('footer');
         if (footer && scrollPosition > footer.offsetTop + 50) { // 50px antes do rodapé
             if (leftCard) hideCard(leftCard);
             if (rightCard) hideCard(rightCard);
        } else {
            
          //  checkAndToggleCardsVisibility(); //
        }
     });

    // --- Sumir ao rolar para o rodapé ---
    // Os cards sumam quando o usuário rolar para o final da página,
    // ou apareçam/sumam em pontos específicos do scroll, necessário adicionar mais lógica aqui.
    // Exemplo: Sumir ao rolar para o rodapé
    // window.addEventListener('scroll', () => {
    //     const scrollPosition = window.scrollY + window.innerHeight;
    //     const footer = document.querySelector('footer');
    //     if (footer && scrollPosition > footer.offsetTop + 50) { // 50px antes do rodapé
    //         if (leftCard) hideCard(leftCard);
    //         if (rightCard) hideCard(rightCard);
    //     } else {
    //         // Se rolar para cima, eles voltam a aparecer (se não foram fechados manualmente)
    //         checkAndToggleCardsVisibility(); // Reativa a visibilidade se as condições de tela e fechamento permitirem
    //     }
    // });
}

// --- Chamada no DOMContentLoaded (já existe neste script.js) ---
document.addEventListener("DOMContentLoaded", function () {
    // ... outras chamadas de função ...
    configurarFloatingCards(); // <--- ADICIONE ESTA LINHA
});