import s from './sorting-visualization.module.sass';

class SortingItem {
	constructor(value) {
		this.value = value;

		this.el = document.createElement('div');
		this.el.innerHTML = value;
		this.el.className = s.item;
	}
}

export default SortingItem;
