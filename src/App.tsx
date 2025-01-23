// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Customers from './components/Customers/Customers.tsx';
import Bills from './components/Bills/Bills.tsx';
import BillDetails from './components/BillDetails/BillDetails.tsx';
import Products from './components/Products/Products.tsx';
import Home from './components/Home/Home.tsx';
import Login from './components/Login/Login.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import Layout from './components/Layout/Layout.tsx';

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout><ProtectedRoute><Home /></ProtectedRoute></Layout>} />
                <Route path="/customers" element={<Layout><ProtectedRoute><Customers /></ProtectedRoute></Layout>} />
                <Route path="/dashboard/bills/:customerId" element={<Layout><ProtectedRoute><Bills /></ProtectedRoute></Layout>} />
                <Route path="/bill-details/:id" element={<Layout><ProtectedRoute><BillDetails /></ProtectedRoute></Layout>} />
                <Route path="/products" element={<Layout><ProtectedRoute><Products /></ProtectedRoute></Layout>} />
                <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;