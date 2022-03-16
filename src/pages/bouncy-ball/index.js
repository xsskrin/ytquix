import { useRef, useEffect } from 'react';
import s from './bouncy-ball.module.sass';

const createBouncyBall = (canvas) => {
	const ctx = canvas.getContext('2d');

	const W = canvas.parentNode.offsetWidth;
	const H = canvas.parentNode.offsetHeight;

	canvas.width = W;
	canvas.height = H;

	let color = '#000';
	let x = 100, y = 100;
	let radius = 20;
	let speedY = 0;
	let accY = 2;
	let targetX = x;

	const draw = () => {
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	};

	draw();

	const step = () => {
		frameId = requestAnimationFrame(step);
		ctx.clearRect(0, 0, W, H);
		draw();

		y += speedY;
		speedY += accY;

		if (y >= H - radius) {
			y = H - radius;
			speedY *= -.9;
		}

		if (targetX !== x) {
			x += (targetX - x) / 20;

			if (Math.abs(targetX - x) < 1) {
				targetX = x;
			}
		}
	};

	const changeBallX = (e) => {
		targetX = e.clientX;
	};

	canvas.addEventListener('click', changeBallX);

	let frameId = requestAnimationFrame(step);

	return () => {
		cancelAnimationFrame(frameId);
	}
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
