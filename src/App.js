import React from 'react';
import Header from './components/Header/Header.js';
import Home from './pages/Home.js';
import Cart from './pages/Cart.js';
import NotFound from './pages/NotFound.js';

import './scss/app.scss';
import { Route, Routes } from 'react-router-dom';


function App() {
	
 	return (
		<div className="wrapper">
				<Header />
				<div className="content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="*" element={<NotFound />} />	
					</Routes>
				</div>
		</div>
	);
}

export default App;
