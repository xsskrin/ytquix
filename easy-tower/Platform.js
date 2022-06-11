

class Platform {
	constructor(game, x, y, width, height) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speedX = 3;
	}

	update() {
		this.prevX = this.x;
		this.prevY = this.y;

		// this.x += this.speedX;
		// if (this.x > this.game.W - this.width) {
		// 	this.x = this.game.W - this.width;
		// 	this.speedX *= -1;
		// } else if (this.x < 0) {
		// 	this.x = 0;
		// 	this.speedX *= -1;
		// }

		this.dx = this.x - this.prevX;
	}

	draw() {
		this.game.ctx.drawImage(
			this.game.assets.platform,
			this.x, this.y - 8, this.width, this.height,
		)
	}
}

export default Platform;
