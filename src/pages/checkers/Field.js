

class Field {
	constructor(game, row, col) {
		this.game = game;
		this.row = row;
		this.col = col;

		const dark = Boolean((row + col) % 2);
		const colorStr = dark ? 'dark' : 'light';

		this.playable = !dark;

		this.el = document.createElement('div');
		this.el.className = 'checkers-field';
		this.el.className += ` checkers-field-${colorStr}`;

		const num = row * game.config.cols + col;
		this.num = num;
		this.el.setAttribute('data-num', num);

		this.el.style.left = this.game.getBoardLeft(col);
		this.el.style.top = this.game.getBoardTop(row);
	}

	highlight() {
		this.el.classList.add('checkers-field-highlight');
	}

	unhighlight() {
		this.el.classList.remove('checkers-field-highlight');
	}

	getDiagonalField(rowChange, colChange) {
		return this.game.getField(
			this.row + rowChange, this.col + colChange,
		);
	}

	isEmpty() {
		return !this.piece;
	}

	hasPiece(color) {
		return this.piece && this.piece.color === color;
	}

	setPower(power) {
		this.power = power;
		this.powerEl = document.createElement('div');
		this.powerEl.className = 'checkers-field-power';
		this.powerEl.className += ` checkers-field-power-${power.name}`;
		this.powerEl.style.background = power.color;

		if (power.icon) {
			const svg = document.createElement('div');
			svg.innerHTML = power.icon;
			svg.style.margin = '25%';
			svg.style.opacity = '.5';
			svg.style.webkitFilter = 'brightness(0)';
			this.powerEl.appendChild(svg);
		}

		this.el.appendChild(this.powerEl);
	}
}

export default Field;
