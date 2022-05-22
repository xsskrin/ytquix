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
			zIndex: 20,
			top: 0,
			left: 0,
			width: this.W + 'px',
			height: this.H + 'px',
		});

		container.appendChild(this.canvas);

		this.load().then(() => {
			const background = document.createElement('div');
			Object.assign(background.style, {
				position: 'absolute',
				zIndex: 10,
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundImage: `url('${this.assets.background.src}')`,
				backgroundPosition: 'bottom',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
			});

			this.container.appendChild(background);

			this.player = new Player(this, this.W / 2, 0);
			this.platform = new Platform(
				this, this.W / 2, this.H / 2, 100, 20,
			);

			this.pressed = {};
			this.pressedKeysEl = document.createElement('div');
			Object.assign(this.pressedKeysEl.style, {
				position: 'absolute',
				zIndex: 100,
				fontSize: '40px',
				color: '#fff',
				padding: '16px',
				textShadow: '1px 1px 1px rgba(0, 0, 0, .5)',
			});
			this.container.appendChild(this.pressedKeysEl);

			this.onKeyUp = (e) => {
				delete this.pressed[e.key];
				this.showPressedKeys();
			};

			this.onKeyDown = (e) => {
				this.pressed[e.key] = true;
				this.showPressedKeys();
			};

			window.addEventListener('keyup', this.onKeyUp);
			window.addEventListener('keydown', this.onKeyDown);

			this.run();
		});
	}

	load() {
		const assets = this.assets = {};

		return new Promise((resolve) => {
			const toLoad = {};

			loadImage(
				'background',
				require('./assets/background.png').default.src,
			);

			loadImage(
				'hero',
				require('./assets/hero.png').default.src,
			);

			function loadImage(name, src) {
				toLoad[name] = true;

				const img = new Image();
				img.onload = () => {
					assets[name] = img;
					onAnyLoad(name);
				};
				img.src = src;
			}

			function onAnyLoad(name) {
				delete toLoad[name];

				if (!Object.values(toLoad).length) {
					resolve();
				}
			}
		});
	}

	run() {
		this.rafId = requestAnimationFrame(this.step);
	}

	showPressedKeys() {
		this.pressedKeysEl.innerHTML = Object.keys(this.pressed);
	}

	step = () => {
		this.rafId = requestAnimationFrame(this.step);

		this.ctx.clearRect(0, 0, this.W, this.H);
		this.player.draw();
		this.player.update();

		this.platform.draw();
		this.platform.update();

		this.player.checkCollisions();
	}

	clear() {
		console.log('clearing EasyTower instance...');

		this.container.innerHTML = '';

		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		window.removeEventListener('keyup', this.onKeyUp);
		window.removeEventListener('keydown', this.onKeyDown);
	}
}

export default EasyTower;
