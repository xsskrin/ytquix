import { useRef, useEffect } from 'react';
import BubbleSort from './BubbleSort';
import s from './sorting-visualization.module.sass';

const SortingVisualization = () => {
	const ref = useRef();

	useEffect(() => {
		const bubbleSort = new BubbleSort(ref.current);

		return () => bubbleSort.clear();
	}, []);

	return (
		<div className={s.wrapper} ref={ref} />
	);
};

SortingVisualization.title = 'Sorting Visualization - JS Praktix';

export default SortingVisualization;
