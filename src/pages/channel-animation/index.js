import { useRef, useEffect } from 'react';
import Animation from './Animation';

const ChannelAnimation = () => {
	const ref = useRef();

	useEffect(() => {
		const animation = new Animation(ref.current);
		return () => animation.clear();
	}, []);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: 0,
			}}
		>
			<canvas
				ref={ref}
				style={{
					flexGrow: 1,
				}}
			/>
		</div>
	);
};

ChannelAnimation.title = 'Checkers - JS Praktix';

export default ChannelAnimation;
