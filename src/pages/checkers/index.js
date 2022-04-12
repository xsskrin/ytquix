import { useRef, useEffect, useState } from 'react';
import CheckersGame from './CheckersGame';
import PlayerPanel from './PlayerPanel';
import NewGameModal from './NewGameModal';
import { onClickOutside } from './utils';

const Checkers = () => {
	const ref = useRef();
	const gameRef = useRef();
	const menuRef = useRef();

	useEffect(() => {
		let config = window.localStorage.getItem('checkersConfig');
		try {
			config = JSON.parse(config);
		} catch (e) {}

		gameRef.current = new CheckersGame(ref.current, config || {
			rows: 6,
			cols: 6,
			fillRows: 2,
		});
		return () => gameRef.current.clear();
	}, []);

	const [menu, setMenu] = useState(false);
	const [modal, setModal] = useState('');

	useEffect(() => {
		if (menu) {
			return onClickOutside(menuRef.current, () => {
				setMenu(false);
			});
		}
	}, [menu]);

	return (
		<>
			<div className="checkers-menu" ref={menuRef}>
				<div
					className="checkers-menu-cog"
					onClick={() => {
						setMenu(!menu);
					}}
				>
					MENU
				</div>
				{menu && (
					<div
						className="checkers-menu-panel"
					>
						<div
							className="checkers-menu-button"
							onClick={() => {
								setModal('newGame');
								setMenu(false);
							}}
						>
							New game
						</div>
						<div
							className="checkers-menu-button"
							onClick={() => {
								gameRef.current.reset();
								setMenu(false);
							}}
						>
							Reset
						</div>
					</div>
				)}
			</div>
			{modal === 'newGame' && (
				<NewGameModal
					onClose={() => {
						setModal('');
					}}
					onConfirm={(data) => {
						setModal('');
						window.localStorage.setItem('checkersConfig', JSON.stringify(data));
						gameRef.current.setConfig(data);
						gameRef.current.reset();
					}}
				/>
			)}
			<div className="checkers-arena">
				{/* <PlayerPanel
					color="white" player={1} game={gameRef.current}
				/> */}
				<div
					className="checkers-wrapper"
					ref={ref}
				/>
				{/* <PlayerPanel
					color="black" player={2} game={gameRef.current}
				/> */}
			</div>
		</>
	);
};

Checkers.layout = null;
Checkers.title = 'Checkers - JS Praktix';

export default Checkers;
