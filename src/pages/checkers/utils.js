import { DARK, LIGHT } from './consts';

export const getColorString = (color) => {
	if (color === DARK) return 'dark';
	if (color === LIGHT) return 'light';
};

export const iterateTimeout = (arr, callback, stepTime) => {
	let i = 0, prev, timeoutId;

	const step = () => {
		if (arr[i]) {
			callback(arr[i], prev);
			prev = arr[i];
			i += 1;
			timeoutId = setTimeout(step, stepTime);
		}
	};

	step();

	return () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	};
};

export const isChildOf = (el, className) => {
	while (el) {
		if (el.classList && el.classList.contains(className)) {
			return true;
		}
		el = el.parentNode;
	}
	return false;
};

export const onClickOutside = (el, fn) => {
	const onClick = (e) => {
		let clicked = e.target;
		let outside = true;
		while (clicked) {
			if (clicked === el) {
				outside = false;
				break;
			}
			clicked = clicked.parentNode;
		}
		if (outside) fn();
	};

	document.body.addEventListener('click', onClick);

	return () => {
		document.body.removeEventListener('click', onClick);
	};
};
