import Player from './Player';
import Platform from './Platform';

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

		this.player = new Player(this, this.W / 2, 0);
		this.platform = new Platform(
			this, this.W / 2, this.H / 2, 100, 20,
		);

		this.run();
	}

	run() {
		this.rafId = requestAnimationFrame(this.step);
	}

	step = () => {
		this.rafId = requestAnimationFrame(this.step);

		this.ctx.clearRect(0, 0, this.W, this.H);
		this.player.draw();
		this.player.update();

		this.platform.draw();
		this.platform.update();
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