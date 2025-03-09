// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./pages/Layout/Layout.tsx";
import FoodPage from "./pages/food/FoodPage.tsx";
import CartPage from "./pages/cart/CartPage.tsx";
import LoginForm from "./pages/login/LoginForm.tsx";
import RegisterForm from "./pages/login/RegisterForm.tsx";
import Home from "./pages/home/Home.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/food" element={<FoodPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/checkout" element={<div>Checkout Page (Placeholder)</div>} />
                </Route>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
        </Router>
    );
};

export default App;