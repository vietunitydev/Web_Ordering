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
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.tsx";
import OrderHistoryPage from "./pages/OderHistoryPage/OrderHistoryPage.tsx";
import AddItemPage from "./pages/admin/AddItemPage.tsx";
import ListItemsPage from "./pages/admin/ListItemPage.tsx";
import AdminOrdersPage from "./pages/admin/AdminOrderPage.tsx";
import {AppProvider} from "./components/AppContext/AppContext.tsx";


const App: React.FC = () => {
    return (
        <Router>
            <AppProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home/>} />
                        <Route path="/food" element={<FoodPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/checkout" element={<CheckoutPage/>} />
                        <Route path="/order-history" element={<OrderHistoryPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                    </Route>

                    <Route path="/admin" element={<AddItemPage />} />
                    <Route path="/admin/add-item" element={<AddItemPage />} />
                    <Route path="/admin/list-items" element={<ListItemsPage />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                </Routes>
            </AppProvider>
        </Router>
    );
};

export default App;