

class GameOverScreen {
	constructor(game) {
		this.game = game;

		this.el = document.createElement('div');
		Object.assign(this.el.style, {
			position: 'absolute',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			zIndex: 200,
			color: '#fff',
			fontSize: '56px',
			textShadow: '1px 1px 1px rgba(0, 0, 0, .5)',
			top: '50%',
			left: '50%',
			textAlign: 'center',
			fontWeight: 'bold',
			whiteSpace: 'nowrap',
			transform: 'translateX(-50%) translateY(-50%)',
		});

		this.el.innerHTML = 'GAME OVER';

		this.gameScoreEl = document.createElement('div');
		Object.assign(this.gameScoreEl.style, {
			textAlign: 'center',
			color: '#fff',
			fontSize: '32px',
			textShadow: '1px 1px 1px rgba(0, 0, 0, .5)',
			fontWeight: 'bold',
			whiteSpace: 'nowrap',
			marginTop: '16px',
			padding: '12px 32px 16px',
			lineHeight: '1',
			cursor: 'pointer',
			borderRadius: '8px',
		});

		this.gameScoreEl.innerHTML = `Your score is: ${this.game.score >> 0}`;

		this.el.appendChild(this.gameScoreEl);

		this.gameRestartEl = document.createElement('div');
		Object.assign(this.gameRestartEl.style, {
			textAlign: 'center',
			color: '#fff',
			fontSize: '32px',
			textShadow: '1px 1px 1px rgba(0, 0, 0, .5)',
			fontWeight: 'bold',
			whiteSpace: 'nowrap',
			background: 'rgba(0, 0, 0, .75)',
			marginTop: '16px',
			padding: '12px 32px 16px',
			lineHeight: '1',
			cursor: 'pointer',
			borderRadius: '8px',
		});

		this.gameRestartEl.innerHTML = 'Play again';

		this.gameRestartEl.addEventListener('click', this.game.restart);

		this.el.appendChild(this.gameRestartEl);

		this.game.box.appendChild(this.el);
	}
}

export default GameOverScreen;
