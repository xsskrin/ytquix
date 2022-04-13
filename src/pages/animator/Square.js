

class Square {
	constructor(ctx, x, y, color) {
		this.ctx = ctx;
		this.startX = x;
		this.startY = y;
		this.color = color;
	}

	update = (p) => {
		if (p > 0) {
			this.size = 20 + p * 40;
			this.y = this.startY;
		} else {
			this.size = 0;
		}
	}

	fall = (p) => {
		if (p > 0) {
			this.y = this.startY + 300 * p;
			this.size = 60 - p * 60;
		}
	}

	draw() {
		if (this.visible) {
			this.ctx.fillStyle = this.color;
			if (this.rotation) {
				this.ctx.save();
				this.ctx.translate(
					this.x + this.size / 2,
					this.y + this.size / 2,
				);
				this.ctx.rotate(this.rotation);
				this.ctx.translate(
					-this.x - this.size / 2,
					-this.y - this.size / 2,
				);
			}
			this.ctx.fillRect(
				this.x,
				this.y,
				this.size,
				this.size,
			);
			if (this.rotation) {
				this.ctx.restore();
			}
		}
	}
}

export default Square;
