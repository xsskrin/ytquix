import { useRef, useEffect } from 'react';
import CheckersGame from './CheckersGame';

const Checkers = () => {
	const ref = useRef();

	useEffect(() => {
		const game = new CheckersGame(ref.current, {
			rows: 8,
			cols: 8,
			fillRows: 3,
		});
		return () => game.clear();
	}, []);

	return (
		<div
			className="checkers-wrapper"
			ref={ref}
			style={{ background: 'black' }}
		/>
	);
};

Checkers.title = 'Checkers - JS Praktix';

export default Checkers;
