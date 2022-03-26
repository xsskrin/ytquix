import Field from './Field';
import Piece from './Piece';

class CheckersGame {
	constructor(container, config) {
		this.container = container;
		this.config = config || {};

		this.el = document.createElement('div');
		this.el.className = 'checkers-board';

		this.container.appendChild(this.el);

		this.fieldsByNum = {};

		this.createFields();
		this.createPieces();
	}

	createFields() {
		for (let row = 0; row < 8; row += 1) {
			for (let col = 0; col < 8; col += 1) {
				const field = new Field(row, col);
				this.fieldsByNum[field.num] = field;
				this.el.appendChild(field.el);
			}
		}
	}

	createPieces() {
		for (let i = 0; i < 3; i += 1) {
			for (let j = i % 2; j < 8; j += 2) {
				const piece = new Piece('red');
				const field = this.fieldsByNum[i * 8 + j];
				piece.setField(field);
			}
		}
		for (let i = 5; i < 8; i += 1) {
			for (let j = i % 2; j < 8; j += 2) {
				const piece = new Piece('blue');
				const field = this.fieldsByNum[i * 8 + j];
				piece.setField(field);
			}
		}
	}

	clear() {
		this.container.innerHTML = '';
	}
}

export default CheckersGame;
