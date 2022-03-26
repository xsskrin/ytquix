

class Piece {
	constructor(color) {
		this.color = color;

		this.el = document.createElement('div');
		this.el.className = 'checkers-piece';
		this.el.className += ` checkers-piece-${color}`;
	}

	setField(field) {
		this.field = field;
		this.field.appendChild(this.el);
	}
}

export default Piece;
