import Timeline from './Timeline';
import Square from './Square';
import Text from './Text';
import Slider from './Slider';
import Viewport from './Viewport';

class Animation {
	constructor(canvas) {
		this.canvas = canvas;
		this.container = this.canvas.parentNode;
		this.ctx = canvas.getContext('2d');

		this.viewport = new Viewport();
		this.viewport.setDimensions(800, 400);

		this.viewport.appendChild(this.canvas);

		this.container.appendChild(this.viewport.el);

		const SIZE = 50;
		const X = 50;
		const Y = 50;

		const FRAME = 150;

		this.setup();
		this.timeline = new Timeline();

		this.objects = [];

		const yellowSquare = new Square(
			this.ctx,
			X,
			Y,
			'#FDE200',
		);
		this.objects.push(yellowSquare);

		const ys = yellowSquare;
		this.timeline.add((p) => {
			ys.visible = p > 0;
			ys.size = p * SIZE;
			ys.x = ys.startX - ys.size / 2;
			ys.y = ys.startY - ys.size / 2;
		}, {
			time: FRAME * 5,
		});

		const jsText = new Text(
			this.ctx,
			'JS',
			SIZE / 2,
			'#000',
		);
		this.objects.push(jsText);
		this.timeline.add((p) => {
			jsText.visible = p > 0;
			jsText.opacity = p;
			jsText.x = X - (SIZE * .4) + SIZE * .8 * (1 - p);
			jsText.y = Y - (SIZE * .4);
		}, {
			time: FRAME * 3,
		});

		const praktixText = new Text(
			this.ctx,
			'PRAKTIX',
			SIZE / 5,
			'#000',
		);
		this.objects.push(praktixText);
		const pt = praktixText;
		this.timeline.add((p) => {
			pt.visible = p > 0;
			pt.opacity = p;
			pt.x = X - (SIZE * .4) + SIZE * .8 * (1 - p);
			pt.y = Y + (SIZE * .1);
		}, {
			time: FRAME * 3,
			offset: FRAME * -2,
		});

		const whiteSquare = new Square(
			this.ctx,
			X + SIZE * .25,
			Y - SIZE * .25,
			'#FFF',
		);
		this.objects.push(whiteSquare);

		const ws = whiteSquare;
		this.timeline.add((p) => {
			ws.visible = p > 0;
			ws.size = p * SIZE / 6;
			ws.rotation = p * (Math.PI + Math.PI / 10);
			ws.x = ws.startX - ws.size / 2;
			ws.y = ws.startY - ws.size / 2;
		}, {
			time: FRAME * 2,
		});

		const blackSquare = new Square(
			this.ctx,
			X + SIZE * .25,
			Y - SIZE * .25,
			'#000',
		);
		this.objects.push(blackSquare);

		const bs = blackSquare;
		this.timeline.add((p) => {
			bs.visible = p > 0;
			bs.size = p * SIZE / 6;
			bs.rotation = p * Math.PI;
			bs.x = ws.startX - bs.size / 2;
			bs.y = ws.startY - bs.size / 2;
		}, {
			time: FRAME * 2,
		});

		const redSquare = new Square(
			this.ctx,
			X + SIZE * .25,
			Y - SIZE * .25,
			'#FF3A39',
		);
		this.objects.push(redSquare);

		const rs = redSquare;
		this.timeline.add((p) => {
			rs.visible = p > 0;
			rs.size = p * SIZE / 20;
			rs.rotation = p * (Math.PI + Math.PI / 10);
			rs.x = rs.startX - rs.size / 2;
			rs.y = rs.startY - rs.size / 2;
		}, {
			time: FRAME * 2,
		});

		this.timeline.onUpdate = (p) => {
			this.slider.set(p);
		};

		this.run();

		this.slider = new Slider();
		this.container.appendChild(this.slider.el);
		this.slider.onUpdate = (p) => {
			this.update(p * this.timeline.duration);
		};
	}

	setup() {
		this.W = this.canvas.parentNode.offsetWidth / 2;
		this.H = this.canvas.parentNode.offsetHeight / 2;
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
		this.slider.dismantle();
	}
}

export default Animation;
