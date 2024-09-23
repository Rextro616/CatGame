let lives = 100; 

self.addEventListener('message', (event) => {
  const { type } = event.data;

  if (type === 'decreaseLife') {
    lives--;
    if (lives <= 0) {
      self.postMessage({ type: 'gameOver' });
    } 
    self.postMessage({ type: 'livesUpdated', lives });
  }

  if (type === 'getLives') {
    self.postMessage({ type: 'livesUpdated', lives });
  }
});
