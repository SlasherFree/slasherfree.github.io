function navigate(page) {
    window.location.href = page;
}

const scratchOverlayImageSrc = 'images/UmbreProud-4x.png';

// Premios para las 16 casillas de Huesoperro


const prizes = [
    '1 Captura extra',
    '3 Capturas extra',
    '+3 Pociones',
    '1 Revivir',
    '+1 Masterball',
    '1 Captura extra',
    '+1 Masterball',
    '1 Revivir',
    '+1 Poción',
    '+3 Pociones',
    '1 Captura extra',
    '1 Captura extra',
    '+1 Masterball',
    '+2 Pociones',
    '+1 Masterball',
    '1 Revivir'
];


const prizeImages = [
    'images/ultraball-4x.png',
    'images/meisterball-4x.png',
    'images/pocion.jpg',
    'images/RIP-4x.png',
    'images/meisterball-4x.png',
    'images/ultraball-4x.png',
    'images/meisterball-4x.png',
    'images/RIP-4x.png',
    'images/pocion.jpg',
    'images/pocion.jpg',
    'images/ultraball-4x.png',
    'images/ultraball-4x.png',
    'images/meisterball-4x.png',
    'images/pocion.jpg',
    'images/meisterball-4x.png',
    'images/RIP-4x.png'
];

// Estado de las casillas: true = rascada (sin capa), false = sin rascar (con capa)
// Puedes cambiar estos valores para dejar casillas ya rascadas
const scratchedState = [
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false
];

// Inicializar el grid de rasca y gana
function initScratchCards() {
    const grid = document.getElementById('scratchGrid');
    grid.innerHTML = '';

    prizes.forEach((prize, index) => {
        const card = document.createElement('div');
        card.className = 'scratch-card';
        
        const content = document.createElement('div');
        content.className = 'scratch-content';

        if (prizeImages[index]) {
            const img = document.createElement('img');
            img.src = prizeImages[index];
            img.alt = prize;
            const size = prizeImages[index].includes('cruz.png') ? '70px' : '100px';
            img.style.maxWidth = size;
            img.style.maxHeight = size;
            img.style.marginBottom = '10px';
            content.appendChild(img);
        }

        const textDiv = document.createElement('div');
        textDiv.textContent = prize;
        content.appendChild(textDiv);

        const canvas = document.createElement('canvas');
        canvas.className = 'scratch-canvas';
        canvas.width = 140;
        canvas.height = 140;
        canvas.style.touchAction = 'none';
        
        card.appendChild(content);
        card.appendChild(canvas);
        grid.appendChild(card);

        // Inicializar la lógica de rasguño para este canvas
        // Pasar el estado (rascado o no) al inicializador
        initScratchCanvas(canvas, scratchedState[index]);
    });
}

// Función para inicializar el efecto de rasguño en cada canvas
function initScratchCanvas(canvas, isScratched = false) {
    const ctx = canvas.getContext('2d');

    // Si la casilla ya está rascada, no dibujamos la capa de rasguño
    if (isScratched) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    // Dibujar la capa de rasguño estilizada
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2b2b2b');
    gradient.addColorStop(1, '#484848');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Patrón de parche visual
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let i = 0; i < canvas.width; i += 12) {
        ctx.fillRect(i, 0, 4, canvas.height);
    }

    // Círculos ligeros
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 8; i < canvas.width; i += 16) {
        for (let j = 8; j < canvas.height; j += 16) {
            ctx.beginPath();
            ctx.arc(i, j, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Imagen de instrucción centrada en el área rascable
    const overlayImg = new Image();
    overlayImg.src = scratchOverlayImageSrc;
    const drawLogo = () => {
        const size = canvas.width * 0.55;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(overlayImg, x, y, size, size);
    };
    if (overlayImg.complete) {
        drawLogo();
    } else {
        overlayImg.onload = drawLogo;
    }

    let isScratching = false;

    function scratch(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        // Borrar círculos para simular rasguño
        ctx.clearRect(x - 21, y - 21, 42, 42);
    }

    function startScratching(e) {
        isScratching = true;
        scratch(e);
    }

    function stopScratching() {
        isScratching = false;
    }

    function moveScratching(e) {
        if (!isScratching) return;
        e.preventDefault();
        scratch(e);
    }

    // Eventos de mouse
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('mousemove', moveScratching);
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('mouseout', stopScratching);

    // Eventos de touch para dispositivos móviles
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startScratching(e);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        moveScratching(e);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopScratching();
    });
}

// Inicializar cuando carga la página
window.addEventListener('load', initScratchCards);
