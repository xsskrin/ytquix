import SortingItem from './SortingItem';
import s from './sorting-visualization.module.sass';

class InsertionSort {
	constructor(container) {
		this.container = container;

		this.el = document.createElement('div');
		this.el.className = s.items;

		this.container.appendChild(this.el);

		this.items = [];

		this.numbers = [10, 30, 40, 10, 20];

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
		// Will be implemented in the next episode
	}

	clear() {
		if (this.el.parentNode) {
			this.el.parentNode.removeChild(this.el);
		}
	}
}

export default InsertionSort;
