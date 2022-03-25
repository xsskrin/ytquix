import { useRef, useEffect } from 'react';
import CheckersGame from './CheckersGame';

const Checkers = () => {
	const ref = useRef();

	useEffect(() => {
		const game = new CheckersGame(ref.current);
		return () => game.clear();
	}, []);

	return (
		<div className="checkers-wrapper" ref={ref} />
	);
};

Checkers.title = 'Checkers - JS Praktix';

export default Checkers;