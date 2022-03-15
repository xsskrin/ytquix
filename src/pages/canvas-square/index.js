import { useRef, useEffect } from 'react';
import s from './canvas-square.module.sass';

const CanvasSquare = () => {
	const ref = useRef();

	useEffect(() => {
		const canvas = ref.current;
		const ctx = canvas.getContext('2d');

		const width = window.innerWidth;
		const height = canvas.parentNode.offsetHeight;

		canvas.width = width;
		canvas.height = height;

		let size = 30;
		let color = '#000';
		let x = 0, y = 0;
		let speedX = 2, speedY = 2;

		const drawSquare = () => {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, size, size);
		};

		const clear = () => {
			ctx.clearRect(x, y, size, size);
		};

		let frameId;
		const step = () => {
			frameId = requestAnimationFrame(step);
			clear();

			x += speedX;
			y += speedY;

			if (x >= width - size) {
				x = width - size;
				speedX *= -1;
			} else if (x <= 0) {
				x = 0;
				speedX *= -1;
			}

			if (y >= height - size) {
				y = height - size;
				speedY *= -1;
			} else if (y <= 0) {
				y = 0;
				speedY *= -1;
			}

			drawSquare();
		};

		frameId = requestAnimationFrame(step);

		const toggleOnSpacebar = (e) => {
			if (e.keyCode === 32) {
				if (frameId) {
					cancelAnimationFrame(frameId);
					frameId = null;
				} else {
					frameId = requestAnimationFrame(step);
				}
			}
		};

		window.addEventListener('keyup', toggleOnSpacebar);
	}, []);

	return (
		<div className={s.wrapper}>
			<canvas className={s.canvas} ref={ref} />
		</div>
	);
};

CanvasSquare.title = 'Canvas Square - JS Praktix';

export default CanvasSquare;
