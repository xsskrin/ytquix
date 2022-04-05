

class Diagonal {
	constructor(game) {
		this.game = game;
		this.fields = [];
	}

	add(field) {
		this.fields.push(field);
	}

	highlight() {
		this.fields.forEach((field) => {
			field.highlight();
		});
	}

	unhighlight() {
		this.fields.forEach((field) => {
			field.unhighlight();
		});
	}

	findAttacks(forPlayer) {
		const attacks = [];
		const f = this.fields;

		for (let i = 0, len = f.length - 2; i < len; i += 1) {
			const a = f[i];
			const b = f[i + 1];
			const c = f[i + 2];

			if (
				a.piece
				&& b.piece
				&& !c.piece
				&& a.piece.color === forPlayer
				&& b.piece.color !== forPlayer
			) {
				attacks.push({
					from: a,
					attack: b,
					to: c,
				});
			} else if (
				!a.piece
				&& b.piece
				&& c.piece
				&& c.piece.color === forPlayer
				&& b.piece.color !== forPlayer
			) {
				attacks.push({
					from: c,
					attack: b,
					to: a,
				});
			}
		}

		return attacks;
	}
}

export default Diagonal;
