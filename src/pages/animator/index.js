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
			className="channel-animation"
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

ChannelAnimation.layout = null;
ChannelAnimation.title = 'Channel animation - JS Praktix';

export default ChannelAnimation;
