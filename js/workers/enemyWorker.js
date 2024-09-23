let enemyId = 0;

function randomlyGenerateEnemy() {
    const x = Math.random() * 1024; 
    const y = Math.random() * 576;  
    const spdX = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1); // Velocidad aleatoria
    const spdY = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1);
    const width = 20;
    const height = 20;

    return { id: enemyId++, x, y, spdX, spdY, width, height, color: 'red' };
}

setInterval(() => {
    const enemy = randomlyGenerateEnemy();
    postMessage({ type: 'newEnemy', enemy });
}, 2000); 
