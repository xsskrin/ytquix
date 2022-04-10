import fireSvg from '!raw-loader!./icons/fire.svg';
import waterSvg from '!raw-loader!./icons/water.svg';
import windSvg from '!raw-loader!./icons/wind.svg';
import earthSvg from '!raw-loader!./icons/earth.svg';
import { isChildOf } from './utils';

const powers = {};

powers.fire = {
	color: '#ff7114',
	icon: fireSvg,
	activate(game, piece) {
		game.__saveOnClick = game.currentOnClick;
		game.currentOnClick = (e, num) => {
			const el = e.target;
			const otherPlayer = game.getOtherPlayer();

			if (isChildOf(el, 'checkers-piece')) {
				const targetedPiece = game.piecesByNum[num];
				if (targetedPiece.color !== piece.color) {
					targetedPiece.remove();
					game.afterPowerUse(piece);
				}
			}
		};

		game.display.showInfo(`
			Using <span style="color: ${this.color}">FIRE</span> power!
			<br/>Choose an enemy piece
		`.trim());
	},
};

powers.water = {
	color: '#0085a5',
	icon: waterSvg,
	activate(game, piece) {
		game.__saveOnClick = game.currentOnClick;
		game.currentOnClick = (e, num) => {
			const el = e.target;
			const otherPlayer = game.getOtherPlayer();

			if (isChildOf(el, 'checkers-piece')) {
				const targetedPiece = game.piecesByNum[num];
				if (targetedPiece.color !== piece.color) {
					targetedPiece.removePower();
					game.afterPowerUse(piece);
				}
			}
		};

		game.display.showInfo(`
			Using <span style="color: ${this.color}">WATER</span> power!
			<br/>Choose an enemy piece
		`.trim());
	},
};
powers.earth = {
	color: '#6ab04c',
	icon: earthSvg,
	activate(game, piece) {
		game.__saveOnClick = game.currentOnClick;
		game.currentOnClick = (e, num) => {
			const el = e.target;
			const otherPlayer = game.getOtherPlayer();

			if (isChildOf(el, 'checkers-piece')) {
				const targetedPiece = game.piecesByNum[num];
				if (targetedPiece.color !== piece.color) {
					targetedPiece.removePower();
					game.afterPowerUse(piece);
				}
			}
		};

		game.display.showInfo(`
			Using <span style="color: ${this.color}">EARTH</span> power!
			<br/>Choose an enemy piece
		`.trim());
	},
};
powers.wind = {
	color: '#a55eea',
	icon: windSvg,
	activate(game, piece) {
		game.__saveOnClick = game.currentOnClick;
		game.currentOnClick = (e, num) => {
			const el = e.target;
			const otherPlayer = game.getOtherPlayer();

			if (isChildOf(el, 'checkers-piece')) {
				const targetedPiece = game.piecesByNum[num];
				if (targetedPiece.color !== piece.color) {
					targetedPiece.removePower();
					game.afterPowerUse(piece);
				}
			}
		};

		game.display.showInfo(`
			Using <span style="color: ${this.color}">WIND</span> power!
			<br/>Choose an enemy piece
		`.trim());
	},
};

Object.keys(powers).map((key) => {
	powers[key].name = key;
	powers[key].sign = key[0];
	powers[key].cancel = () => {
		if (game.__saveOnClick) {
			game.currentOnClick = game.__saveOnClick;
		}
	};
});

export default powers;
