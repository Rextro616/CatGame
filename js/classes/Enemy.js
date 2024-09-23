class Enemy {
    constructor(id, x, y, spdX, spdY, width, height) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.spdX = spdX;
        this.spdY = spdY;
        this.width = width;
        this.height = height;
        this.color = 'green';
    }
    updatePosition() {
        this.x += this.spdX;
        this.y += this.spdY;

        // Rebound off canvas edges
        if (this.x < 0 || this.x > canvas.width) {
            this.spdX = -this.spdX;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.spdY = -this.spdY;
        }
    }

    draw() {
        c.save();
        c.fillStyle = this.color;
        c.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        c.restore();
    }

    update(){
        this.updatePosition();
        this.draw();
    }
}