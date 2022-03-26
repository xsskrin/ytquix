import Board from './Board';

class CheckersGame {
	constructor(container) {
		this.container = container;

		this.board = new Board();
		this.board.appendTo(this.container);

		this.board.fillWithPieces();
	}

	clear() {
		this.container.innerHTML = '';
	}
}

export default CheckersGame;
