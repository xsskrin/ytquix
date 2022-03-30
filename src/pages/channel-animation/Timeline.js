

class Timeline {
	constructor() {
		this.time = 0;
		this.duration = 0;
		this.callbacks = [];
	}

	add(callback, config) {
		let time;
		if (typeof config === 'number') {
			time = config;
			config = {};
		} else {
			config = config || {};
			time = config.time || 1000;
		}

		const lastCallback = this.callbacks[this.callbacks.length - 1] || {};
		let start = config.start || lastCallback.end || 0;
		if (config.offset) {
			start += config.offset;
		}

		this.callbacks.push({
			callback,
			start,
			end: start + time,
			duration: time,
		});

		if (start + time > this.duration) {
			this.duration = start + time;
		}
	}

	update(time) {
		this.callbacks.forEach((cb) => {
			if (time >= cb.start) {
				if (time <= cb.end) {
					cb.callback((time - cb.start) / cb.duration);
				} else {
					cb.callback(1);
				}
			} else {
				cb.callback(0);
			}
		});

		if (time >= this.duration) {
			this.onEnd();
		}
	}
}

export default Timeline;
