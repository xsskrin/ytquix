import Head from 'next/head';
import Link from 'next/link';
import s from './index.module.sass';

const Episode = function (num, title, url) {
	this.num = num;
	this.title = title;
	this.url = url;
};

const episodes = [
	new Episode('1.', 'Canvas Square', '/canvas-square'),
];

export default function Home() {
	return (
		<div className={s.container}>
			<Head>
				<title>JS Praktix</title>
			</Head>
			<div className={s.header}>
				<img className={s.logo} src="/logo.jpg" />
			</div>
			<svg
				className={s.headerDeco}
				xmlns="http://www.w3.org/2000/svg"
				width="100%"
				height="50px"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
			>
				<path d="M0,0 L 0,100 C 25 25, 75 25, 100,100 L 100,0 Z" vector-effect="non-scaling-stroke"/>
			</svg>
			<div className={s.items}>
				{episodes.map((episode) => {
					return (
						<Link href={episode.url}>
							<div className={s.item}>
								<div className={s.num}>
									{episode.num}
								</div>
								<div className={s.title}>
									{episode.title}
								</div>
								<div className={s.cover}>
									<div className={s.coverContent}>
										<div className={s.num}>
											{episode.num}
										</div>
										<div className={s.title}>
											{episode.title}
										</div>
										<div className={s.arrow}>

										</div>
									</div>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	)
}
