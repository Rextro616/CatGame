class CollisionBlock {
  constructor({ position }) {
    this.position = position;
    this.width = 12;
    this.height = 12;
  }

  draw() {
    c.fillStyle = "green";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
  }
}
