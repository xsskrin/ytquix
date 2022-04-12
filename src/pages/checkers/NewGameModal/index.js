import { useState } from 'react';
import s from './new-game-modal.module.sass';

const NewGameModal = ({ onConfirm, onClose }) => {
	const [values, setValues] = useState({
		rows: 8,
		cols: 8,
		fillRows: 3,
	});

	return (
		<div className={s.wrapper} onClick={(e) => onClose()}>
			<div className={s.content} onClick={(e) => e.stopPropagation()}>
				<div className={s.title}>
					New game
				</div>
				<div className={s.form}>
					<div className={s.label}>Rows</div>
					<input
						value={values.rows}
						onChange={(e) => {
							setValues({ ...values, rows: e.target.value });
						}}
					/>
					<div className={s.label}>Cols</div>
					<input
						value={values.cols}
						onChange={(e) => {
							setValues({ ...values, cols: e.target.value });
						}}
					/>
					<div className={s.label}>Fill rows</div>
					<input
						value={values.fillRows}
						onChange={(e) => {
							setValues({ ...values, fillRows: e.target.value });
						}}
					/>
					<div
						className={s.button}
						onClick={() => {
							onConfirm(values);
						}}
					>
						Play
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewGameModal;
