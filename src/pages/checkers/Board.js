import Piece from './Piece';

class Board {
	constructor() {
		this.el = document.createElement('div');
		this.el.className = 'checkers-board';

		this.fieldsByNum = {};

		this.initialize();
	}

	initialize() {
		for (let row = 0; row < 8; row += 1) {
			for (let col = 0; col < 8; col += 1) {
				const field = this.createField(row, col);
				this.el.appendChild(field);
			}
		}
	}

	createField(row, col) {
		const el = document.createElement('div');
		el.className = 'checkers-field';

		const dark = Boolean((row + col) % 2);
		if (dark) {
			el.className += ` checkers-field-dark`;
		} else {
			el.className += ` checkers-field-light`;
		}

		const num = row * 8 + col;
		el.setAttribute('data-num', num);
		this.fieldsByNum[num] = el;

		return el;
	}

	fillWithPieces() {
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

	appendTo(container) {
		container.appendChild(this.el);
	}
}

export default Board;
