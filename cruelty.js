function navigate(page) {
    window.location.href = page;
}

// Premio para las 16 casillas
const prizes = [
    'Muere un Pokemon',
    'Pierdes 5 pociones',
    'No puedes usar repelente',
    'Pierdes 3 ultraballs',
    'Sin captura de ruta',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA',
    'PRUEBA'
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
        content.textContent = prize;
        
        const canvas = document.createElement('canvas');
        canvas.className = 'scratch-canvas';
        canvas.width = 80;
        canvas.height = 80;
        canvas.style.touchAction = 'none';
        
        card.appendChild(content);
        card.appendChild(canvas);
        grid.appendChild(card);

        // Inicializar la lógica de rasguño para este canvas
        initScratchCanvas(canvas);
    });
}

// Función para inicializar el efecto de rasguño en cada canvas
function initScratchCanvas(canvas) {
    const ctx = canvas.getContext('2d');

    // Dibujar la capa de rasguño
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Agregar patrón
    ctx.fillStyle = '#444444';
    for (let i = 0; i < canvas.width; i += 8) {
        for (let j = 0; j < canvas.height; j += 8) {
            if ((i / 8 + j / 8) % 2 === 0) {
                ctx.fillRect(i, j, 8, 8);
            }
        }
    }

    // Texto indicador
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASCA', canvas.width / 2, canvas.height / 2 - 5);
    ctx.fillText('AQUÍ', canvas.width / 2, canvas.height / 2 + 5);

    let isScratching = false;

    function scratch(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        // Borrar círculos para simular rasguño
        ctx.clearRect(x - 12, y - 12, 24, 24);
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
