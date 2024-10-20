const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let canvasScale = 2.5;
let isGameOver = false;

const scaledCanvas = {
  width: canvas.width / canvasScale,
  height: canvas.height / canvasScale,
};

const pixelsWidth = 48;

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += pixelsWidth) {
  floorCollisions2D.push(floorCollisions.slice(i, i + pixelsWidth));
}
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 2569) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 12,
            y: y * 12,
          },
        })
      );
    }
  });
});
const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += pixelsWidth) {
  platformCollisions2D.push(platformCollisions.slice(i, i + pixelsWidth));
}

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 2569) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 12,
            y: y * 12,
          },
        })
      );
    }
  });
});

const gravity = 0.1;

const keys = {
  w: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      keys.w.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }
});

const player = new Player({
  position: {
    x: 200,
    y: 300,
  },
  animationKey: "Idle",
  collisionBlocks: collisionBlocks,
  platformCollisionBlocks: platformCollisionBlocks,
  imageSrc: "./img/Cat/Idle2Catd.png",
  frameRate: 14,
  animations: {
    Idle: {
      imageSrc: "./img/Cat/Idle2Catd.png",
      frameRate: 14,
      frameBuffer: 9,
    },
    Run: {
      imageSrc: "./img/Cat/RunCatd.png",
      frameRate: 7,
      frameBuffer: 9,
    },
    Jump: {
      imageSrc: "./img/Cat/JumpCatd.png",
      frameRate: 13,
      frameBuffer: 9,
    },
    Die: {
      imageSrc: "./img/Cat/Die2Catd.png",
      frameRate: 14,
      frameBuffer: 9,
    },
    Hurt: {
      imageSrc: "./img/Cat/HurtCatd.png",
      frameRate: 7,
      frameBuffer: 9,
    },
  },
});

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/map.png",
});

const backgroundImageHeight = 432;
const backgroundImageWidth = 576;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

const lifeCounterWorker = new Worker("./js/workers/lifeCounterWorker.js");

lifeCounterWorker.onmessage = (event) => {
  const { type, lives } = event.data;

  if (type === "livesUpdated") {
    document.getElementById("lifes").innerText = `Vida restante: ${lives}`;
  } else if (type === "gameOver") {
    player.switchSprite("Die");
    isGameOver = true;
  }
};

// Función para disminuir las vidas
function decreaseLife() {
  lifeCounterWorker.postMessage({ type: "decreaseLife" });
  if (!(player.animationKey === "Die")) {
    player.switchSprite("Hurt");
  }
}

// Función para obtener las vidas actuales
function getLives() {
  lifeCounterWorker.postMessage({ type: "getLives" });
}

const worker = new Worker("./js/workers/timerWorker.js");

worker.onmessage = function (event) {
  document.getElementById("timer").innerText = `${event.data}`;
};

const enemies = []; // Almacena los enemigos

const enemyWorker = new Worker("./js/workers/enemyWorker.js");

enemyWorker.onmessage = function (event) {
  const { type, enemy } = event.data;
  if (type === "newEnemy") {
    enemies.push(
      new Enemy(
        enemy.id,
        enemy.x,
        enemy.y,
        enemy.spdX,
        enemy.spdY,
        enemy.width,
        enemy.height,
        enemy.color
      )
    );
  }
};

function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.update();
  });
}

let lastTime = 0;

function animate(time) {
  if (isGameOver) {
    canvasScale += 0.01;

    camera.position.x =
      scaledCanvas.width - player.position.x - backgroundImageWidth / 2;

    camera.position.y =
      scaledCanvas.height - player.position.y - backgroundImageHeight / 2;

    if (player.currentFrame == 13) {
      worker.postMessage("stop");
      return;
    }
  }
  // Calcula el tiempo transcurrido desde el último frame
  const deltaTime = (time - lastTime) / 1000; // Convierte de ms a segundos
  lastTime = time;

  window.requestAnimationFrame(animate);

  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(canvasScale, canvasScale);
  c.translate(camera.position.x, camera.position.y);

  background.update();
  player.checkForHorizontalCanvasCollision();
  player.update();

  enemyCollision();

  player.velocity.x = 0;

  const playerSpeed = 100;

  if (keys.d.pressed) {
    if (!(player.animationKey === "Die")) {
      if (!(player.animationKey === "Hurt" && player.currentFrame !== 6)) {
        player.switchSprite("Run");
      }
    }

    player.velocity.x = playerSpeed * deltaTime;
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    if (!(player.animationKey === "Die")) {
      if (!(player.animationKey === "Hurt" && player.currentFrame !== 6)) {
        player.switchSprite("Run");
      }
    }

    player.velocity.x = -playerSpeed * deltaTime;
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.y === 0) {
    if (!(player.animationKey === "Die")) {
      if (!(player.animationKey === "Hurt" && player.currentFrame !== 6)) {
        player.switchSprite("Idle");
      }
    }
  }

  if (keys.w.pressed && player.velocity.y === 0) {
    player.velocity.y = -240 * deltaTime; // Ajusta la velocidad de salto
    player.shouldPanCameraUp({ canvas, camera });
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ canvas, camera });
    if (!keys.a.pressed && !keys.d.pressed) {
      if (!(player.animationKey === "Die")) {
        if (!(player.animationKey === "Hurt" && player.currentFrame !== 6)) {
          player.switchSprite("Jump");
        }
      }
    }
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ canvas, camera });
  }

  updateEnemies();
  c.restore();
}

getLives();
worker.postMessage("start");
animate();
