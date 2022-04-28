import s from './sorting-visualization.module.sass';

class SortingItem {
	constructor(value, index) {
		this.value = value;

		this.el = document.createElement('div');
		this.el.innerHTML = value;
		this.el.className = s.item;

		this.setIndex(index);
	}

	setIndex(index) {
		this.index = index;

		return new Promise((resolve) => {
			this.el.style.left = 14 + index * 56 + 'px';
			setTimeout(resolve, 250);
		});
	}

	highlight(color) {
		return new Promise((resolve) => {
			this.el.style.background = color;
			setTimeout(resolve, 250);
		});
	}

	unhighlight() {
		return new Promise((resolve) => {
			this.el.style.removeProperty('background');
			setTimeout(resolve, 250);
		});
	}
}

export default SortingItem;
