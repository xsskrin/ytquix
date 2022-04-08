import { getColorString } from './utils';
import { DARK, LIGHT } from './consts';

class Piece {
	constructor(game, color) {
		this.game = game;
		this.color = color;

		const colorStr = getColorString(color);

		this.el = document.createElement('div');
		this.el.className = 'checkers-piece';

		this.inner = document.createElement('div');
		this.inner.className = 'checkers-piece-inner';
		this.inner.className += ` checkers-piece-${colorStr}`;
		this.el.appendChild(this.inner);

		this.game.el.appendChild(this.el);
	}

	setField(field, attacking) {
		if (this.field) {
			delete this.game.piecesByNum[this.field.num];
			this.field.piece = null;
			this.el.removeAttribute('data-num');
		}
		if (field) {
			this.field = field;
			field.piece = this;
			this.game.piecesByNum[field.num] = this;
			this.el.style.left = this.game.getBoardLeft(field.col);
			this.el.style.top = this.game.getBoardTop(field.row);
			this.el.setAttribute('data-num', field.num);
		}

		if (attacking) {
			this.el.classList.add('checkers-piece-attack');

			setTimeout(() => {
				this.el.classList.remove('checkers-piece-attack');
			}, 350);
		}
	}

	select() {
		this.el.classList.add('checkers-piece-selected');
		this.game.selectedPiece = this;
	}

	unselect() {
		this.el.classList.remove('checkers-piece-selected');
		if (this.game.selectedPiece === this) {
			this.game.selectedPiece = null;
		}
	}

	remove() {
		if (this.field) {
			delete this.game.piecesByNum[this.field.num];
			this.field.piece = null;
			this.field = null;
		}

		this.el.classList.add('checkers-piece-removing');
		setTimeout(() => {
			this.el.classList.add('checkers-piece-remove');

			setTimeout(() => {
				this.el.parentNode.removeChild(this.el);
			}, 450);
		}, 50);
	}

	setSelectable(selectable) {
		this.selectable = selectable;
		if (selectable) {
			this.el.classList.add('checkers-piece-selectable');
		} else {
			this.el.classList.remove('checkers-piece-selectable');
		}
	}

	getMoves() {
		if (!this.field) return [];

		const f = this.field;
		const moves = [];

		const checkMoves = (rowChange, colChange, otherColor) => {
			const diagField = f.getDiagonalField(rowChange, colChange);
			if (diagField) {
				if (diagField.isEmpty()) {
					moves.push({ from: f, to: diagField });
				} else if (diagField.hasPiece(otherColor)) {
					const diagField2 = f.getDiagonalField(
						rowChange * 2, colChange * 2
					);
					if (diagField2 && diagField2.isEmpty()) {
						moves.push({ from: f, to: diagField2, attack: diagField });
					}
				}
			}
		};

		if (this.isQueen) {
			// for later
		} else if (this.color === DARK) {
			checkMoves(1, 1, LIGHT);
			checkMoves(1, -1, LIGHT);
		} else if (this.color === LIGHT) {
			checkMoves(-1, 1, DARK);
			checkMoves(-1, -1, DARK);
		}

		return moves;
	}

	getAttacks() {
		if (!this.field) return [];

		const f = this.field;
		const moves = [];

		const checkAttack = (rowChange, colChange, otherColor) => {
			const diagField = f.getDiagonalField(rowChange, colChange);
			if (diagField) {
				if (diagField.hasPiece(otherColor)) {
					const diagField2 = f.getDiagonalField(
						rowChange * 2, colChange * 2
					);
					if (diagField2 && diagField2.isEmpty()) {
						moves.push({ from: f, to: diagField2, attack: diagField });
					}
				}
			}
		};

		if (this.isQueen) {
			// for later
		} else if (this.color === DARK) {
			checkAttack(1, 1, LIGHT);
			checkAttack(1, -1, LIGHT);
			checkAttack(-1, 1, LIGHT);
			checkAttack(-1, -1, LIGHT);
		} else if (this.color === LIGHT) {
			checkAttack(1, 1, DARK);
			checkAttack(1, -1, DARK);
			checkAttack(-1, 1, DARK);
			checkAttack(-1, -1, DARK);
		}

		return moves;
	}
}

export default Piece;
