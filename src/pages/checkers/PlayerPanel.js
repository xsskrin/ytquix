import { useMemo } from 'react';
import powers from './powers';

const PlayerPanel = ({
	player,
	color,
	game,
}) => {
	const cls = useMemo(() => {
		return `checkers-player-panel checkers-player-panel-${color}`;
	}, [color]);

	return (
		<div className={cls}>
			Player {player}
			<div className="checkers-player-powers">
				{Object.values(powers).map((power) => {
					return (
						<div
							key={power.color}
							className="checkers-player-power"
							style={{
								border: `2px solid ${power.color}`,
							}}
						>
							<div
								className="checkers-player-power-bg"
								style={{
									background: power.color,
								}}
							/>
							<div
								className="checkers-player-power-fill"
								style={{
									background: power.color,
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PlayerPanel;
