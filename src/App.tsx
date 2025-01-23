import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Customers from './components/Customers';
import Bills from './components/Bills';
import BillDetails from './components/BillDetails';
import Products from './components/Products';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/dashboard/bills/:customerId" element={<Bills />} /> {/* Updated route */}
                <Route path="/bill-details/:id" element={<BillDetails />} />
                <Route path="/products" element={<Products />} />
            </Routes>
        </Router>
    );
}

export default App;