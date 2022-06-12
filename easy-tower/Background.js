

class Background {
	constructor(game) {
		this.game = game;
		this.lastEnd = 0;
		this.images = [];

		this.el = document.createElement('div');

		Object.assign(this.el.style, {
			position: 'absolute',
			zIndex: 10,
			bottom: 0,
			left: 0,
			width: '100%',
			height: '0',
		});
	}

	addImage(img, chasingEnd) {
		const image = {};

		image.img = img;
		image.src = img.src;
		image.el = document.createElement('div');
		image.chasingStart = this.lastEnd;
		image.chasingEnd = chasingEnd;
		this.lastEnd = chasingEnd;

		this.images.push(image);

		Object.assign(image.el.style, {
			position: 'absolute',
			zIndex: 10,
			bottom: `${image.chasingStart}px`,
			left: 0,
			width: '100%',
			height: chasingEnd - image.chasingStart + 'px',
			backgroundImage: `url('${image.src}')`,
			backgroundPosition: 'bottom',
			backgroundSize: `auto ${chasingEnd - image.chasingStart}px`,
			backgroundRepeat: 'no-repeat',
		});

		this.el.appendChild(image.el);
	}

	setChasing(y) {
		this.el.style.bottom = -y + 'px';
	}
}

export default Background;
