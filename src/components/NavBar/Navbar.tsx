// Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cart_icon from '../../assets/cart_icon.svg';
import grass_icon from '../../assets/grass_icon.png';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Check login state and cart on mount
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
        }

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate('/home');
    };

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/food?search=${searchTerm}`);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/home">EATNOW.</Link>
            </div>
            <ul className="nav-links">
                <li>
                    <Link to="/food?category=food">Đồ Ăn</Link>
                </li>
                <li>
                    <Link to="/food?category=food">Thực phẩm</Link>
                </li>
                <li>
                    <Link to="/food?category=alcohol">Rượu bia</Link>
                </li>
                <li>
                    <Link to="/food?category=flowers">Hoa</Link>
                </li>
                <li>
                    <Link to="/food?category=medicine">Thuốc</Link>
                </li>
            </ul>
            <div className="nav-actions">
                <div className="nav-actions-input-cart">
                    <img src={grass_icon} alt="grass_icon" />
                    <div className="search-box">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="cart-icon">
                        <Link to="/cart">
                            <img src={cart_icon} alt="cart_icon" width={30} />
                            <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </Link>
                    </div>
                </div>
                {isLoggedIn ? (
                    <div className="avatar-container">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="Avatar"
                            className="avatar"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="dropdown">
                                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                                    Sửa đổi thông tin cá nhân
                                </Link>
                                <button onClick={handleLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;