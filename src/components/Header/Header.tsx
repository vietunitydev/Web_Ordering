import cart_icon from '../../assets/cart_icon.svg'
import grass_icon from '../../assets/grass_icon.png'
import "./Header.css";

const Header = () => {
    return (
        <nav className="navbar">
            <div className="logo">EATNOW.</div>
            <ul className="nav-links">
                <li>Đồ Ăn</li>
                <li>Thực phẩm</li>
                <li>Rượu bia</li>
                <li>Hoa</li>
                <li>Thuốc</li>
            </ul>
            <div className="nav-actions">
                <div className="nav-actions-input-cart">
                    <img src={grass_icon}/>
                    <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm" />
                    </div>
                    <div className="cart-icon">
                        <img src={cart_icon} alt="cart_icon" width={30}/>
                        <span className="cart-badge">2</span>
                    </div>
                </div>
                <button className="login-btn">Đăng nhập</button>
            </div>
        </nav>
    );
};

export default Header;
