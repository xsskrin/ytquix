import Field from './Field';
import Piece from './Piece';
import Display from './Display';
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
			fillRows: 3,
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
		this.currentAttackingPiece = null;
		this.currentMovingPiece = null;

		this.createBoard();
		this.createStyles();
		this.createFields();
		this.calcDiagonals();
		this.enhanceFields();

		this.display = new Display(this);
		this.display.update();
		this.container.parentNode.insertBefore(
			this.display.el, this.container.parentNode.children[0],
		);

		this.pieceCounts = {
			[DARK]: 0,
			[LIGHT]: 0,
		};

		if (!this.load()) {
			this.createPieces();
			this.setPlayer(LIGHT);
			this.enhancePieces();
		}

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
		this.setPlayer(LIGHT);
		this.initialize();
	}

	createBoard() {
		this.el = document.createElement('div');
		this.el.className = 'checkers-board';

		this.container.appendChild(this.el);
	}

	resetSelectable() {
		this.eachPiece((p) => p.setSelectable(false));
	}

	eachField(cb) {
		Object.values(this.fieldsByNum).forEach((f) => {
			if (f.playable) cb(f);
		});
	}

	eachPiece(cb) {
		Object.keys(this.piecesByNum).forEach((num) => {
			cb(this.piecesByNum[num]);
		});
	}

	endGame(winner) {
		this.clearSelection();

		const end = this.endEl = document.createElement('div');
		end.innerHTML = `${winner} won!<br/>Congrats!`;
		end.className = 'checkers-end';
		this.container.appendChild(end);
	}

	gameStep() {
		this.resetSelectable();
		this.clearSelection();

		if (this.pieceCounts[LIGHT] === 0) {
			this.endGame(DARK);
		} else if (this.pieceCounts[DARK] === 0) {
			this.endGame(LIGHT);
		} else {
			const cmp = this.currentMovingPiece;
			const cap = this.currentAttackingPiece;

			if (cap) {
				cap.select();
			}

			if (cmp && cmp.power && cmp.power === cmp.field.power) {
				this.runPower(cmp);
			} else if (cap) {
				const attacks = this.getAttacks(cap.field.num);

				if (attacks.length) {
					this.moves = attacks;

					attacks.forEach((a) => {
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
					this.moves = attacks;

					attacks.forEach((a) => {
						a.from.piece.setSelectable(true);
					});

					this.currentOnClick = this.playerAttackClick;
				} else {
					const moves = this.findPossibleMoves();

					if (!moves.length) {
						this.endGame(this.getOtherPlayer());
					} else {
						this.moves = moves;

						moves.forEach((m) => {
							m.from.piece.setSelectable(true);
						});

						this.currentOnClick = this.playerMoveClick;
					}
				}
			}
		}
	}

	runPower(piece) {
		if (piece.power) {
			piece.highlightPower();
			piece.power.activate(this, piece);
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

	playerAttackClick(e, num) {
		const el = e.target;

		if (
			// current player's piece clicked
			!this.currentAttackingPiece
			&& isChildOf(el, 'checkers-piece-selectable')
			&& isChildOf(el, 'checkers-piece-inner')
		) {
			this.clearSelection();
			this.piecesByNum[num].select();

			this.moves = this.getAttacks(num);
			this.moves.forEach((m) => {
				this.movesByNum[m.to.num] = m;
				m.to.highlight();
			});
		} else if (
			// highlighted field clicked
			isChildOf(el, 'checkers-field-highlight')
		) {
			const move = this.movesByNum[num];
			this.currentAttackingPiece = move.from.piece;
			this.currentMovingPiece = move.from.piece;
			this.runMove(move);
			this.save();
			this.gameStep();
		} else if (!this.currentAttackingPiece) {
			this.clearSelection();
		}
	}

	afterPowerUse(piece) {
		this.display.clearInfo();
		piece.unhighlightPower();
		this.currentMovingPiece = null;
		this.save();
		this.gameStep();
	}

	playerMoveClick(e, num) {
		const el = e.target;

		if (
			// current player's piece clicked
			isChildOf(el, 'checkers-piece-selectable')
			&& isChildOf(el, 'checkers-piece-inner')
		) {
			this.clearSelection();
			this.piecesByNum[num].select();

			this.moves = this.getMoves(num);
			this.moves.forEach((m) => {
				this.movesByNum[m.to.num] = m;
				m.to.highlight();
			});
		} else if (
			// highlighted field clicked
			isChildOf(el, 'checkers-field-highlight')
		) {
			const move = this.movesByNum[num];
			this.currentMovingPiece = move.from.piece;
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

		this.eachPiece((p) => {
			if (p.color === this.player) {
				const a = p.getAttacks();
				attacks.push(...a);
			}
		});

		return attacks;
	}

	findPossibleMoves() {
		const moves = [];

		this.eachPiece((p) => {
			if (p.color === this.player) {
				const m = p.getMoves();
				moves.push(...m);
			}
		});

		return moves;
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

		const powerSigns = Object.values(powers).map((p) => p.sign);

		const { piecesStr, fieldsStr, currentPlayer } = data;
		let num = '', c;
		for (let i = 0, len = piecesStr.length; i < len; i += 1) {
			c = piecesStr[i];
			if (c === 'A' || c === 'B') {
				const isQueen = piecesStr[i + 1] === 'Q';
				let powerSign = piecesStr[i + 2];
				if (!powerSigns.some((ps) => ps === powerSign)) {
					powerSign = null;
				}
				const piece = new Piece(this, c === 'A' ? DARK : LIGHT, {
					isQueen,
					powerSign,
				});
				i += 2;
				const field = this.fieldsByNum[num];
				piece.setField(field);
				num = '';
			} else {
				num += c;
			}
		}

		if (fieldsStr) {
			num = '';
			for (let i = 0, len = fieldsStr.length; i < len; i += 1) {
				c = fieldsStr[i];
				if (Number.isNaN(+c)) {
					let powerSign = c;
					const power = Object.values(powers).filter((p) => p.sign === powerSign)[0];
					const field = this.fieldsByNum[num];
					if (power && field) {
						field.setPower(power);
					}
					num = '';
				} else {
					num += c;
				}
			}
		}

		this.setPlayer(currentPlayer);

		return true;
	}

	save() {
		const pbn = this.piecesByNum;
		const piecesStr = Object.keys(pbn).map((num) => {
			const p = pbn[num];
			let str = num;
			str += p.color === DARK ? 'A' : 'B';
			str += p.isQueen ? 'Q' : '_';
			str += p.power ? p.power.sign : '_';
			return str;
		}).join('');

		const fbn = this.fieldsByNum;
		const fieldsStr = Object.keys(fbn).map((num) => {
			const f = fbn[num];
			if (!f.playable) {
				return null;
			}
			let str = num;
			str += f.power ? f.power.sign : '_';
			return str;
		}).filter(Boolean).join('');

		console.log(fieldsStr)

		window.localStorage.setItem('checkersData', JSON.stringify({
			config: this.config,
			piecesStr,
			fieldsStr,
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

	checkMakingQueen(piece) {
		if (piece.color === DARK) {
			if (piece.field.row === this.config.rows - 1) {
				piece.makeQueen();
			}
		} else if (piece.color === LIGHT) {
			if (piece.field.row === 0) {
				piece.makeQueen();
			}
		}
	}

	runMove(move) {
		const { from, to, attack } = move;

		const piece = from.piece;
		piece.setField(to, attack);

		this.checkMakingQueen(piece);

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
		this.display.update();
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
		if (this.display) {
			this.display.remove();
			this.display = null;
		}
	}
}

export default CheckersGame;
