import { DARK } from './consts';

class Display {
	constructor(game) {
		this.game = game;
		this.el = document.createElement('div');
		this.el.className = 'checkers-display';

		this.playerTurnEl = document.createElement('div');
		this.playerTurnEl.className = 'checkers-display-player';

		this.infoEl = document.createElement('div');
		this.infoEl.className = 'checkers-display-info';

		this.el.appendChild(this.playerTurnEl);
		this.el.appendChild(this.infoEl);
	}

	update() {
		this.playerTurnEl.innerHTML = this.game.player === DARK ? 'DARK\'s turn' : 'LIGHT\'s turn';
	}

	appendTo(container) {
		this.container = container;
		container.appendChild(this.el);
	}

	remove() {
		if (this.el.parentNode) {
			this.el.parentNode.removeChild(this.el);
		}
	}

	showInfo(html) {
		this.infoEl.innerHTML = html;
		this.el.classList.add('checkers-display-show-info');
	}

	clearInfo() {
		this.infoEl.innerHTML = '';
		this.el.classList.remove('checkers-display-show-info');
	}
}

export default Display;
