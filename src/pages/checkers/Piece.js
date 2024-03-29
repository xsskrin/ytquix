import { getColorString } from './utils';
import { DARK, LIGHT } from './consts';
import powers from './powers';
import TextBubble from './TextBubble';

class Piece {
	constructor(game, color, attrs) {
		this.game = game;
		this.color = color;
		const a = this.attrs = (attrs && typeof attrs === 'object') ? attrs : {};

		const colorStr = getColorString(color);

		this.el = document.createElement('div');
		this.el.className = 'checkers-piece';
		this.el.className += ` checkers-piece-${colorStr}`;

		this.inner = document.createElement('div');
		this.inner.className = 'checkers-piece-inner';

		this.powerEl = document.createElement('div');
		this.powerEl.className = 'checkers-piece-power';
		this.powerEl.style.background = 'grey';

		this.inner.appendChild(this.powerEl);
		this.el.appendChild(this.inner);

		if (a.isQueen) {
			this.makeQueen();
		}
		if (a.powerSign) {
			const power = Object.values(powers).filter((p) => {
				return p.sign === a.powerSign;
			})[0];
			this.setPower(power);
		}

		this.game.el.appendChild(this.el);
		this.game.pieceCounts[color] += 1;
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

	highlightSpecial(color) {
		this.inner.style.background = color;
	}

	unhighlightSpecial() {
		this.inner.style.removeProperty('background');
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
			this.game.pieceCounts[this.color] -= 1;

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

	setPower(power) {
		if (this.power) {
			this.removePower();
		}

		this.power = power;
		this.el.classList.add(`checkers-piece-power-${power.name}`);
		this.powerEl.style.background = power.color;

		if (power.icon) {
			const svg = document.createElement('div');
			svg.innerHTML = power.icon;
			svg.style.margin = '18%';
			svg.style.opacity = '.5';
			svg.style.webkitFilter = 'brightness(0)';
			this.powerEl.appendChild(svg);
		}
	}

	removePower() {
		this.power = null;
		this.powerEl.innerHTML = '';
		this.powerEl.style.background = 'grey';
	}

	highlightPower() {
		this.el.classList.add('checkers-piece-highlight-power');
	}
	unhighlightPower() {
		this.el.classList.remove('checkers-piece-highlight-power');
	}

	getMoves() {
		if (!this.field) return [];

		const f = this.field;
		const moves = [];
		const otherColor = this.color === DARK ? LIGHT : DARK;

		const checkMoves = (rowChange, colChange) => {
			const diagField = f.getDiagonalField(rowChange, colChange);
			if (diagField && diagField.isEmpty()) {
				moves.push({ from: f, to: diagField });
			}
		};

		const checkQueenMoves = (rowChange, colChange) => {
			let diagField = f, prev;
			while (diagField = diagField.getDiagonalField(rowChange, colChange)) {
				if (diagField.isEmpty()) {
					moves.push({ from: f, to: diagField });
				} else {
					break;
				}
			}
		};

		if (this.isQueen) {
			checkQueenMoves(1, 1);
			checkQueenMoves(1, -1);
			checkQueenMoves(-1, 1);
			checkQueenMoves(-1, -1);
		} else if (this.color === DARK) {
			checkMoves(1, 1);
			checkMoves(1, -1);
		} else if (this.color === LIGHT) {
			checkMoves(-1, 1);
			checkMoves(-1, -1);
		}

		return moves;
	}

	getAttacks() {
		if (!this.field) return [];

		const f = this.field;
		const moves = [];
		const otherColor = this.color === DARK ? LIGHT : DARK;

		const checkAttack = (rowChange, colChange) => {
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

		const checkQueenAttack = (rowChange, colChange) => {
			let diagField = f;
			while (diagField = diagField.getDiagonalField(rowChange, colChange)) {
				if (diagField.hasPiece(this.color)) {
					break;
				}
				if (diagField.hasPiece(otherColor)) {
					let diagField2 = diagField;
					while (diagField2 = diagField2.getDiagonalField(rowChange, colChange)) {
						if (diagField2.isEmpty()) {
							moves.push({
								from: f, to: diagField2, attack: diagField,
							});
						} else {
							return;
						}
					}
				}
			}
		};

		if (this.isQueen) {
			checkQueenAttack(1, 1);
			checkQueenAttack(1, -1);
			checkQueenAttack(-1, 1);
			checkQueenAttack(-1, -1);
		} else {
			checkAttack(1, 1);
			checkAttack(1, -1);
			checkAttack(-1, 1);
			checkAttack(-1, -1);
		}

		return moves;
	}

	makeQueen() {
		this.isQueen = true;
		this.el.classList.add('checkers-piece-queen');
	}

	showText(textsGroup, config = {}) {
		this.el.classList.add('checkers-piece-with-bubble');
		const onDone = config && config.onDone;
		config.onDone = () => {
			this.el.classList.remove('checkers-piece-with-bubble');
			if (onDone) onDone();
		};
		const bubble = new TextBubble(textsGroup, config);

		bubble.appendTo(this.el);
		bubble.start();
	}
}

export default Piece;
