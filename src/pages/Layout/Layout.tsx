// Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../../components/NavBar/Navbar.tsx";

const Layout: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Layout;