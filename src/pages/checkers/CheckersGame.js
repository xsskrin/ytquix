import Field from './Field';
import Piece from './Piece';
import Diagonal from './Diagonal';
import { DARK, LIGHT } from './consts';
import { getColorString } from './utils';

class CheckersGame {
	constructor(container, config) {
		this.container = container;
		this.config = {
			rows: 8,
			cols: 8,
			fillRows: 2,
		};

		if (config && typeof config === 'object') {
			Object.assign(this.config, config);
		}

		this.el = document.createElement('div');
		this.el.className = 'checkers-board';

		this.container.appendChild(this.el);

		this.fieldsByNum = {};
		this.piecesByNum = {};
		this.movesByNum = {};
		this.diagonals = [];

		this.createFieldStyle();
		this.createFields();
		this.calcDiagonals();

		if (!this.load()) {
			this.createPieces();
			this.setPlayer(LIGHT);
		}

		this.findPossibleAttacks();

		this.onCurrentClick = this.playerMoveClick;
		this.el.addEventListener('click', this.onClick);
	}

	calcDiagonals() {
		const d = this.diagonals;
		const { rows, cols } = this.config;

		for (let startRow = 0; startRow < rows; startRow += 2) {
			const diag = new Diagonal(this);
			let field, row = startRow, col = 0;
			while (field = this.getField(row, col)) {
				diag.add(field), row -= 1, col += 1;
			}
			d.push(diag);
		}
		for (let startCol = 1; startCol < cols; startCol += 2) {
			const diag = new Diagonal(this);
			let field, row = rows - 1, col = startCol;
			while (field = this.getField(row, col)) {
				diag.add(field), row -= 1, col += 1;
			}
			d.push(diag);
		}
		for (let startRow = 0; startRow < rows; startRow += 2) {
			const diag = new Diagonal(this);
			let field, row = startRow, col = 0;
			while (field = this.getField(row, col)) {
				diag.add(field), row += 1, col += 1;
			}
			d.push(diag);
		}
		for (let startCol = 2; startCol < cols; startCol += 2) {
			const diag = new Diagonal(this);
			let field, row = 0, col = startCol;
			while (field = this.getField(row, col)) {
				diag.add(field), row += 1, col += 1;
			}
			d.push(diag);
		}
	}

	findPossibleAttacks() {
		const attacks = [];

		this.diagonals.forEach((diag) => {
			const diagAttacks = diag.findAttacks(this.player);
			attacks.push(...diagAttacks);
		});

		return attacks;
	}

	highlightAttacks(attacks) {
		let i = 0, prev;
		const highlight = () => {
			if (attacks[i]) {
				if (prev) {
					prev.from.el.style.removeProperty('border');
					prev.attack.el.style.removeProperty('border');
					prev.to.el.style.removeProperty('border');
				}
				const a = attacks[i];
				prev = a;
				a.from.el.style.border = '2px solid orange';
				a.attack.el.style.border = '2px solid orange';
				a.to.el.style.border = '2px solid orange';

				i += 1;
				setTimeout(() => {
					highlight();
				}, 1000);
			}
		};

		highlight();
	}

	highlightDiagonals() {
		const d = this.diagonals;

		let i = 0, prev;
		const highlightDiag = () => {
			if (d[i]) {
				if (prev) {
					prev.unhighlight();
				}
				prev = d[i];
				d[i].highlight();

				i += 1;
				setTimeout(highlightDiag, 100);
			}
		};

		highlightDiag();
	}

	load() {
		let data = window.localStorage.getItem('checkersData');
		try {
			data = JSON.parse(data);
		} catch (e) {
			console.error(e);
			return false;
		}

		const { piecesStr, currentPlayer } = data;
		let num = '', c;
		for (let i = 0, len = piecesStr.length; i < len; i += 1) {
			c = piecesStr[i];
			if (c === 'A' || c === 'B') {
				const piece = new Piece(this, c === 'A' ? DARK : LIGHT);
				const field = this.fieldsByNum[num];
				piece.setField(field);
				num = '';
			} else {
				num += c;
			}
		}

		this.setPlayer(currentPlayer);

		return true;
	}

	save() {
		const pbn = this.piecesByNum;
		const piecesStr = Object.keys(pbn).map((num) => {
			return `${num}${pbn[num].color === DARK ? 'A' : 'B'}`;
		}).join('');

		window.localStorage.setItem('checkersData', JSON.stringify({
			piecesStr,
			currentPlayer: this.player,
		}));
	}

	getBoardLeft(col) {
		return col * 100 / this.config.cols + '%';
	}
	getBoardTop(row) {
		return row * 100 / this.config.rows + '%';
	}

	onClick = (e) => {
		this.onCurrentClick(e);
	}

	clearSelection() {
		if (this.selectedPiece) {
			this.selectedPiece.unselect();
		}
		if (this.moves) {
			this.moves.forEach((move) => {
				const field = this.getField(move.row, move.col);
				delete this.movesByNum[move.row * this.config.cols + move.col];
				field.unhighlight();
			});
			this.moves.length = 0;
		}
	}

	getNum(element) {
		while (element) {
			if (element.dataset && element.dataset.num) {
				return element.dataset.num;
			}
			element = element.parentNode;
		}
	}

	playerMoveClick(e) {
		const el = e.target;
		const playerColor = getColorString(this.player);
		const fieldNum = this.getNum(el);

		const moves = this.getMoves(fieldNum);
		console.log(moves);

		if (
			// current player's piece clicked
			el.classList.contains(`checkers-piece-${playerColor}`)
		) {
			this.clearSelection();
			this.piecesByNum[fieldNum].select();
			this.highlightPossibleMoves(el.parentNode.dataset.num);
		} else if (
			// highlighted field clicked
			el.classList.contains('checkers-field-highlight')
		) {
			const move = this.movesByNum[fieldNum];
			this.movePiece(this.selectedPiece, move);
			this.clearSelection();
			this.changePlayer();
			this.save();
		} else {
			this.clearSelection();
		}
	}

	getMoves(fieldNum) {
		const piece = this.piecesByNum[fieldNum];
		if (!piece) return [];

		return piece.getMoves();
	}

	movePiece(piece, move) {
		const { row, col, attacking } = move;
		const field = this.getField(row, col);
		piece.setField(field, attacking);

		if (attacking) {
			const attackedField = this.getField(
				attacking.row, attacking.col,
			);
			const attackedPiece = attackedField.piece;
			if (attackedPiece) {
				attackedPiece.remove();
			}
		}
	}

	highlightPossibleMoves(fieldNum) {
		const row = Math.floor(fieldNum / this.config.cols);
		const col = fieldNum % this.config.cols;
		const otherPlayer = this.player === DARK ? LIGHT : DARK;
		const rowChange = this.player === DARK ? 1 : -1;

		const possibleRow = row + rowChange;

		const moves = [];
		[1, -1].forEach((colChange) => {
			let field = this.getField(
				possibleRow, col + colChange,
			);
			if (field) {
				if (!field.piece) {
					moves.push({
						row: possibleRow,
						col: col + colChange,
					});
				} else if (field.piece.color === otherPlayer) {
					field = this.getField(
						possibleRow + rowChange,
						col + colChange * 2,
					);
					if (field && !field.piece) {
						moves.push({
							row: possibleRow + rowChange,
							col: col + colChange * 2,
							attacking: {
								row: possibleRow,
								col: col + colChange,
							},
						});
					}
				}
			}
		});

		moves.forEach((move) => {
			const field = this.getField(move.row, move.col);
			this.movesByNum[move.row * this.config.cols + move.col] = move;
			field.highlight();
		});

		this.moves = moves;
	}

	getField(row, col) {
		if (col < 0 || col >= this.config.cols) return null;
		return this.fieldsByNum[row * this.config.cols + col];
	}

	createFieldStyle() {
		const { rows, cols } = this.config;
		const style = document.createElement('style');
		style.innerHTML = `
			.checkers-field, .checkers-piece {
				width: ${100 / cols}%;
				height: ${100 / rows}%;
			}
		`;

		document.head.appendChild(style);
		this.fieldStyle = style;
	}

	createFields() {
		const { rows, cols } = this.config;

		for (let row = 0; row < rows; row += 1) {
			for (let col = 0; col < cols; col += 1) {
				const field = new Field(this, row, col);
				this.fieldsByNum[field.num] = field;
				this.el.appendChild(field.el);
			}
		}
	}

	createPieces() {
		const { rows, cols, fillRows } = this.config;

		for (let i = 0; i < fillRows; i += 1) {
			for (let j = i % 2; j < cols; j += 2) {
				const piece = new Piece(this, DARK);
				const field = this.fieldsByNum[i * cols + j];
				piece.setField(field);
			}
		}
		for (let i = rows - fillRows; i < rows; i += 1) {
			for (let j = i % 2; j < cols; j += 2) {
				const piece = new Piece(this, LIGHT);
				const field = this.fieldsByNum[i * cols + j];
				piece.setField(field);
			}
		}
	}

	setPlayer(player) {
		this.player = player;
		this.setNamespaceClass('player', player);
	}

	changePlayer() {
		const otherPlayer = this.player === DARK ? LIGHT : DARK;
		this.setPlayer(otherPlayer);
	}

	setNamespaceClass(namespace, cls) {
		const namespaceStr = `checkers--${namespace}`;

		const className = this.el.className.split(' ')
			.filter((part) => part.indexOf(namespaceStr) !== 0)

		className.push(`${namespaceStr}_${cls}`);

		this.el.className = className.join(' ');
	}

	clear() {
		this.container.innerHTML = '';
		if (this.fieldStyle) {
			this.fieldStyle.parentNode.removeChild(this.fieldStyle);
		}
	}
}

export default CheckersGame;
