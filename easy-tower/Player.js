

class Player {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.speedX = 0;
		this.speedY = 3;
		this.accY = .5;
		this.size = 40;
	}

	update() {
		this.prevY = this.y;

		this.y += this.speedY;
		this.speedY += this.accY;
		this.accY += .3;

		this.x += this.speedX;

		if (this.y > this.game.H - this.size) {
			this.y = this.game.H - this.size;
			this.speedY = 0;
			this.accY = 0;
		}

		if (this.game.pressed.w && this.speedY === 0) {
			this.accY = -4;
		}
		if (this.game.pressed.a) {
			this.speedX = -4;
		} else if (this.game.pressed.d) {
			this.speedX = 4;
		} else {
			this.speedX = 0;
		}

		if (this.x + this.size > this.game.W) {
			this.x = this.game.W - this.size;
		} else if (this.x < 0) {
			this.x = 0;
		}
	}

	checkCollisions() {
		const p = this.game.platform;
		if (
			this.x + this.size > p.x
			&& this.x < p.x + p.width
			&& this.prevY + this.size <= p.prevY
			&& this.y + this.size >= p.y
		) {
			this.y = p.y - this.size;
			this.speedY = 0;
			this.accY = 0;
		}
	}

	draw() {
		this.game.ctx.fillRect(
			this.x, this.y, this.size, this.size
		);
	}
}

export default Player;
