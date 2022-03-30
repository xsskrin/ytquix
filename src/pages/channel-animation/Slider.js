

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
		const box = this.el.getBoundingClientRect();
		const x = Math.min(Math.max(0, e.clientX - box.left), this.width);

		const p = x / this.width;
		this.onUpdate(p);
		this.positionHandle(p);
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
