import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderHistoryPage.css';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    date: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: string;
    deliveryInfo: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        phone: string;
    };
}

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    // Load order history from localStorage on mount
    useEffect(() => {
        const orderHistory = localStorage.getItem('orderHistory');
        if (orderHistory) {
            setOrders(JSON.parse(orderHistory));
        }
    }, []);

    // Navigate back to home if needed
    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="order-history-page">
            <div className="order-history-container">
                <div className="order-history-header">
                    <h2>Lịch sử đặt hàng</h2>
                    <button className="back-btn" onClick={handleBackToHome}>
                        Quay lại trang chủ
                    </button>
                </div>
                {orders.length === 0 ? (
                    <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
                ) : (
                    <div className="order-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-item">
                                <div className="order-header">
                                    <h3>Đơn hàng #{order.id}</h3>
                                    <span className={`status ${order.status === 'Đang xử lý' ? 'processing' : 'completed'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="order-date">Ngày đặt: {order.date}</p>
                                <div className="order-details">
                                    <h4>Chi tiết đơn hàng</h4>
                                    <table className="order-table">
                                        <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Giá</th>
                                            <th>Tổng</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price.toFixed(2)}</td>
                                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    <div className="order-summary">
                                        <p>Phí giao hàng: ${order.deliveryFee.toFixed(2)}</p>
                                        <p>Tổng cộng: ${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="delivery-info">
                                    <h4>Thông tin giao hàng</h4>
                                    <p>Họ tên: {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
                                    <p>Email: {order.deliveryInfo.email}</p>
                                    <p>Địa chỉ: {order.deliveryInfo.address}</p>
                                    <p>Số điện thoại: {order.deliveryInfo.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;