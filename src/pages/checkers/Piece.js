import { getColorString } from './utils';

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
}

export default Piece;
