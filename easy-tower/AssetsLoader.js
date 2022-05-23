

class AssetsLoader {
	constructor() {
		this.assets = {};
		this.toLoad = {};
		this.loaded = 0;
	}

	load() {
		return new Promise((resolve, reject) => {
			this.__resolve = resolve;
			
			Object.keys(this.toLoad).forEach((key) => {
				this.loadImage(key, this.toLoad[key]);
			});
		});
	}

	add(name, src) {
		this.toLoad[name] = src;
	}

	loadImage(name, src) {
		const img = new Image();
		img.onload = () => {
			this.assets[name] = img;
			this.onAnyLoad(name);
		};
		img.src = src;
	}

	onAnyLoad(name) {
		delete this.toLoad[name];

		if (!Object.values(this.toLoad).length) {
			this.__resolve();
		}
	}
}

export default AssetsLoader;
