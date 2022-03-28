import { getColorString } from './utils';

class Piece {
	constructor(color) {
		this.color = color;

		const colorStr = getColorString(color);

		this.el = document.createElement('div');
		this.el.className = 'checkers-piece';
		this.el.className += ` checkers-piece-${colorStr}`;
	}

	setField(field) {
		if (this.field) {
			this.field.piece = null;
		}
		if (field) {
			this.field = field;
			this.field.el.appendChild(this.el);
			field.piece = this;
		}
	}
}

export default Piece;
