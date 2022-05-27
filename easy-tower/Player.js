

class Player {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.dirX = 1;
		this.speedX = 0;
		this.speedY = 3;
		this.accY = .5;
		this.width = 54;
		this.height = 64;
	}

	update() {
		this.prevY = this.y;

		if (this.ground && this.game.pressed.w) {
			this.accY = -3;
		}

		this.ground = false;

		this.speedY += this.accY;
		this.accY += .3;
		this.y += this.speedY;

		this.x += this.speedX;

		if (this.y >= this.game.H - this.height) {
			this.y = this.game.H - this.height;
			this.setGround(true);
		}

		if (this.game.pressed.a) {
			this.speedX = -4;
			this.dirX = -1;
		} else if (this.game.pressed.d) {
			this.speedX = 4;
			this.dirX = 1;
		} else {
			this.speedX = 0;
		}

		if (this.x + this.width > this.game.W) {
			this.x = this.game.W - this.width;
		} else if (this.x < 0) {
			this.x = 0;
		}
	}

	checkCollisions() {
		this.game.platforms.forEach((p) => {
			if (
				this.x + this.width > p.x
				&& this.x < p.x + p.width
				&& this.prevY + this.height <= p.prevY
				&& this.y + this.height >= p.y
			) {
				this.y = p.y - this.height;
				this.setGround(p);
			}
		});
	}

	setGround(ground) {
		this.ground = ground;
		this.speedY = 0;
		this.accY = 0;
	}

	draw() {
		// this.game.ctx.fillRect(
		// 	this.x, this.y, this.width, this.height
		// );

		const c = this.game.ctx;

		c.save();

		c.translate(
			this.x + this.width / 2,
			this.y + this.height / 2,
		);

		c.scale(this.dirX, 1);

		c.drawImage(
			this.game.assets.hero,
			-this.width / 2, -this.height / 2,
			this.width, this.height,
		);

		c.restore();
	}
}

export default Player;
