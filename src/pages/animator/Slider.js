

class Slider {
	constructor() {
		this.width = 300;
		this.sideOffset = 20;

		this.el = document.createElement('div');
		this.el.className = 'ca-slider';

		this.handle = document.createElement('div');
		this.handle.className = 'ca-handle';

		this.el.appendChild(this.handle);

		this.el.addEventListener('mousedown', this.onSliderMouseDown);
	}

	onSliderMouseDown = (e) => {
		const p = this.calcPFromMouseX(e.clientX);
		this.onUpdate(p);
		this.positionHandle(p);

		document.body.addEventListener('mousemove', this.onMouseMove);
		document.body.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseMove = (e) => {
		const p = this.calcPFromMouseX(e.clientX);
		this.onUpdate(p);
		this.positionHandle(p);
	}

	onMouseUp = (e) => {
		document.body.removeEventListener('mousemove', this.onMouseMove);
		document.body.removeEventListener('mouseup', this.onMouseUp);
	}

	calcPFromMouseX(mouseX) {
		const box = this.el.getBoundingClientRect();
		const x = Math.min(Math.max(0, mouseX - box.left), this.width);

		const p = x / this.width;
		return p;
	}

	set(p) {
		this.p = p;
		this.positionHandle(p);
	}

	positionHandle(p) {
		let range = this.sideOffset * 2 + this.width - this.handle.offsetWidth;
		this.handle.style.left = -this.sideOffset + (range * p) + 'px';
	}

	dismantle() {
		this.el.parentNode.removeChild(this.el);
	}
}

export default Slider;
