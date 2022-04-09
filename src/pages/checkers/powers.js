import fireSvg from '!raw-loader!./icons/fire.svg';
import waterSvg from '!raw-loader!./icons/water.svg';
import windSvg from '!raw-loader!./icons/wind.svg';
import earthSvg from '!raw-loader!./icons/earth.svg';

const powers = {};

powers.fire = {
	color: '#ff7114',
	icon: fireSvg,
	activate(game) {
		game.__saveOnClick = game.currentOnClick;
		game.currentOnClick = (e, num) => {
			const otherPlayer = game.getOtherPlayer();

			if (e.className.indexOf('checkers-piece-')) {

			}
		};
	},
};

powers.water = {
	color: '#0085a5',
	icon: waterSvg,
};
powers.earth = {
	color: '#264d00',
	icon: earthSvg,
};
powers.wind = {
	color: '#553361',
	icon: windSvg,
};

Object.keys(powers).map((key) => {
	powers[key].name = key;
	powers[key].cancel = () => {
		if (game.__saveOnClick) {
			game.currentOnClick = game.__saveOnClick;
		}
	};
});

export default powers;
