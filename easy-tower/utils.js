

export const randomInt = (a, b) => {
	return (a + Math.random() * (b - a)) >> 0;
};
