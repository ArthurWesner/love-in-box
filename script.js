window.addEventListener('DOMContentLoaded', () => {
    const lid = document.querySelector('.lid-image');
    const balloonGreen = document.querySelector('.balloon-green');
    const balloonBeige = document.querySelector('.balloon-beige');
    const header = document.querySelector('.header');
    const description = document.querySelector('.description');
    const dataContainer = document.querySelector('.data-container');
    const container = document.querySelector('.container');
    const socialLinks = document.querySelector('.social-icons');

    // Esconde a barra de rolagem inicialmente
    document.body.style.overflow = 'hidden';

    if (lid) {
        lid.addEventListener('animationend', () => {
            if (balloonGreen) {
                balloonGreen.style.animation = 'balloonGreenRise 3s ease-in forwards';
            }
            if (balloonBeige) {
                balloonBeige.style.animation = 'balloonBeigeRise 3s ease-in forwards';
            }

            setTimeout(() => {
                if (balloonGreen) balloonGreen.style.opacity = 0;
                if (balloonBeige) balloonBeige.style.opacity = 0;

                setTimeout(() => {
                    if (container) {
                        container.style.transition = 'opacity 1s ease-out';
                        container.style.opacity = 0;
                        container.style.pointerEvents = 'none';

                        setTimeout(() => {
                            if (header) header.classList.add('show');
                            if (description) description.classList.add('show');
                            if (socialLinks) socialLinks.classList.add('show');

                            if (dataContainer) {
                                dataContainer.classList.add('show');
                                document.body.style.overflow = 'auto';
                            }
                        }, 1000);
                    }
                }, 2000);
            }, 3000);
        });
    }

    // Função para carregar os dados da API
    function carregarDados(data) {
        dataContainer.innerHTML = ''; // Limpa os dados existentes

        data.forEach(item => {
            const dataRectangle = document.createElement('div');
            dataRectangle.classList.add('data-rectangle');

            const imageUrl = ajustarUrlImagem(item.FOTO) || 'https://via.placeholder.com/200';
            const titulo = item.TITULO || 'Título não disponível';
            const texto = item.TEXTO ? item.TEXTO.replace(/\n/g, '<br>') : 'Descrição não disponível';
            const categoria = item.CATEGORIA || 'Sem categoria';

            dataRectangle.innerHTML = `
                <img src="${imageUrl}" alt="${titulo}" class="data-image">
                <div class="text-container">
                    <h3 class="data-title">${titulo}</h3>
                    <p class="data-text">${texto}</p>
                    <span class="data-category">${categoria}</span>
                </div>
            `;

            // Adiciona o evento de clique à imagem
            const imgElement = dataRectangle.querySelector('.data-image');
            imgElement.addEventListener('click', () => {
                exibirImagemExpandida(imageUrl, titulo);
            });

            dataContainer.appendChild(dataRectangle);
        });
    }

    // Função para exibir a imagem expandida
    function exibirImagemExpandida(imageUrl, altText) {
        let overlay = document.getElementById('image-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'image-overlay';
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="expanded-image-container">
                <img src="${imageUrl}" alt="${altText}" class="expanded-image">
                <button class="close-btn">&times;</button>
            </div>
        `;
        overlay.classList.add('active');

        const closeBtn = overlay.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    }

    // Função para ajustar URLs de imagens do Google Drive
    function ajustarUrlImagem(url) {
        if (!url || typeof url !== 'string') return '';
        if (url.includes('drive.google.com')) {
            const parts = url.split('/d/');
            if (parts.length > 1) {
                const fileId = parts[1].split('/')[0];
                return `https://drive.google.com/uc?export=view&id=${fileId}`;
            }
        }
        return url;
    }

    // Fazer requisição à API
    fetch('https://api.zerosheets.com/v1/ntu')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                carregarDados(data);
            } else {
                console.error('Os dados retornados não são uma lista:', data);
            }
        })
        .catch(error => console.error('Erro ao carregar os dados da API:', error));
});
