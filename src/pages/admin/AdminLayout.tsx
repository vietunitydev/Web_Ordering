import { useNavigate } from 'react-router-dom';
import './AdminLayout.css';
import plus from '../../assets/plus.png';
import item_lists from '../../assets/item_lists.png';
import orders from '../../assets/orders.png';
import users_icon from '../../assets/avatar_icon.png';
import {actions, useAppContext} from "../../components/AppContext/AppContext.tsx";

const AdminLayout: React.FC<{ children: React.ReactNode; activePage: string }> = ({ children, activePage }) => {
    const navigate = useNavigate();
    const { dispatch } = useAppContext();

    const handleLogout = () => {
        dispatch({ type: actions.LOGOUT });
        navigate('/home');
    };

    return (
        <div className="admin-layout">
            <div className="admin-header">
                <div>
                    <h1>EATNOW.</h1>
                    <p>Admin Panel</p>
                </div>
                <div className="admin-user">
                    <button onClick={handleLogout}>👤 Đăng xuất</button>
                </div>
            </div>
            <div className="admin-content">
                <div className="admin-sidebar">
                    <button
                        className={`sidebar-btn ${activePage === 'add-item' ? 'active' : ''}`}
                        onClick={() => navigate('/admin/add-item')}
                    >
                        <img src={plus} alt="Add Item" />
                        <p>Add item</p>
                    </button>
                    <button
                        className={`sidebar-btn ${activePage === 'list-items' ? 'active' : ''}`}
                        onClick={() => navigate('/admin/list-items')}
                    >
                        <img src={item_lists} alt="List Items" />
                        <p>List items</p>
                    </button>
                    <button
                        className={`sidebar-btn ${activePage === 'orders' ? 'active' : ''}`}
                        onClick={() => navigate('/admin/orders')}
                    >
                        <img src={orders} alt="Orders" />
                        <p>Orders</p>
                    </button>
                    <button
                        className={`sidebar-btn ${activePage === 'users' ? 'active' : ''}`}
                        onClick={() => navigate('/admin/users')}
                    >
                        <img src={users_icon} alt="Users" />
                        <p>Users</p>
                    </button>
                </div>
                <div className="admin-main">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;