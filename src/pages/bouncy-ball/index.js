import { useRef, useEffect } from 'react';
import s from './bouncy-ball.module.sass';

const createBouncyBall = (canvas) => {
	const ctx = canvas.getContext('2d');
	const W = canvas.parentNode.offsetWidth;
	const H = canvas.parentNode.offsetHeight;

	canvas.width = W;
	canvas.height = H;

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

	const step = () => {
		frameId = requestAnimationFrame(step);
		ctx.clearRect(0, 0, W, H);
		speedY += accY;
		y += speedY;

		if (y >= H - radius) {
			y = H - radius;
			speedY *= -1;
			if (speedY > -30) {
				speedY = -30;
			}
		}

		if (xTarget !== x) {
			x += (xTarget - x) / 20;
			if (Math.abs(xTarget - x) < 1) {
				xTarget = x;
			}
		}

		draw();
	};

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

BouncyBall.title = 'Bouncy Ball - JS Praktix';

export default BouncyBall;
