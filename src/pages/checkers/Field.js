

class Field {
	constructor(row, col, color) {
		this.row = row;
		this.col = col;

		const dark = Boolean((row + col) % 2);
		const colorStr = dark ? 'dark' : 'light';

		this.el = document.createElement('div');
		this.el.className = 'checkers-field';
		this.el.className += ` checkers-field-${colorStr}`;

		const num = row * 8 + col;
		this.num = num;
		this.el.setAttribute('data-num', num);
	}
}

export default Field;
