import { useRef, useEffect, useMemo, useState } from 'react';
import BubbleSort from './BubbleSort';
import InsertionSort from './InsertionSort';
import s from './sorting-visualization.module.sass';

const SortingVisualization = () => {
	const ref = useRef();

	const algorithms = useMemo(() => {
		return [
			{ title: 'Bubble sort', implementation: BubbleSort },
			{ title: 'Insertion sort', implementation: InsertionSort },
		];
	}, []);

	const [algorithm, setAlgorithm] = useState(algorithms[1]);

	useEffect(() => {
		const Algorithm = algorithm.implementation;
		const sorting = new Algorithm(ref.current);

		sorting.run();

		return () => sorting.clear();
	}, [algorithm]);

	return (
		<div className={s.wrapper} ref={ref}>
			<div className={s.options}>
				{algorithms.map((a) => {
					const selected = a === algorithm;

					let cls = s.option;
					if (selected) {
						cls += ` ${s.optionSelected}`;
					}

					return (
						<div
							key={a.title}
							className={cls}
							onClick={() => {
								setAlgorithm(a);
							}}
						>
							{a.title}
						</div>
					);
				})}
			</div>
			<div className={s.sortingContainer} ref={ref} />
		</div>
	);
};

SortingVisualization.title = 'Sorting Visualization - JS Praktix';

export default SortingVisualization;
