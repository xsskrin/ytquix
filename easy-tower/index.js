import Player from './Player';
import Platform from './Platform';
import AssetsLoader from './AssetsLoader';
import Background from './Background';
import GameOverScreen from './GameOverScreen';
import { randomInt } from './utils';

const PLATFORMS_OFFSET = 150;

class EasyTower {
	constructor(container) {
		console.log('EasyTower');
		this.container = container;

		this.setupCanvas();

		this.assetsLoader = new AssetsLoader();
		this.assets = this.assetsLoader.assets;

		this.assetsLoader.add(
			'background',
			require('./assets/background.png').default.src,
		);
		this.assetsLoader.add(
			'background2',
			require('./assets/background-2.png').default.src,
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

	setupCanvas() {
		this.box = document.createElement('div');
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.W = 480;
		this.H = 640;
		this.canvas.width = this.W;
		this.canvas.height = this.H;

		Object.assign(this.box.style, {
			position: 'absolute',
			zIndex: 20,
			width: this.W + 'px',
			height: this.H + 'px',
			top: '50%',
			left: '50%',
			overflow: 'hidden',
			transform: 'translateX(-50%) translateY(-50%)',
		});

		Object.assign(this.canvas.style, {
			position: 'relative',
			zIndex: 20,
			top: 0,
			left: 0,
			width: this.W + 'px',
			height: this.H + 'px',
		});

		this.box.appendChild(this.canvas);
		this.container.appendChild(this.box);
	}

	initialize() {
		this.started = false;
		this.lastTime = 0;
		this.chasingAmount = 0;
		this.score = 0;
		this.platforms = [];
		this.lastPlatformIndex = 0;
		this.lastPlatformY = 0;

		this.createBackground();
		this.createScoreDisplay();
		this.setupPlatforms();

		this.player = new Player(this, this.W / 2, this.H - 100);

		this.pressed = {};
		this.pressedKeysEl = document.createElement('div');
		Object.assign(this.pressedKeysEl.style, {
			position: 'absolute',
			top: '0px',
			left: '0px',
			zIndex: 100,
			fontSize: '32px',
			color: '#fff',
			padding: '16px',
			textShadow: '1px 1px 1px rgba(0, 0, 0, .5)',
		});
		this.box.appendChild(this.pressedKeysEl);

		this.onKeyUp = (e) => {
			delete this.pressed[e.key];
			this.showPressedKeys();
		};

		this.onKeyDown = (e) => {
			this.pressed[e.key] = true;
			this.showPressedKeys();
		};

		window.addEventListener('keydown', this.onFirstJump);
		window.addEventListener('keyup', this.onSpacebar);
		window.addEventListener('keyup', this.onKeyUp);
		window.addEventListener('keydown', this.onKeyDown);

		this.run();
	}

	onFirstJump = (e) => {
		if (e.key === 'w') {
			window.removeEventListener('keydown', this.onFirstJump);
			this.started = true;
		}
	}

	onSpacebar = (e) => {
		if (e.key === ' ') {
			this.toggleRun();
		}
	}

	createScoreDisplay() {
		this.scoreEl = document.createElement('div');
		Object.assign(this.scoreEl.style, {
			position: 'absolute',
			zIndex: 100,
			top: '16px',
			right: '32px',
			fontSize: '40px',
			fontWeight: 'bold',
			color: '#fff',
			textShadow: '1px 1px 1px rgba(0, 0, 0, .25)',
		});

		this.box.appendChild(this.scoreEl);
	}

	createBackground() {
		const background = this.background = new Background(this);

		background.addImage(this.assets.background, 1000);
		background.addImage(this.assets.background2, 2000);

		this.box.appendChild(background.el);
	}

	setupPlatforms() {
		this.createPlatforms(20);
	}

	createPlatforms(n) {
		for (let i = 0; i < n; i += 1) {
			this.createPlatform(
				randomInt(8, this.W - 154),
				this.H - (this.lastPlatformIndex + 1) * PLATFORMS_OFFSET,
			);
			this.lastPlatformIndex += 1;
		}
	}

	createPlatform(x, y) {
		const platform = new Platform(
			this, x, y, 146, 48,
		);

		this.platforms.push(platform);
		this.lastPlatformY = y;
	}

	run() {
		this.dt = this.dt || 0;
		this.lastTime = performance.now();
		this.rafId = requestAnimationFrame(this.step);
	}

	toggleRun() {
		if (this.rafId) {
			this.pause();
		} else {
			this.run();
		}
	}

	pause() {
		cancelAnimationFrame(this.rafId);
		this.rafId = null;
	}

	showPressedKeys() {
		this.pressedKeysEl.innerHTML = Object.keys(this.pressed);
	}

	step = () => {
		this.rafId = requestAnimationFrame(this.step);

		const now = performance.now();
		this.dt += now - this.lastTime;
		this.lastTime = now;

		while (this.dt >= 16.66) {
			this.dt -= 16.66;

			this.ctx.clearRect(0, 0, this.W, this.H);

			this.ctx.save();

			this.ctx.translate(0, this.chasingAmount);

			let len = this.platforms.length;
			while (len) {
				len -= 1;
				this.platforms[len].update();

				if (this.platforms[len]._removed) {
					this.platforms.splice(len, 1);
				}
			}

			this.player.update();

			this.player.checkCollisions();

			this.platforms.forEach((p) => p.draw());
			this.player.draw();

			this.ctx.restore();

			const py = this.player.y;
			if (py > this.H - this.chasingAmount) {
				this.gameOver();
			}

			if (this.started) {
				let chasingDelta;
				if (py < -this.chasingAmount + this.H * .1) {
					chasingDelta = 6;
				} else if (py < -this.chasingAmount + this.H * .4) {
					chasingDelta = 3;
				} else if (py < -this.chasingAmount + this.H * .7) {
					chasingDelta = 2;
				} else {
					chasingDelta = 1;
				}

				if (py < this.lastPlatformY + 1000) {
					this.createPlatforms(10);
				}

				this.chasingAmount += chasingDelta;
				this.score += chasingDelta / 5;
			}
		}

		this.background.setChasing(this.chasingAmount);
		this.updateScore();

		// this.background.style.backgroundPosition = `50% ${-1000 + this.score}px`;
	}

	restart = () => {
		if (this.isGameOver) {
			this.isGameOver = false;
			this.clear();
			this.setupCanvas();
			this.initialize();
		}
	}

	gameOver() {
		cancelAnimationFrame(this.rafId);

		this.isGameOver = true;
		this.gameOverScreen = new GameOverScreen(this);
	}

	updateScore() {
		this.scoreEl.innerHTML = this.score >> 0;
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
