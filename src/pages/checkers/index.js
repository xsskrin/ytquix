import { useRef, useEffect } from 'react';
import CheckersGame from './CheckersGame';
import PlayerPanel from './PlayerPanel';

const Checkers = () => {
	const ref = useRef();
	const gameRef = useRef();

	useEffect(() => {
		gameRef.current = new CheckersGame(ref.current, {
			rows: 6,
			cols: 6,
			fillRows: 1,
		});
		return () => gameRef.current.clear();
	}, []);

	return (
		<>
			<div className="checkers-menu">
				<div
					className="checkers-button"
					onClick={() => {
						gameRef.current.reset();
					}}
				>
					Reset
				</div>
			</div>
			<div
				className="checkers-wrapper"
				ref={ref}
				style={{ background: '#333' }}
			/>
			<div
				className="checkers-players"
			>
				<PlayerPanel
					color="white" player={1} game={gameRef.current}
				/>
				<PlayerPanel
					color="black" player={2} game={gameRef.current}
				/>
			</div>
		</>
	);
};

Checkers.title = 'Checkers - JS Praktix';

export default Checkers;
