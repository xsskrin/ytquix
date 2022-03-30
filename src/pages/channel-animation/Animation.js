import Timeline from './Timeline';
import Square from './Square';
import Text from './Text';

class Animation {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		const SIZE = 400;

		this.setup();
		this.timeline = new Timeline();

		this.objects = [];

		const yellowSquare = new Square(
			this.ctx, this.W / 2, this.H / 2, '#FDE200'
		);
		this.objects.push(yellowSquare);

		const ys = yellowSquare;
		this.timeline.add((p) => {
			ys.x = ys.startX - ys.size / 2;
			ys.y = ys.startY - ys.size / 2;
			ys.size = p * SIZE;
		}, {
			time: 500,
		});

		const jsText = new Text(
			this.ctx,
			'JS',
			SIZE / 2,
		);
		this.objects.push(jsText);
		this.timeline.add((p) => {
			jsText.visible = p > 0;
			jsText.x = this.W / 2 - (SIZE * .4) * p;
			jsText.y = this.H / 2 - (SIZE * .4);
		}, {
			time: 500,
		});

		const praktixText = new Text(
			this.ctx,
			'PRAKTIX',
			SIZE / 6,
		);
		this.objects.push(praktixText);
		const pt = praktixText;
		this.timeline.add((p) => {
			pt.visible = p > 0;
			pt.x = this.W / 2 - (SIZE * .4) * p;
			pt.y = this.H / 2 + (SIZE * .1);
		}, {
			time: 500,
		});

		this.run();
	}

	setup() {
		this.W = this.canvas.parentNode.offsetWidth;
		this.H = this.canvas.parentNode.offsetHeight;
		this.canvas.width = this.W * 2;
		this.canvas.height = this.H * 2;
	}

	run() {
		this.passedTime = 0;
		this.lastTime = performance.now();
		this.timeline.onEnd = () => {
			this.stop();
		};
		this.raf = requestAnimationFrame(this.step);
	}

	stop() {
		if (this.raf) {
			cancelAnimationFrame(this.raf);
			this.raf = null;
		}
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.W, this.H);
	}

	drawObjects() {
		this.objects.forEach(obj => obj.draw());
	}

	step = () => {
		const now = performance.now();
		const passed = now - this.lastTime;
		this.passedTime += passed;
		this.lastTime = now;
		this.raf = requestAnimationFrame(this.step);
		this.update(this.passedTime);
	}

	update(time) {
		this.clearCanvas();
		this.timeline.update(time);
		this.ctx.setTransform(2, 0, 0, 2, 0, 0);
		this.drawObjects();
	}

	clear() {
		this.stop();
	}
}

export default Animation;
