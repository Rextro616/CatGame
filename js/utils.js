function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

function platformCollision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y + object1.height <=
      object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

function enemyCollision() {
  enemies.forEach((enemy) => {
    if (
      player.position.x < enemy.x + enemy.width &&
      player.position.x + player.width > enemy.x &&
      player.position.y < enemy.y + enemy.height &&
      player.position.y + player.height > enemy.y
    ) {
      console.log(`Colisión detectada con enemigo ID: ${enemy.id}`);
      if (!(player.animationKey === "Die")) {
        player.switchSprite("Hurt");
      }

      decreaseLife();
    }
  });
}
