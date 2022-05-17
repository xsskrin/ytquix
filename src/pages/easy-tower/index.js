import { useEffect, useRef } from 'react';
import EasyTower from '../../../easy-tower';

const C = function () {
	const ref = useRef();

	useEffect(() => {
		const easyTower = new EasyTower(ref.current);

		return () => easyTower.clear();
	}, []);

	return (
		<div ref={ref} />
	);
};

export default C;
