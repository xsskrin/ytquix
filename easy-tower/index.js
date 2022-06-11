import Player from './Player';
import Platform from './Platform';
import AssetsLoader from './AssetsLoader';

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

		this.assetsLoader = new AssetsLoader();
		this.assets = this.assetsLoader.assets;

		this.assetsLoader.add(
			'background',
			require('./assets/background.png').default.src,
		);
		this.assetsLoader.add(
			'hero',
			require('./assets/hero.png').default.src,
		);
		this.assetsLoader.add(
			'platform',
			require('./assets/platform.png').default.src,
		);

		this.assetsLoader.load().then(() => {
			this.initialize();
		});
	}

	initialize() {
		this.score = 0;
		this.platforms = [];

		this.createBackground();
		this.createScoreDisplay();
		this.setupPlatforms();

		this.player = new Player(this, this.W / 2, 0);

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
	}

	createScoreDisplay() {
		this.scoreEl = document.createElement('div');
		Object.assign(this.scoreEl.style, {
			position: 'absolute',
			zIndex: 100,
			top: '8px',
			right: '8px',
			fontSize: '20px',
			color: '#fff',
			textShadow: '1px 1px 1px rgba(0, 0, 0, .25)',
		});

		this.container.appendChild(this.scoreEl);
	}

	createBackground() {
		const background = this.background = document.createElement('div');
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
	}

	setupPlatforms() {
		for (let i = 0; i < 10; i += 1) {
			this.createPlatform(
				this.W / ((i + 1) % 5),
				this.H - (i + 1) * 150,
			);
		}
	}

	createPlatform(x, y) {
		const platform = new Platform(
			this, x, y, 146, 48,
		);

		this.platforms.push(platform);
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

		this.ctx.save();

		this.ctx.translate(0, this.score);

		this.platforms.forEach((p) => p.update());
		this.player.update();

		this.player.checkCollisions();

		this.platforms.forEach((p) => p.draw());
		this.player.draw();

		this.ctx.restore();

		if (this.player.y > this.H - this.score) {
			this.gameOver();
		}

		this.score += 1;
		this.updateScore();
	}

	gameOver() {
		cancelAnimationFrame(this.rafId);

		this.displayGameOver();
	}

	displayGameOver() {
		this.gameOverEl = document.createElement('div');
		Object.assign(this.gameOverEl.style, {
			position: 'absolute',
			zIndex: 200,
			color: '#fff',
			fontSize: '40px',
			textShadow: '1px 1px 1px rgba(0, 0, 0, .25)',
			top: '50%',
			left: '50%',
			transform: 'translateX(-50%) translateY(-50%)',
		});

		this.gameOverEl.innerHTML = 'GAME OVER';

		this.container.appendChild(this.gameOverEl);
	}

	updateScore() {
		this.scoreEl.innerHTML = this.score;
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
