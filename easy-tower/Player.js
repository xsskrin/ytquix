

const PLAYER_ACC_X = .1;
const PLAYER_MAX_SPEED_X = 12;

class Player {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.dirX = 1;
		this.speedX = 0;
		this.speedY = 3;
		this.accX = 0;
		this.accY = 0;
		this.width = 54;
		this.height = 64;

		this.rotating = false;
		this.angle = 0;
	}

	update() {
		this.prevY = this.y;

		if (this.ground) {
			if (this.game.pressed.w) {
				this.accY = -3 - Math.abs(this.accX);
				if (Math.abs(this.accX) > 1) {
					this.rotating = true;
				}
			} else {
				this.angle = 0;
				this.rotating = false;
			}
		}

		if (this.game.pressed.a) {
			this.dirX = -1;
			this.accX += -PLAYER_ACC_X;
			if (this.speedX > 0) {
				this.speedX = 0;
			}
			if (this.accX < -3) {
				this.accX = -3;
			} else if (this.accX > 0) {
				this.accX = 0;
			}
		} else if (this.game.pressed.d) {
			this.dirX = 1;
			this.accX += PLAYER_ACC_X;
			if (this.speedX < 0) {
				this.speedX = 0;
			}
			if (this.accX > 3) {
				this.accX = 3;
			} else if (this.accX < 0) {
				this.accX = 0;
			}
		}

		if (this.rotating) {
			this.angle += Math.PI / 18;
		}

		if (this.onPlatform) {
			this.x += this.ground.dx;
		}

		this.ground = false;
		this.onPlatform = false;

		this.speedY += this.accY;
		if (this.speedY > 20) {
			this.speedY = 20;
		} else if (this.speedY < -20) {
			this.speedY = -20;
		}
		this.accY += .3;
		this.y += this.speedY;

		this.speedX += this.accX;
		if (this.speedX > PLAYER_MAX_SPEED_X) {
			this.speedX = PLAYER_MAX_SPEED_X;
		} else if (this.speedX < -PLAYER_MAX_SPEED_X) {
			this.speedX = -PLAYER_MAX_SPEED_X;
		}

		this.x += this.speedX;

		if (this.y >= this.game.H - this.height) {
			this.y = this.game.H - this.height;
			this.setGround(true);
		}

		if (this.x + this.width > this.game.W) {
			this.x = this.game.W - this.width;
			this.accX = 0;
		} else if (this.x < 0) {
			this.x = 0;
			this.accX = 0;
		}

		if (!this.game.pressed.a && !this.game.pressed.d) {
		   this.accX = 0;
		   this.speedX = 0;
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
				this.setGround(p, true);
			}
		});
	}

	setGround(ground, isPlatform) {
		this.ground = ground;
		this.onPlatform = isPlatform;
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
		c.rotate(this.angle);

		c.drawImage(
			this.game.assets.hero,
			-this.width / 2, -this.height / 2,
			this.width, this.height,
		);

		c.restore();
	}
}

export default Player;
