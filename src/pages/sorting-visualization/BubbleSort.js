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

		this.numbers.forEach((n) => {
			this.createItem(n);
		});
	}

	createItem(value) {
		const item = new SortingItem(value);
		this.items.push(item);

		this.el.appendChild(item.el);
	}

	clear() {
		if (this.el.parentNode) {
			this.el.parentNode.removeChild(this.el);
		}
	}
}

export default BubbleSort;
