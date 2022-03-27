

class Piece {
	constructor(color) {
		this.color = color;

		this.el = document.createElement('div');
		this.el.className = 'checkers-piece';
		this.el.className += ` checkers-piece-${color}`;
	}

	setField(field) {
		if (field) {
			this.field = field;
			this.field.el.appendChild(this.el);
		}
	}
}

export default Piece;
