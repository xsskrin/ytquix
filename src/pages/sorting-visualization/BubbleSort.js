import SortingItem from './SortingItem';
import s from './sorting-visualization.module.sass';

class BubbleSort {
	constructor(container) {
		this.container = container;

		this.el = document.createElement('div');
		this.el.className = s.items;

		this.container.appendChild(this.el);

		this.items = [];

		this.numbers = [5, 3, 4, 1, 2];

		this.numbers.forEach((n, index) => {
			this.createItem(n, index);
		});
	}

	createItem(value, index) {
		const item = new SortingItem(value, index);
		this.items.push(item);

		this.el.appendChild(item.el);
	}

	run() {
		const arr = this.items;
		let i = 0;
		let n = arr.length - 1;

		const step = async () => {
			if (i < n) {
				const left = arr[i];
				const right = arr[i + 1];


				if (left.value >= right.value) {
					await Promise.all([
						left.highlight('red'),
						right.highlight('red'),
					]);
					
					arr[i] = right;
					arr[i + 1] = left;
					await Promise.all([
						right.setIndex(i),
						left.setIndex(i + 1),
					]);
				} else {
					await Promise.all([
						left.highlight('green'),
						right.highlight('green'),
					]);
				}
				i += 1;

				await Promise.all([
					left.unhighlight(),
					right.unhighlight(),
				]);

				setTimeout(step, 500);
			} else if (n > 1) {
				n -= 1;
				i = 0;
				setTimeout(step, 500);
			}
		};

		step();
	}

	clear() {
		if (this.el.parentNode) {
			this.el.parentNode.removeChild(this.el);
		}
	}
}

export default BubbleSort;
