import { useRef, useEffect } from 'react';
import s from './canvas-square.module.sass';

const createCanvasSquare = (canvas) => {
	const ctx = canvas.getContext('2d');
	const W = canvas.parentNode.offsetWidth;
	const H = canvas.parentNode.offsetHeight;

	canvas.width = W;
	canvas.height = H;

	let x = 100, y = 100;
	let size = 40;
	let speedX = 4, speedY = 4;
	let sizeStep = -1;
	let maxSize = 80;
	let minSize = 20;

	const draw = () => {
		ctx.fillRect(x, y, size, size);
	};

	const step = () => {
		frameId = requestAnimationFrame(step);
		ctx.clearRect(0, 0, W, H);
		draw();
		x += speedX;
		y += speedY;
		size += sizeStep;

		if (x >= W - size) {
			x = W - size;
			speedX *= -1;
		} else if (x <= 0) {
			x = 0;
			speedX *= -1;
		}

		if (y >= H - size) {
			y = H - size;
			speedY *= -1;
		} else if (y <= 0) {
			y = 0;
			speedY *= -1;
		}

		if (size >= maxSize || size <= minSize) {
			sizeStep *= -1;
		}
	};

	let frameId = requestAnimationFrame(step);

	return () => {
		cancelAnimationFrame(frameId);
	};
};

const CanvasSquare = () => {
	const canvasRef = useRef();

	useEffect(() => {
		return createCanvasSquare(canvasRef.current);
	}, []);

	return (
		<div className={s.wrapper}>
			<canvas ref={canvasRef} />
		</div>
	);
};

CanvasSquare.title = 'Canvas Square - JS Praktix';

export default CanvasSquare;
