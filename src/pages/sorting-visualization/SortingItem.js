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
		this.el.style.left = 14 + index * 56 + 'px';
	}
}

export default SortingItem;
