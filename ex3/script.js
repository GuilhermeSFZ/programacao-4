const gameArea = document.getElementById("game-area");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("start");
const timeElement = document.getElementById("time");

// Variáveis de controle (Globais)
let score = 0;
let time = 20; 
let timer = null;
let spawnInterval = null;
let gameActive = false;

startBtn.addEventListener("click", () => {
    if (gameActive) return;
    
    resetGame(); // Aqui o time será resetado para 20
    gameActive = true;
    startBtn.style.display = "none";

    // 1. Inicia o spawn de inimigos
    spawnInterval = setInterval(spawnEnemy, 800);

    // 2. ÚNICO Timer: Controla o visual e o fim do jogo
    timer = setInterval(() => {
        time--;
        timeElement.textContent = time;

        if (time <= 0) {
            endGame(); // Quando chegar a 0, encerra
        }
    }, 1000);
});


function endGame(){
    gameActive = false;
    clearInterval(timer);
    clearInterval(spawnInterval);    
    alert(`End Game! Score: ${score}`);
    startBtn.style.display = "block";
    startBtn.innerText = "RESTART";
}

function resetGame() {
    score = 0;
    time = 20; // Garanta que comece em 20 para bater com o planejado
    scoreElement.innerText = score;
    timeElement.textContent = time;

    const enemies = document.querySelectorAll(".enemy");
    enemies.forEach(en => en.remove());
}
function spawnEnemy() {
    if (!gameActive) return;

    // Criar inimigo (Requisito: createElement)
    const enemy = document.createElement("img");
    enemy.src = "img/mask_yami.png"; 
    enemy.classList.add("enemy");

    // Posições aleatórias (Requisito: Math.random)
    const maxX = gameArea.clientWidth - 80;
    const maxY = gameArea.clientHeight - 80;

    enemy.style.position = "absolute";
    enemy.style.left = Math.random() * maxX + "px";
    enemy.style.top = Math.random() * maxY + "px";

    // Evento de clique (Requisito: Feedback e Pontuação)
    enemy.onclick = (e) => {
        if (!gameActive) return;
        score++;
        scoreElement.innerText = score;
        
        // Função de sangue (Sprite Sheet)
        createBloodEffect(e.clientX, e.clientY); 
        
        enemy.remove(); // Requisito: remove()
    };

    gameArea.appendChild(enemy); // Requisito: appendChild()

    // Inimigo desaparece sozinho após 1.2s
    setTimeout(() => {
        if (enemy.parentNode) {
            enemy.remove();
        }
    }, 1200);
}

function createBloodEffect(x, y) {
    // Cria 5 gotas de sangue 
    for (let i = 0; i < 5; i++) {
        const drop = document.createElement("div");
        drop.classList.add("blood-drop");
        
        // Posiciona onde o mouse clicou
        drop.style.left = x + "px";
        drop.style.top = y + "px";
        
        // Adiciona um espalhamento aleatório lateral
        const drift = (Math.random() - 0.5) * 40;
        drop.style.setProperty('--drift', drift + 'px');

        document.body.appendChild(drop);

        // Remove do DOM após a animação do CSS acabar
        setTimeout(() => drop.remove(), 800);
    }
}
let lastTrailTime = 0;
document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 30) return;
    lastTrailTime = now;

    const trail = document.createElement("div");
    trail.className = "trail"; // rastro (requisito)
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 500);
});