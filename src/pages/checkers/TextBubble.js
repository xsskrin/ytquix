import * as groups from './texts';

class TextBubble {
	constructor(textsGroup, config) {
		const texts = groups[textsGroup];
		const randomText = texts[Math.floor(Math.random() * texts.length)];

		this.text = randomText;
		this.config = config || {};

		this.el = document.createElement('div');
		this.el.className = 'checkers-text-bubble';

		this.textEl = document.createElement('div');
		this.textEl.className = 'ctb-text';
		this.el.appendChild(this.textEl);

		this.arrowEl = document.createElement('div');
		this.arrowEl.innerHTML = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24px"
				height="16px"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				class="ctb-arrow"
			>
				<polyline
					fill="#fff"
					stroke="#000"
					stroke-width="3"
					points="50,0 0,100 100,0"
					vector-effect="non-scaling-stroke"
				/>
			</svg>
		`;
		this.el.appendChild(this.arrowEl);
	}

	appendTo(container) {
		this.container = container;
		container.appendChild(this.el);
	}

	start() {
		const t = this.text;
		const len = t.length;
		let i = 0;

		const step = () => {
			if (i < len) {
				this.textEl.innerHTML += t[i];
				i += 1;
				setTimeout(step, parseInt(50 + Math.random() * 50));
			} else {
				if (this.config.onTypingEnd) {
					this.config.onTypingEnd();
				}
				setTimeout(this.remove, 500);
			}
		};

		step();
	}

	remove = () => {
		this.el.classList.add('ctb-removing');

		setTimeout(() => {
			if (this.el.parentNode) {
				this.el.parentNode.removeChild(this.el);
			}
			if (this.config.onDone) {
				this.config.onDone();
			}
		}, 200);
	}
}

export default TextBubble;
