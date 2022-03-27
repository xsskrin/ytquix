import Field from './Field';
import Piece from './Piece';
import { DARK, LIGHT } from './consts';

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

		this.createFieldStyle();
		this.createFields();
		this.createPieces();
		this.setPlayer(DARK);
	}

	createFieldStyle() {
		const { rows, cols } = this.config;
		const style = document.createElement('style');
		style.innerHTML = `
			.checkers-field {
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
				const piece = new Piece(DARK);
				const field = this.fieldsByNum[i * cols + j];
				piece.setField(field);
			}
		}
		for (let i = rows - fillRows; i < rows; i += 1) {
			for (let j = i % 2; j < cols; j += 2) {
				const piece = new Piece(LIGHT);
				const field = this.fieldsByNum[i * cols + j];
				piece.setField(field);
			}
		}
	}

	setPlayer(player) {
		this.player = player;
		this.setNamespaceClass('player', player);
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
