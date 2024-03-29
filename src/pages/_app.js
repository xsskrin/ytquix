import React from 'react';
import Head from 'next/head';
import 'styles/globals.sass';
import s from './layout.module.sass';

function Layout({ title, children }) {
	return (
		<div className={s.layout}>
			<Head>
				<title>{title}</title>
				<link rel="icon" href="/logo.jpg" />
			</Head>
			{title && (
				<div className={s.title}>
					{title}
				</div>
			)}
			{children}
		</div>
	);
}

function MyApp({ Component, pageProps }) {
	let layoutProps = { ...pageProps };
	let layout = Component.layout === undefined ? Layout : Component.layout;

	layoutProps.title = Component.title;

	if (layout === null) {
		layout = React.Fragment;
		layoutProps = {};
	}

	return React.createElement(layout, layoutProps, (
		<Component {...pageProps} />
	));
}

export default MyApp
