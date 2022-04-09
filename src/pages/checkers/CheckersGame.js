import Field from './Field';
import Piece from './Piece';
import Diagonal from './Diagonal';
import { DARK, LIGHT } from './consts';
import { getColorString, iterateTimeout, isChildOf } from './utils';
import powers from './powers';

class CheckersGame {
	constructor(container, config) {
		this.container = container;
		this.config = {
			rows: 8,
			cols: 8,
			fillRows: 2,
			fieldSize: 80,
		};

		if (config && typeof config === 'object') {
			Object.assign(this.config, config);
		}

		this.initialize();
	}

	initialize() {
		this.fieldsByNum = {};
		this.piecesByNum = {};
		this.movesByNum = {};
		this.diagonals = [];

		this.createBoard();
		this.createStyles();
		this.createFields();
		this.calcDiagonals();
		this.enhanceFields();

		this.pieceCounts = {
			[DARK]: 0,
			[LIGHT]: 0,
		};

		if (!this.load()) {
			this.createPieces();
			this.setPlayer(LIGHT);
		}

		this.enhancePieces();

		this.el.addEventListener('click', this.onClick);

		this.gameStep();
	}

	enhanceFields() {
		this.eachField((f) => {
			const arr = Object.values(powers);
			f.setPower(arr[Math.floor(Math.random() * arr.length)]);
		});
	}

	enhancePieces() {
		this.eachPiece((piece) => {
			const arr = Object.values(powers);
			piece.setPower(arr[Math.floor(Math.random() * arr.length)]);
		});
	}

	reset() {
		window.localStorage.removeItem('checkersData');
		this.clear();
		this.initialize();
	}

	createBoard() {
		this.el = document.createElement('div');
		this.el.className = 'checkers-board';

		this.container.appendChild(this.el);
	}

	resetSelectable() {
		Object.keys(this.piecesByNum).forEach((num) => {
			this.piecesByNum[num].setSelectable(false);
		});
	}

	eachPiece(cb) {
		Object.keys(this.piecesByNum).forEach((num) => {
			cb(this.piecesByNum[num]);
		});
	}

	endGame(winner) {
		const end = this.endEl = document.createElement('div');
		end.innerHTML = `${winner} won!<br/>Congrats!`;
		end.className = 'checkers-end';
		this.container.appendChild(end);
	}

	gameStep() {
		this.resetSelectable();

		if (this.pieceCounts[LIGHT] === 0) {
			this.endGame(DARK);
		} else if (this.pieceCounts[DARK] === 0) {
			this.endGame(LIGHT);
		}

		if (this.currentAttackingPiece) {
			const attacks = this.getAttacks(this.currentAttackingPiece.field.num);

			if (attacks.length) {
				attacks.forEach((a) => {
					a.from.piece.setSelectable(true);
					this.movesByNum[a.to.num] = a;
					a.to.highlight();
				});

				this.currentOnClick = this.playerAttackClick;
			} else {
				this.clearSelection();
				this.currentAttackingPiece = null;
				this.changePlayer();
				this.gameStep();
			}
		} else {
			const attacks = this.findPossibleAttacks();

			if (attacks.length) {
				attacks.forEach((a) => {
					a.from.piece.setSelectable(true);
				});

				this.currentOnClick = this.playerAttackClick;
			} else {
				this.eachPiece((p) => {
					if (p.color === this.player) {
						p.setSelectable(true);
					}
				});
				this.currentOnClick = this.playerMoveClick;
			}
		}
	}

	clearSelection() {
		if (this.selectedPiece) {
			this.selectedPiece.unselect();
		}
		if (this.moves) {
			this.moves.forEach((move) => {
				delete this.movesByNum[move.to.num];
				move.to.unhighlight();
			});
			this.moves.length = 0;
		}
	}

	playerAttackClick(e) {
		const el = e.target;
		const fieldNum = this.getNum(el);

		if (!this.currentAttackingPiece) {
			if (
				// current player's piece clicked
				isChildOf(el, 'checkers-piece-selectable')
			) {
				this.clearSelection();
				this.piecesByNum[fieldNum].select();

				this.moves = this.getAttacks(fieldNum);
				this.moves.forEach((m) => {
					this.movesByNum[m.to.num] = m;
					m.to.highlight();
				});
			} else if (
				// highlighted field clicked
				isChildOf(el, 'checkers-field-highlight')
			) {
				const move = this.movesByNum[fieldNum];
				this.currentAttackingPiece = move.from.piece;
				this.runMove(move);
				this.save();
				this.gameStep();
			} else {
				this.clearSelection();
			}
		}
	}

	eachField(cb) {
		Object.values(this.fieldsByNum).forEach((f) => {
			if (f.playable) cb(f);
		});
	}

	playerMoveClick(e) {
		const el = e.target;
		const fieldNum = this.getNum(el);

		if (
			// current player's piece clicked
			isChildOf(el, 'checkers-piece-selectable')
		) {
			this.clearSelection();
			this.piecesByNum[fieldNum].select();

			this.moves = this.getMoves(fieldNum);
			this.moves.forEach((m) => {
				this.movesByNum[m.to.num] = m;
				m.to.highlight();
			});
		} else if (
			// highlighted field clicked
			isChildOf(el, 'checkers-field-highlight')
		) {
			const move = this.movesByNum[fieldNum];
			this.runMove(move);
			this.clearSelection();
			this.changePlayer();
			this.save();
			this.gameStep();
		} else {
			this.clearSelection();
		}
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
		const keys = ['from', 'attack', 'to'];
		iterateTimeout(attacks, (current, prev) => {
			if (prev) {
				keys.forEach((k) => prev[k].el.style.removeProperty('border'));
			}
			keys.forEach((k) => current[k].el.style.border = '2px solid orange');
		}, 500);
	}

	highlightDiagonals() {
		iterateTimeout(this.diagonals, (current, prev) => {
			if (prev) prev.unhighlight();
			current.highlight();
		}, 200);
	}

	load() {
		let data = window.localStorage.getItem('checkersData');
		try {
			data = JSON.parse(data);
		} catch (e) {
			console.error(e);
			data = null;
		}

		if (!data) return false;

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
		const num = this.getNum(e.target);
		this.currentOnClick(e, num);
	}

	getNum(element) {
		while (element) {
			if (element.dataset && element.dataset.num) {
				return element.dataset.num;
			}
			element = element.parentNode;
		}
	}

	getAttacks(fieldNum) {
		const piece = this.piecesByNum[fieldNum];
		if (!piece) return [];

		return piece.getAttacks();
	}

	getMoves(fieldNum) {
		const piece = this.piecesByNum[fieldNum];
		if (!piece) return [];

		return piece.getMoves();
	}

	runMove(move) {
		const { from, to, attack } = move;
		from.piece.setField(to, attack);

		if (attack) {
			if (attack.piece) {
				attack.piece.remove();
			}
		}
	}

	getField(row, col) {
		if (col < 0 || col >= this.config.cols) return null;
		return this.fieldsByNum[row * this.config.cols + col];
	}

	createStyles() {
		if (this.fieldStyle && this.fieldStyle.parentNode) {
			this.fieldStyle.parentNode.removeChild(this.fieldStyle);
		}

		const { rows, cols, fieldSize } = this.config;
		const style = document.createElement('style');
		style.innerHTML = `
			.checkers-board {
				width: ${cols * fieldSize}px;
				height: ${rows * fieldSize}px;
			}
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
		this.setPlayer(this.getOtherPlayer());
	}

	getOtherPlayer() {
		return this.player === DARK ? LIGHT : DARK;
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
			this.fieldStyle = null;
		}
	}
}

export default CheckersGame;
