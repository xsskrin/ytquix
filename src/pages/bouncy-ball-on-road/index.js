import { useRef, useEffect } from 'react';
import s from './bouncy-ball-on-road.module.sass';

const createBouncyBall = (canvas) => {
	const ctx = canvas.getContext('2d');
	const W = canvas.parentNode.offsetWidth;
	const H = canvas.parentNode.offsetHeight;

	canvas.width = W;
	canvas.height = H;

	const blocks = [];

	let radius = 20;
	let x = W / 2 - radius;
	let y = 100;
	let speedY = 0;
	let accY = 2;
	let xTarget = x;

	const draw = () => {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	};

	draw();

	const checkCollision = (startX, endX, blockY) => {
		if (startX <= x && endX >= x) {
			if (y >= blockY - radius) {
				y = blockY - radius;
				speedY *= -1;
				if (speedY > -30) {
					speedY = -30;
				}
			}
		}
	};

	const step = () => {
		frameId = requestAnimationFrame(step);
		ctx.clearRect(0, 0, W, H);
		speedY += accY;
		y += speedY;

		if (xTarget !== x) {
			x += (xTarget - x) / 20;
			if (Math.abs(xTarget - x) < 1) {
				xTarget = x;
			}
		}

		let len = blocks.length;
		let block;
		while (len) {
			len -= 1;
			block = blocks[len];
			if (block._remove) {
				blocks.splice(len, 1);
			} else {
				block.update();
				block.draw();

				checkCollision(block.x, block.x + block.width, block.y);
			}
		}

		checkCollision(0, W, H);

		draw();
	};

	const Block = function (y, angle) {
		this.width = 100;
		this.height = 20;
		this.x = W + this.width;
		this.y = y;
		this.angle = angle;
	};

	Object.assign(Block.prototype, {
		draw() {
			ctx.fillRect(this.x, this.y, this.width, this.height);
		},

		update() {
			this.x -= 2;
			if (this.x < -this.width) {
				this._remove = true;
			}
		},
	});

	const createBlock = () => {
		const y = H - parseInt(Math.random() * 300);
		const angle = parseInt(Math.random() * Math.PI / 6);
		const block = new Block(y, angle);
		blocks.push(block);
	};

	createBlock();
	setInterval(createBlock, 3000);

	const setXTarget = (e) => {
		xTarget = e.clientX;
		speedY = 30;
	};

	document.body.addEventListener('click', setXTarget);

	let frameId = requestAnimationFrame(step);
};

const BouncyBall = () => {
	const canvasRef = useRef();

	useEffect(() => {
		return createBouncyBall(canvasRef.current);
	}, []);

	return (
		<div className={s.wrapper}>
			<canvas ref={canvasRef} />
		</div>
	);
};

BouncyBall.title = 'Bouncy Ball On Road - JS Praktix';

export default BouncyBall;
