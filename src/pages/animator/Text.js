

class Text {
	constructor(ctx, text, fontSize, color) {
		this.ctx = ctx;
		this.text = text;
		this.fontSize = fontSize;
		this.color = color || '#000';
	}

	draw() {
		if (this.visible) {
			if (this.opacity !== undefined) {
				this.ctx.save();
				this.ctx.globalAlpha = this.opacity;
			}
			this.ctx.font = `${this.fontSize}px Impact`;
			this.ctx.fillStyle = this.color;
			this.ctx.textBaseline = 'top';
			this.ctx.fillText(this.text, this.x, this.y);
			if (this.opacity !== undefined) {
				this.ctx.restore();
			}
		}
	}
}

export default Text;
