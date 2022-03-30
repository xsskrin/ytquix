

class Text {
	constructor(ctx, text, fontSize) {
		this.ctx = ctx;
		this.text = text;
		this.fontSize = fontSize;
	}

	draw() {
		if (this.visible) {
			this.ctx.font = `${this.fontSize}px Impact`;
			this.ctx.fillStyle = '#000';
			this.ctx.textBaseline = 'top';
			this.ctx.fillText(this.text, this.x, this.y);
		}
	}
}

export default Text;
