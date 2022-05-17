class EasyTower {
	constructor(container) {
		console.log('EasyTower');
		this.container = container;

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.W = window.innerWidth;
		this.H = window.innerHeight;
		this.canvas.width = this.W;
		this.canvas.height = this.H;

		Object.assign(this.canvas.style, {
			position: 'absolute',
			top: 0,
			left: 0,
			width: this.W + 'px',
			height: this.H + 'px',
			background: 'rgba(0, 0, 0, .5)',
		});

		container.appendChild(this.canvas);

		const game = this;
		this.square = {
			x: game.W / 2 - 20,
			y: 0,
			size: 40,
			update() {
				this.y += 1;
				if (this.y > game.H - this.size) {
					this.y = game.H - this.size;
				}
			},
			draw() {
				game.ctx.fillRect(this.x, this.y, this.size, this.size);
			},
		};

		this.run();
	}

	run() {
		this.rafId = requestAnimationFrame(this.step);
	}

	step = () => {
		this.rafId = requestAnimationFrame(this.step);

		this.ctx.clearRect(0, 0, this.W, this.H);
		this.square.draw();
		this.square.update();
	}

	clear() {
		console.log('clearing EasyTower instance...');

		this.container.innerHTML = '';

		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}
}

export default EasyTower;
