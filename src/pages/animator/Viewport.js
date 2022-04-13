

class Viewport {
	constructor() {
		this.el = document.createElement('div');
		this.el.className = 'animator-viewport';
	}

	appendChild(child) {
		this.el.appendChild(child);
	}

	setDimensions(width, height) {
		this.width = width;
		this.height = height;
		this.el.style.width = width + 'px';
		this.el.style.height = height + 'px';
	}
}

export default Viewport;
